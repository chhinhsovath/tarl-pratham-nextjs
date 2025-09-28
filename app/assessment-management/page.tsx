'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Table,
  Button,
  Select,
  Input,
  Row,
  Col,
  message,
  Space,
  Typography,
  Tag,
  Checkbox,
  Modal,
  Alert,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  ExportOutlined,
  FilterOutlined
} from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export default function AssessmentManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Redirect if not admin
  useEffect(() => {
    if (session && user?.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [session, user, router]);

  const [assessments, setAssessments] = useState([]);
  const [mentoringVisits, setMentoringVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [selectedMentoringVisits, setSelectedMentoringVisits] = useState([]);
  const [filters, setFilters] = useState({
    province: '',
    pilot_school_id: '',
    teacher_id: '',
    cycle: '',
    subject: '',
    lock_status: ''
  });
  const [mentoringFilters, setMentoringFilters] = useState({
    province: '',
    pilot_school_id: '',
    mentor_id: '',
    teacher_id: '',
    lock_status: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    schools: [],
    teachers: [],
    mentors: []
  });
  const [activeTab, setActiveTab] = useState('assessments');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchFilterOptions();
      fetchAssessments();
      fetchMentoringVisits();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAssessments();
    }
  }, [filters]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMentoringVisits();
    }
  }, [mentoringFilters]);

  const fetchFilterOptions = async () => {
    try {
      const [schoolsRes, teachersRes, mentorsRes] = await Promise.all([
        fetch('/api/pilot-schools'),
        fetch('/api/users?role=teacher'),
        fetch('/api/users?role=mentor')
      ]);

      const [schoolsData, teachersData, mentorsData] = await Promise.all([
        schoolsRes.json(),
        teachersRes.json(),
        mentorsRes.json()
      ]);

      setFilterOptions({
        schools: schoolsData.data || [],
        teachers: teachersData.data || [],
        mentors: mentorsData.data || []
      });
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/assessment-management/assessments?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAssessments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      message.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentoringVisits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(mentoringFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/assessment-management/mentoring-visits?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMentoringVisits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching mentoring visits:', error);
      message.error('Failed to load mentoring visits');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkLockAssessments = async () => {
    if (selectedAssessments.length === 0) {
      message.warning('Please select assessments to lock');
      return;
    }

    try {
      const response = await fetch('/api/assessment-management/bulk-lock-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_ids: selectedAssessments })
      });

      if (response.ok) {
        message.success('Selected assessments locked successfully');
        setSelectedAssessments([]);
        fetchAssessments();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to lock assessments');
      }
    } catch (error) {
      message.error('Failed to lock assessments');
    }
  };

  const handleBulkUnlockAssessments = async () => {
    if (selectedAssessments.length === 0) {
      message.warning('Please select assessments to unlock');
      return;
    }

    try {
      const response = await fetch('/api/assessment-management/bulk-unlock-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_ids: selectedAssessments })
      });

      if (response.ok) {
        message.success('Selected assessments unlocked successfully');
        setSelectedAssessments([]);
        fetchAssessments();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to unlock assessments');
      }
    } catch (error) {
      message.error('Failed to unlock assessments');
    }
  };

  const handleBulkLockMentoringVisits = async () => {
    if (selectedMentoringVisits.length === 0) {
      message.warning('Please select mentoring visits to lock');
      return;
    }

    try {
      const response = await fetch('/api/assessment-management/bulk-lock-mentoring-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentoring_visit_ids: selectedMentoringVisits })
      });

      if (response.ok) {
        message.success('Selected mentoring visits locked successfully');
        setSelectedMentoringVisits([]);
        fetchMentoringVisits();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to lock mentoring visits');
      }
    } catch (error) {
      message.error('Failed to lock mentoring visits');
    }
  };

  const handleBulkUnlockMentoringVisits = async () => {
    if (selectedMentoringVisits.length === 0) {
      message.warning('Please select mentoring visits to unlock');
      return;
    }

    try {
      const response = await fetch('/api/assessment-management/bulk-unlock-mentoring-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentoring_visit_ids: selectedMentoringVisits })
      });

      if (response.ok) {
        message.success('Selected mentoring visits unlocked successfully');
        setSelectedMentoringVisits([]);
        fetchMentoringVisits();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to unlock mentoring visits');
      }
    } catch (error) {
      message.error('Failed to unlock mentoring visits');
    }
  };

  const assessmentColumns = [
    {
      title: (
        <Checkbox
          checked={selectedAssessments.length === assessments.length && assessments.length > 0}
          indeterminate={selectedAssessments.length > 0 && selectedAssessments.length < assessments.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedAssessments(assessments.map(a => a.id));
            } else {
              setSelectedAssessments([]);
            }
          }}
        />
      ),
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedAssessments.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedAssessments([...selectedAssessments, record.id]);
            } else {
              setSelectedAssessments(selectedAssessments.filter(id => id !== record.id));
            }
          }}
        />
      )
    },
    {
      title: 'Student',
      dataIndex: 'student',
      render: (student) => (
        <div>
          <strong>{student?.name}</strong>
          <br />
          <Text type="secondary">{student?.school?.name}</Text>
        </div>
      )
    },
    {
      title: 'Teacher',
      dataIndex: 'student',
      render: (student) => student?.teacher?.name || '-'
    },
    {
      title: 'Cycle',
      dataIndex: 'cycle',
      render: (cycle) => (
        <Tag color={cycle === 'baseline' ? 'blue' : cycle === 'midline' ? 'orange' : 'green'}>
          {cycle?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (subject) => (
        <Tag color={subject === 'language' ? 'blue' : 'green'}>
          {subject?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'is_locked',
      render: (isLocked) => (
        <Tag color={isLocked ? 'red' : 'green'} icon={isLocked ? <LockOutlined /> : <UnlockOutlined />}>
          {isLocked ? 'Locked' : 'Unlocked'}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    }
  ];

  const mentoringColumns = [
    {
      title: (
        <Checkbox
          checked={selectedMentoringVisits.length === mentoringVisits.length && mentoringVisits.length > 0}
          indeterminate={selectedMentoringVisits.length > 0 && selectedMentoringVisits.length < mentoringVisits.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMentoringVisits(mentoringVisits.map(v => v.id));
            } else {
              setSelectedMentoringVisits([]);
            }
          }}
        />
      ),
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedMentoringVisits.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMentoringVisits([...selectedMentoringVisits, record.id]);
            } else {
              setSelectedMentoringVisits(selectedMentoringVisits.filter(id => id !== record.id));
            }
          }}
        />
      )
    },
    {
      title: 'School',
      dataIndex: 'pilot_school',
      render: (school) => (
        <div>
          <strong>{school?.name}</strong>
          <br />
          <Text type="secondary">{school?.code}</Text>
        </div>
      )
    },
    {
      title: 'Mentor',
      dataIndex: 'mentor',
      render: (mentor) => mentor?.name || '-'
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      render: (teacher) => teacher?.name || '-'
    },
    {
      title: 'Visit Date',
      dataIndex: 'visit_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'is_locked',
      render: (isLocked) => (
        <Tag color={isLocked ? 'red' : 'green'} icon={isLocked ? <LockOutlined /> : <UnlockOutlined />}>
          {isLocked ? 'Locked' : 'Unlocked'}
        </Tag>
      )
    }
  ];

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <Alert
          message="Access Denied"
          description="You need admin privileges to access this page."
          type="error"
          showIcon
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <Title level={2} style={{ marginBottom: 24, fontFamily: 'Hanuman, sans-serif' }}>
          Assessment Management
        </Title>
        <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
          Manage and control access to assessments and mentoring visits
        </Text>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Assessments" key="assessments">
            <Card>
              {/* Assessment Filters */}
              <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={4}>
                    <Select
                      placeholder="Select School"
                      value={filters.pilot_school_id}
                      onChange={(value) => setFilters(prev => ({ ...prev, pilot_school_id: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      {filterOptions.schools.map((school) => (
                        <Option key={school.id} value={school.id}>
                          {school.name} ({school.code})
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Select Teacher"
                      value={filters.teacher_id}
                      onChange={(value) => setFilters(prev => ({ ...prev, teacher_id: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      {filterOptions.teachers.map((teacher) => (
                        <Option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={3}>
                    <Select
                      placeholder="Cycle"
                      value={filters.cycle}
                      onChange={(value) => setFilters(prev => ({ ...prev, cycle: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      <Option value="baseline">Baseline</Option>
                      <Option value="midline">Midline</Option>
                      <Option value="endline">Endline</Option>
                    </Select>
                  </Col>
                  <Col span={3}>
                    <Select
                      placeholder="Subject"
                      value={filters.subject}
                      onChange={(value) => setFilters(prev => ({ ...prev, subject: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      <Option value="language">Language</Option>
                      <Option value="numeracy">Numeracy</Option>
                    </Select>
                  </Col>
                  <Col span={3}>
                    <Select
                      placeholder="Lock Status"
                      value={filters.lock_status}
                      onChange={(value) => setFilters(prev => ({ ...prev, lock_status: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      <Option value="locked">Locked</Option>
                      <Option value="unlocked">Unlocked</Option>
                    </Select>
                  </Col>
                </Row>
              </Card>

              {/* Assessment Actions */}
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Button
                    icon={<LockOutlined />}
                    onClick={handleBulkLockAssessments}
                    disabled={selectedAssessments.length === 0}
                  >
                    Lock Selected ({selectedAssessments.length})
                  </Button>
                  <Button
                    icon={<UnlockOutlined />}
                    onClick={handleBulkUnlockAssessments}
                    disabled={selectedAssessments.length === 0}
                  >
                    Unlock Selected ({selectedAssessments.length})
                  </Button>
                </Space>
              </div>

              {/* Assessment Table */}
              <Table
                columns={assessmentColumns}
                dataSource={assessments}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 50,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} assessments`,
                }}
                scroll={{ x: 1000 }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Mentoring Visits" key="mentoring">
            <Card>
              {/* Mentoring Filters */}
              <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={5}>
                    <Select
                      placeholder="Select School"
                      value={mentoringFilters.pilot_school_id}
                      onChange={(value) => setMentoringFilters(prev => ({ ...prev, pilot_school_id: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      {filterOptions.schools.map((school) => (
                        <Option key={school.id} value={school.id}>
                          {school.name} ({school.code})
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Select Mentor"
                      value={mentoringFilters.mentor_id}
                      onChange={(value) => setMentoringFilters(prev => ({ ...prev, mentor_id: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      {filterOptions.mentors.map((mentor) => (
                        <Option key={mentor.id} value={mentor.id}>
                          {mentor.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Select Teacher"
                      value={mentoringFilters.teacher_id}
                      onChange={(value) => setMentoringFilters(prev => ({ ...prev, teacher_id: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      {filterOptions.teachers.map((teacher) => (
                        <Option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={3}>
                    <Select
                      placeholder="Lock Status"
                      value={mentoringFilters.lock_status}
                      onChange={(value) => setMentoringFilters(prev => ({ ...prev, lock_status: value }))}
                      allowClear
                      style={{ width: '100%' }}
                    >
                      <Option value="locked">Locked</Option>
                      <Option value="unlocked">Unlocked</Option>
                    </Select>
                  </Col>
                </Row>
              </Card>

              {/* Mentoring Actions */}
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Button
                    icon={<LockOutlined />}
                    onClick={handleBulkLockMentoringVisits}
                    disabled={selectedMentoringVisits.length === 0}
                  >
                    Lock Selected ({selectedMentoringVisits.length})
                  </Button>
                  <Button
                    icon={<UnlockOutlined />}
                    onClick={handleBulkUnlockMentoringVisits}
                    disabled={selectedMentoringVisits.length === 0}
                  >
                    Unlock Selected ({selectedMentoringVisits.length})
                  </Button>
                </Space>
              </div>

              {/* Mentoring Table */}
              <Table
                columns={mentoringColumns}
                dataSource={mentoringVisits}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 50,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} visits`,
                }}
                scroll={{ x: 1000 }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}