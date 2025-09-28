import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Assessment {
  id?: number;
  student_id: string;
  assessment_type: string;
  subject: string;
  score: number;
  level: string;
  date: Date;
  synced: boolean;
  created_at: Date;
  updated_at: Date;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  school_id: string;
  cached_at: Date;
}

interface SchoolData {
  id: string;
  name: string;
  province: string;
  district: string;
  cached_at: Date;
}

interface TaRLDB extends DBSchema {
  assessments: {
    key: number;
    value: Assessment;
    indexes: {
      'by-sync': boolean;
      'by-student': string;
      'by-date': Date;
    };
  };
  students: {
    key: string;
    value: Student;
    indexes: {
      'by-school': string;
    };
  };
  schools: {
    key: string;
    value: SchoolData;
  };
  offline_queue: {
    key: number;
    value: {
      id?: number;
      type: 'assessment' | 'student' | 'visit';
      method: 'POST' | 'PUT' | 'DELETE';
      url: string;
      data: any;
      timestamp: Date;
      retries: number;
    };
  };
}

class OfflineStorage {
  private dbName = 'tarl-pratham-offline';
  private dbVersion = 1;
  private db: IDBPDatabase<TaRLDB> | null = null;

  async initDB(): Promise<IDBPDatabase<TaRLDB>> {
    if (this.db) return this.db;

    this.db = await openDB<TaRLDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Create assessments store
        if (!db.objectStoreNames.contains('assessments')) {
          const assessmentStore = db.createObjectStore('assessments', {
            keyPath: 'id',
            autoIncrement: true,
          });
          assessmentStore.createIndex('by-sync', 'synced');
          assessmentStore.createIndex('by-student', 'student_id');
          assessmentStore.createIndex('by-date', 'date');
        }

        // Create students store
        if (!db.objectStoreNames.contains('students')) {
          const studentStore = db.createObjectStore('students', {
            keyPath: 'id',
          });
          studentStore.createIndex('by-school', 'school_id');
        }

        // Create schools store
        if (!db.objectStoreNames.contains('schools')) {
          db.createObjectStore('schools', {
            keyPath: 'id',
          });
        }

        // Create offline queue store
        if (!db.objectStoreNames.contains('offline_queue')) {
          db.createObjectStore('offline_queue', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });

    return this.db;
  }

  // Assessment operations
  async saveAssessment(assessment: Omit<Assessment, 'id'>): Promise<number> {
    const db = await this.initDB();
    const id = await db.add('assessments', {
      ...assessment,
      synced: false,
      created_at: new Date(),
      updated_at: new Date(),
    } as Assessment);
    
    // Add to sync queue
    await this.addToQueue({
      type: 'assessment',
      method: 'POST',
      url: '/api/assessments',
      data: assessment,
      timestamp: new Date(),
      retries: 0,
    });

    return id;
  }

  async getUnsyncedAssessments(): Promise<Assessment[]> {
    const db = await this.initDB();
    return db.getAllFromIndex('assessments', 'by-sync', false);
  }

  async markAssessmentSynced(id: number): Promise<void> {
    const db = await this.initDB();
    const assessment = await db.get('assessments', id);
    if (assessment) {
      assessment.synced = true;
      assessment.updated_at = new Date();
      await db.put('assessments', assessment);
    }
  }

  // Student operations
  async cacheStudents(students: Student[]): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction('students', 'readwrite');
    
    for (const student of students) {
      await tx.store.put({
        ...student,
        cached_at: new Date(),
      });
    }
    
    await tx.done;
  }

  async getStudentsBySchool(schoolId: string): Promise<Student[]> {
    const db = await this.initDB();
    return db.getAllFromIndex('students', 'by-school', schoolId);
  }

  // School operations
  async cacheSchools(schools: SchoolData[]): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction('schools', 'readwrite');
    
    for (const school of schools) {
      await tx.store.put({
        ...school,
        cached_at: new Date(),
      });
    }
    
    await tx.done;
  }

  async getAllSchools(): Promise<SchoolData[]> {
    const db = await this.initDB();
    return db.getAll('schools');
  }

  // Sync queue operations
  async addToQueue(item: Omit<TaRLDB['offline_queue']['value'], 'id'>): Promise<void> {
    const db = await this.initDB();
    await db.add('offline_queue', item as TaRLDB['offline_queue']['value']);
  }

  async getQueuedItems(): Promise<TaRLDB['offline_queue']['value'][]> {
    const db = await this.initDB();
    return db.getAll('offline_queue');
  }

  async removeFromQueue(id: number): Promise<void> {
    const db = await this.initDB();
    await db.delete('offline_queue', id);
  }

  async incrementRetries(id: number): Promise<void> {
    const db = await this.initDB();
    const item = await db.get('offline_queue', id);
    if (item) {
      item.retries += 1;
      await db.put('offline_queue', item);
    }
  }

  // Sync operations
  async syncOfflineData(): Promise<{ success: number; failed: number }> {
    const items = await this.getQueuedItems();
    let success = 0;
    let failed = 0;

    for (const item of items) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item.data),
        });

        if (response.ok) {
          await this.removeFromQueue(item.id!);
          success++;
        } else {
          await this.incrementRetries(item.id!);
          failed++;
        }
      } catch (error) {
        await this.incrementRetries(item.id!);
        failed++;
      }
    }

    return { success, failed };
  }

  // Clear all data
  async clearAll(): Promise<void> {
    const db = await this.initDB();
    await db.clear('assessments');
    await db.clear('students');
    await db.clear('schools');
    await db.clear('offline_queue');
  }

  // Check storage usage
  async getStorageInfo(): Promise<{ usage: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    }
    return { usage: 0, quota: 0 };
  }
}

export const offlineStorage = new OfflineStorage();

// Auto-sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('Back online - syncing offline data...');
    const result = await offlineStorage.syncOfflineData();
    console.log(`Sync complete: ${result.success} success, ${result.failed} failed`);
    
    // Post message to service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'SYNC_TRIGGERED',
        data: result,
      });
    }
  });
}