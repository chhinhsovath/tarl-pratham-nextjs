/**
 * Record Status Utilities
 * Helper functions for managing record_status across the application
 */

import { RecordStatus } from '@prisma/client';

export type { RecordStatus };

/**
 * Determine record status based on user role and test mode
 */
export function getRecordStatus(userRole: string, testModeEnabled: boolean = false): RecordStatus {
  if (userRole === 'mentor') {
    return 'test_mentor';
  }

  if (userRole === 'teacher' && testModeEnabled) {
    return 'test_teacher';
  }

  return 'production';
}

/**
 * Check if a record is test data
 */
export function isTestData(recordStatus: RecordStatus): boolean {
  return recordStatus === 'test_mentor' || recordStatus === 'test_teacher';
}

/**
 * Check if user can edit/delete this record
 */
export function canModifyRecord(
  userRole: string,
  recordStatus: RecordStatus,
  recordCreatorId: number | null,
  userId: number
): boolean {
  // Admins can modify anything
  if (userRole === 'admin') {
    return true;
  }

  // Users can modify their own test data
  if (isTestData(recordStatus) && recordCreatorId === userId) {
    return true;
  }

  // Users can modify production data based on role permissions
  if (recordStatus === 'production') {
    return true; // Will be further checked by role permissions
  }

  return false;
}

/**
 * Get filter for querying records by status
 */
export function getRecordStatusFilter(
  userRole: string,
  includeTestData: boolean = false
): { record_status?: RecordStatus | { in: RecordStatus[] } } {
  if (includeTestData) {
    // Show all data
    return {};
  }

  if (userRole === 'admin' || userRole === 'coordinator') {
    // Admins see production by default, but can toggle
    return { record_status: 'production' };
  }

  if (userRole === 'mentor') {
    // Mentors see their test data and production
    return {
      record_status: {
        in: ['production', 'test_mentor']
      }
    };
  }

  if (userRole === 'teacher') {
    // Teachers see their test data and production
    return {
      record_status: {
        in: ['production', 'test_teacher']
      }
    };
  }

  // Viewers only see production
  return { record_status: 'production' };
}

/**
 * Generate a new test session ID
 */
export function generateTestSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Calculate expiry date for test data (7 days from now)
 */
export function getTestDataExpiryDate(days: number = 7): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0); // Set to midnight
  return date;
}

/**
 * Get display label for record status
 */
export function getRecordStatusLabel(status: RecordStatus): string {
  const labels: Record<RecordStatus, string> = {
    production: 'ផលិតកម្ម', // Production
    test_mentor: 'ទិន្នន័យសាកល្បងគ្រូបង្រៀន', // Mentor Test Data
    test_teacher: 'ទិន្នន័យសាកល្បងគ្រូ', // Teacher Test Data
    demo: 'គំរូ', // Demo
    archived: 'បានរក្សាទុក' // Archived
  };
  return labels[status] || status;
}

/**
 * Get status color for UI display
 */
export function getRecordStatusColor(status: RecordStatus): string {
  const colors: Record<RecordStatus, string> = {
    production: 'green',
    test_mentor: 'orange',
    test_teacher: 'gold',
    demo: 'blue',
    archived: 'gray'
  };
  return colors[status] || 'default';
}