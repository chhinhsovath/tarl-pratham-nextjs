'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
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
      message.error('បាត់ប៉ារ៉ាម៉ែត្រចាំបាច់');
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
      message.error('បរាជ័យក្នុងការផ្ទុកទិន្នន័យសិស្ស');
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
        message.success(data.message || 'រក្សាទុកការវាយតម្លៃទាំងអស់បានជោគជ័យ');

        if (user?.role === 'mentor') {
          message.info('ចំណាំ៖ ការវាយតម្លៃទាំងនេះត្រូវបានសម្គាល់ថាជាបណ្តោះអាសន្ន និងនឹងត្រូវលុបដោយស្វ័យប្រវត្តិបន្ទាប់ពី ៤៨ ម៉ោង លុះត្រាតែត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍។');
        }

        router.push('/assessments');
      } else {
        const error = await response.json();
        message.error(error.error || 'បរាជ័យក្នុងការដាក់ស្នើការវាយតម្លៃ');
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      message.error('បរាជ័យក្នុងការដាក់ស្នើការវាយតម្លៃ');
    }
  };

  if (loading) {
    return (
      <div className="max-w-full overflow-x-hidden">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            កំពុងផ្ទុកទិន្នន័យសិស្ស...
          </div>
        </Card>
      </div>
    );
  }

  const getAssessmentTypeLabel = (type: string) => {
    switch(type) {
      case 'baseline': return 'តេស្តដើមគ្រា';
      case 'midline': return 'តេស្តពាក់កណ្ដាលគ្រា';
      case 'endline': return 'តេស្តចុងក្រោយគ្រា';
      default: return type;
    }
  };

  const getSubjectLabel = (subj: string) => {
    switch(subj) {
      case 'khmer':
      case 'language': return 'ភាសាខ្មែរ';
      case 'math': return 'គណិតវិទ្យា';
      default: return subj;
    }
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>បញ្ចូលទិន្នន័យវាយតម្លៃជាក្រុម</Title>
        <Space size="large">
          <div>
            <Text strong>ប្រភេទតេស្ត៖ </Text>
            <Tag color={assessmentType === 'baseline' ? 'blue' : assessmentType === 'midline' ? 'orange' : 'green'}>
              {getAssessmentTypeLabel(assessmentType)}
            </Tag>
          </div>
          <div>
            <Text strong>មុខវិជ្ជា៖ </Text>
            <Tag color={subject === 'khmer' || subject === 'language' ? 'purple' : 'cyan'}>
              {getSubjectLabel(subject)}
            </Tag>
          </div>
          <div>
            <Text strong>សិស្ស៖ </Text>
            <Tag color="green">{students.length} នាក់</Tag>
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

function AssessmentDataEntryPageContent() {
  return (
    <Suspense fallback={<div>កំពុងផ្ទុក...</div>}>
      <AssessmentDataEntryContent />
    </Suspense>
  );
}
export default function AssessmentDataEntryPage() {
  return (
    <HorizontalLayout>
      <AssessmentDataEntryPageContent />
    </HorizontalLayout>
  );
}
