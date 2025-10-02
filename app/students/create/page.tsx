'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useSession } from 'next-auth/react';
import StudentForm from '@/components/forms/StudentForm';
import { hasPermission } from '@/lib/permissions';

function CreateStudentPageContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // VERSION CHECK: v2.0 - Body stream fix deployed
  console.log('🔵 Student Create Page Version: 2.0 (Fixed body stream error)');

  // Check permissions
  if (!hasPermission(user, 'students.create')) {
    router.push('/unauthorized');
    return null;
  }

  const handleSubmit = async (values: any) => {
    try {
      // Ensure pilot_school_id is included for mentors and teachers
      if ((user?.role === 'mentor' || user?.role === 'teacher') && user?.pilot_school_id) {
        values.pilot_school_id = user.pilot_school_id;
      }

      console.log('📤 Submitting student data:', values);
      console.log('👤 User session:', { role: user?.role, pilot_school_id: user?.pilot_school_id });

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || '',
          'pilot-school-id': user?.pilot_school_id?.toString() || ''
        },
        body: JSON.stringify(values)
      });

      // Read response body only once
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text.substring(0, 200));
        responseData = { error: 'Invalid response from server' };
      }

      if (response.ok) {
        message.success(responseData.message || 'បានបន្ថែមសិស្សដោយជោគជ័យ');

        if (user?.role === 'mentor') {
          message.info('ចំណាំ: សិស្សនេះនឹងត្រូវបានលុបដោយស្វ័យប្រវត្តិបន្ទាប់ពី ៤៨ ម៉ោង ប្រសិនបើមិនត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍ដោយអ្នកគ្រប់គ្រង ឬគ្រូបង្រៀន។');
        }

        router.push('/students');
      } else {
        console.error('❌ API Error:', responseData);
        const errorMsg = responseData.error || responseData.message || 'មិនអាចបន្ថែមសិស្ស';
        message.error(errorMsg);

        // Show detailed error in development
        if (process.env.NODE_ENV === 'development' && responseData.details) {
          console.error('Error details:', responseData.details);
        }
      }
    } catch (error) {
      console.error('💥 Create student error:', error);
      message.error(`មិនអាចបន្ថែមសិស្ស: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      <StudentForm 
        mode="create" 
        onSubmit={handleSubmit}
        userRole={user?.role}
        pilotSchoolId={user?.pilot_school_id}
      />
    </div>
  );
}
export default function CreateStudentPage() {
  return (
    <HorizontalLayout>
      <CreateStudentPageContent />
    </HorizontalLayout>
  );
}
