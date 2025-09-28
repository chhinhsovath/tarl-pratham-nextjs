"use client";

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tabs, Select, Input, Button, Space, Typography, Divider, Tag, Avatar, message } from 'antd';
import { UserOutlined, TeamOutlined, SettingOutlined, EyeOutlined, TrophyOutlined, BarChartOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pilot_school?: {
    id: number;
    school_name: string;
  };
  assigned_pilot_schools?: Array<{
    id: number;
    school_name: string;
  }>;
}

interface Statistics {
  total_users: number;
  active_users: number;
  roles: {
    admin: number;
    coordinator: number;
    mentor: number;
    teacher: number;
    viewer: number;
  };
  data_access: {
    schools: number;
    students: number;
    assessments: number;
    mentoring_visits: number;
  };
}

interface RolePermissions {
  [role: string]: {
    [resource: string]: string[];
  };
}

export default function RBACPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Check admin access
  useEffect(() => {
    if (session && session.user?.role !== 'admin') {
      message.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [session, router]);

  // Fetch RBAC dashboard data
  useEffect(() => {
    const fetchRBACData = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics
        const statsResponse = await fetch('/api/rbac/dashboard');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStatistics(statsData.statistics);
          setRolePermissions(statsData.rolePermissions);
        }

        // Fetch users
        const usersResponse = await fetch('/api/rbac/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.users);
          setFilteredUsers(usersData.users);
        }
      } catch (error) {
        console.error('Error fetching RBAC data:', error);
        message.error('Failed to load RBAC data');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchRBACData();
    }
  }, [session]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.pilot_school?.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/rbac/users/${userId}/toggle-status`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        );
        setUsers(updatedUsers);
        message.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        message.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      message.error('Error updating user status');
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'red',
      coordinator: 'blue',
      mentor: 'green',
      teacher: 'orange',
      viewer: 'purple',
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: <SettingOutlined />,
      coordinator: <BarChartOutlined />,
      mentor: <TrophyOutlined />,
      teacher: <UserOutlined />,
      viewer: <EyeOutlined />,
    };
    return icons[role as keyof typeof icons] || <UserOutlined />;
  };

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (record: User) => (
        <Tag color={getRoleColor(record.role)} icon={getRoleIcon(record.role)}>
          {record.role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'School',
      key: 'school',
      render: (record: User) => {
        if (record.role === 'mentor' && record.assigned_pilot_schools?.length) {
          return (
            <div>
              {record.assigned_pilot_schools.map(school => (
                <Tag key={school.id} style={{ marginBottom: 2 }}>
                  {school.school_name}
                </Tag>
              ))}
            </div>
          );
        }
        return record.pilot_school?.school_name || 'N/A';
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: User) => (
        <Tag color={record.is_active ? 'green' : 'red'}>
          {record.is_active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || 'N/A',
    },
    {
      title: 'Created',
      key: 'created_at',
      render: (record: User) => new Date(record.created_at).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => router.push(`/rbac/users/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            type={record.is_active ? 'default' : 'primary'}
            onClick={() => toggleUserStatus(record.id, record.is_active)}
          >
            {record.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </Space>
      ),
    },
  ];

  const renderRolePermissionsMatrix = () => {
    const resources = ['users', 'schools', 'students', 'assessments', 'mentoring_visits', 'reports', 'rbac'];
    const roles = ['admin', 'coordinator', 'mentor', 'teacher', 'viewer'];

    return (
      <Table
        dataSource={resources.map(resource => ({ resource }))}
        pagination={false}
        size="small"
        rowKey="resource"
      >
        <Table.Column 
          title="Resource" 
          dataIndex="resource" 
          key="resource"
          render={(resource) => <strong>{resource.replace('_', ' ').toUpperCase()}</strong>}
        />
        {roles.map(role => (
          <Table.Column
            key={role}
            title={role.toUpperCase()}
            render={(record) => {
              const permissions = rolePermissions[role]?.[record.resource] || [];
              return (
                <div>
                  {permissions.map(permission => (
                    <Tag key={permission} size="small" style={{ marginBottom: 2 }}>
                      {permission}
                    </Tag>
                  ))}
                </div>
              );
            }}
          />
        ))}
      </Table>
    );
  };

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <SettingOutlined style={{ marginRight: '8px' }} />
          Role-Based Access Control
        </Title>
        <Text type="secondary">
          Manage user roles, permissions, and data access across the system
        </Text>
      </div>

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          {statistics && (
            <>
              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Total Users"
                      value={statistics.total_users}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Active Users"
                      value={statistics.active_users}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Schools"
                      value={statistics.data_access.schools}
                      prefix={<BarChartOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic
                      title="Students"
                      value={statistics.data_access.students}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="Users by Role" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {Object.entries(statistics.roles).map(([role, count]) => (
                        <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
                            {role.toUpperCase()}
                          </Tag>
                          <strong>{count}</strong>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="System Data Overview" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Assessments</span>
                        <strong>{statistics.data_access.assessments}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Mentoring Visits</span>
                        <strong>{statistics.data_access.mentoring_visits}</strong>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </TabPane>

        <TabPane tab="User Management" key="users">
          <Card>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <Space wrap>
                <Input
                  placeholder="Search users..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 200 }}
                />
                <Select
                  placeholder="Filter by role"
                  value={roleFilter}
                  onChange={setRoleFilter}
                  style={{ width: 120 }}
                  allowClear
                >
                  <Option value="admin">Admin</Option>
                  <Option value="coordinator">Coordinator</Option>
                  <Option value="mentor">Mentor</Option>
                  <Option value="teacher">Teacher</Option>
                  <Option value="viewer">Viewer</Option>
                </Select>
                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 120 }}
                  allowClear
                >
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => router.push('/rbac/users/create')}
              >
                Create User
              </Button>
            </div>

            <Table
              columns={userColumns}
              dataSource={filteredUsers}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Permissions Matrix" key="permissions">
          <Card title="Role Permissions Matrix">
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              This matrix shows what actions each role can perform on different resources.
            </Text>
            {renderRolePermissionsMatrix()}
          </Card>
        </TabPane>

        <TabPane tab="Data Access" key="data-access">
          <Card title="Data Access by Role">
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Understanding how data isolation works for each role in the system.
            </Text>
            <Row gutter={[16, 16]}>
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <Col xs={24} md={12} lg={8} key={role}>
                  <Card size="small" title={
                    <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
                      {role.toUpperCase()}
                    </Tag>
                  }>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {Object.entries(permissions).map(([resource, actions]) => (
                        <div key={resource}>
                          <strong>{resource.replace('_', ' ').toUpperCase()}</strong>
                          <div style={{ marginLeft: '8px' }}>
                            {actions.map(action => (
                              <Tag key={action} size="small" style={{ marginBottom: '2px' }}>
                                {action}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}