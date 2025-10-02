'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { message, Spin, Card } from 'antd';
import { useSession } from 'next-auth/react';
import StudentForm from '@/components/forms/StudentForm';
import { hasPermission } from '@/lib/permissions';

function EditStudentPageContent() {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;
  const { data: session } = useSession();
  const user = session?.user;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check permissions
  if (!hasPermission(user, 'students.edit')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
      } else {
        message.error('រកមិនឃើញសិស្ស');
        router.push('/students');
      }
    } catch (error) {
      console.error('Fetch student error:', error);
      message.error('មិនអាចផ្ទុកទិន្នន័យសិស្ស');
      router.push('/students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || 'បានកែប្រែសិស្សដោយជោគជ័យ');
        router.push('/students');
      } else {
        const error = await response.json();
        message.error(error.error || 'មិនអាចកែប្រែសិស្ស');
      }
    } catch (error) {
      console.error('Update student error:', error);
      message.error('មិនអាចកែប្រែសិស្ស');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-full overflow-x-hidden">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>កំពុងផ្ទុកទិន្នន័យសិស្ស...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <StudentForm 
        mode="edit" 
        student={student}
        onSubmit={handleSubmit}
        loading={submitting}
        userRole={user?.role}
        pilotSchoolId={user?.pilot_school_id}
      />
    </div>
  );
}
export default function EditStudentPage() {
  return (
    <HorizontalLayout>
      <EditStudentPageContent />
    </HorizontalLayout>
  );
}
