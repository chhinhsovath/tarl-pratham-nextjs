'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { message, Card, Typography, Space, Tag } from 'antd';
import { useSession } from 'next-auth/react';
import AssessmentForm from '@/components/forms/AssessmentForm';
import { hasPermission } from '@/lib/permissions';

const { Title, Text } = Typography;

function AssessmentDataEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [assessmentType, setAssessmentType] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);

  // Check permissions
  if (!hasPermission(user, 'assessments.create')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    // Get URL parameters
    const studentsParam = searchParams.get('students');
    const typeParam = searchParams.get('type');
    const subjectParam = searchParams.get('subject');
    
    if (!studentsParam || !typeParam || !subjectParam) {
      message.error('Missing required parameters');
      router.push('/assessments/select-students');
      return;
    }

    const studentIds = studentsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    setSelectedStudents(studentIds);
    setAssessmentType(typeParam);
    setSubject(subjectParam);
    
    fetchStudents(studentIds);
  }, [searchParams]);

  const fetchStudents = async (studentIds: number[]) => {
    try {
      // Fetch each student's details
      const promises = studentIds.map(id => 
        fetch(`/api/students/${id}`).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const studentData = results
        .filter(result => result.student)
        .map(result => result.student);
      
      setStudents(studentData);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to load student data');
      router.push('/assessments/select-students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assessments: any[]) => {
    try {
      // Submit all assessments
      const response = await fetch('/api/assessments/submit-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || '',
          'pilot-school-id': user?.pilot_school_id?.toString() || ''
        },
        body: JSON.stringify({ assessments })
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || 'All assessments submitted successfully');
        
        if (user?.role === 'mentor') {
          message.info('Note: These assessments are marked as temporary and will be automatically deleted after 48 hours unless permanently saved.');
        }
        
        router.push('/assessments');
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to submit assessments');
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      message.error('Failed to submit assessments');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Loading student data...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>Bulk Assessment Data Entry</Title>
        <Space size="large">
          <div>
            <Text strong>Assessment Type: </Text>
            <Tag color={assessmentType === 'baseline' ? 'blue' : assessmentType === 'midline' ? 'orange' : 'green'}>
              {assessmentType.toUpperCase()}
            </Tag>
          </div>
          <div>
            <Text strong>Subject: </Text>
            <Tag color={subject === 'khmer' ? 'purple' : 'cyan'}>
              {subject.toUpperCase()}
            </Tag>
          </div>
          <div>
            <Text strong>Students: </Text>
            <Tag color="green">{students.length} selected</Tag>
          </div>
        </Space>
      </Card>

      <AssessmentForm 
        mode="bulk" 
        students={students}
        selectedStudents={selectedStudents}
        assessmentType={assessmentType}
        subject={subject}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function AssessmentDataEntryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentDataEntryContent />
    </Suspense>
  );
}