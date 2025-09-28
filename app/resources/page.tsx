"use client";

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Typography, message, Modal, Form, Input, Select, Upload, Switch, Row, Col, Statistic, Popconfirm } from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  DownloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  FileOutlined,
  YoutubeOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  PlayCircleOutlined,
  FolderOutlined,
  LockOutlined,
  DatabaseOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Resource {
  id: number;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  youtube_url?: string;
  is_youtube: boolean;
  is_public: boolean;
  view_count: number;
  uploaded_by: number;
  uploader?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface ResourceStats {
  total_resources: number;
  public_resources: number;
  private_resources: number;
  youtube_videos: number;
  total_file_size: number;
  total_views: number;
}

export default function ResourcesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceType, setResourceType] = useState<'file' | 'youtube'>('file');
  const [form] = Form.useForm();

  // Check admin access
  useEffect(() => {
    if (session && session.user?.role !== 'admin') {
      message.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [session, router]);

  // Fetch resources and statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [resourcesResponse, statsResponse] = await Promise.all([
          fetch('/api/resources'),
          fetch('/api/resources/stats')
        ]);

        if (resourcesResponse.ok) {
          const resourcesData = await resourcesResponse.json();
          setResources(resourcesData.resources);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        message.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchData();
    }
  }, [session]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      
      formData.append('title', values.title);
      formData.append('description', values.description || '');
      formData.append('is_public', values.is_public?.toString() || 'true');
      formData.append('resource_type', resourceType);

      if (resourceType === 'youtube') {
        formData.append('youtube_url', values.youtube_url);
      } else if (values.file?.file) {
        formData.append('file', values.file.file);
      }

      const url = editingResource ? `/api/resources/${editingResource.id}` : '/api/resources';
      const method = editingResource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        setIsModalVisible(false);
        setEditingResource(null);
        form.resetFields();
        
        // Refresh data
        window.location.reload();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to save resource');
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      message.error('Error saving resource');
    }
  };

  const handleDelete = async (resourceId: number) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Resource deleted successfully');
        setResources(resources.filter(r => r.id !== resourceId));
      } else {
        message.error('Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      message.error('Error deleting resource');
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setResourceType(resource.is_youtube ? 'youtube' : 'file');
    form.setFieldsValue({
      title: resource.title,
      description: resource.description,
      is_public: resource.is_public,
      youtube_url: resource.youtube_url,
    });
    setIsModalVisible(true);
  };

  const handleDownload = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/resources/${resource.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resource.file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        message.error('Failed to download resource');
      }
    } catch (error) {
      console.error('Error downloading resource:', error);
      message.error('Error downloading resource');
    }
  };

  const getFileIcon = (fileType: string, isYoutube: boolean) => {
    if (isYoutube) return <YoutubeOutlined style={{ color: '#ff4d4f' }} />;
    
    switch (fileType) {
      case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'word': return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'excel': return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'video': return <PlayCircleOutlined style={{ color: '#722ed1' }} />;
      default: return <FileOutlined />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns = [
    {
      title: 'Resource',
      key: 'resource',
      render: (record: Resource) => (
        <Space>
          {getFileIcon(record.file_type, record.is_youtube)}
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.title}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.is_youtube ? 'YouTube Video' : record.file_name}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (record: Resource) => (
        <Tag color={record.is_youtube ? 'red' : 'blue'}>
          {record.is_youtube ? 'YouTube' : record.file_type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Size',
      key: 'size',
      render: (record: Resource) => (
        record.is_youtube ? 'N/A' : formatFileSize(record.file_size)
      ),
    },
    {
      title: 'Visibility',
      key: 'visibility',
      render: (record: Resource) => (
        <Tag color={record.is_public ? 'green' : 'orange'}>
          {record.is_public ? 'Public' : 'Private'}
        </Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'view_count',
      key: 'view_count',
      render: (count: number) => count || 0,
    },
    {
      title: 'Uploaded By',
      key: 'uploader',
      render: (record: Resource) => record.uploader?.name || 'Unknown',
    },
    {
      title: 'Created',
      key: 'created_at',
      render: (record: Resource) => new Date(record.created_at).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Resource) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => window.open(record.is_youtube ? record.youtube_url : `/api/resources/${record.id}/view`, '_blank')}
          >
            View
          </Button>
          {!record.is_youtube && (
            <Button 
              size="small" 
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            >
              Download
            </Button>
          )}
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this resource?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <FolderOutlined style={{ marginRight: '8px' }} />
          Resource Management
        </Title>
        <Text type="secondary">
          Manage educational resources, files, and YouTube videos
        </Text>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Total Resources"
                value={stats.total_resources}
                prefix={<FileOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Public"
                value={stats.public_resources}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Private"
                value={stats.private_resources}
                prefix={<LockOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="YouTube Videos"
                value={stats.youtube_videos}
                prefix={<YoutubeOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Total Size"
                value={formatFileSize(stats.total_file_size)}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card>
              <Statistic
                title="Total Views"
                value={stats.total_views}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Resources Table */}
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4}>Educational Resources</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingResource(null);
              setResourceType('file');
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Resource
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={resources}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} resources`,
          }}
        />
      </Card>

      {/* Add/Edit Resource Modal */}
      <Modal
        title={editingResource ? 'Edit Resource' : 'Add New Resource'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingResource(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
        okText={editingResource ? 'Update' : 'Create'}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_public: true,
            resource_type: 'file'
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Enter resource title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter resource description (optional)" />
          </Form.Item>

          <Form.Item label="Resource Type">
            <Select 
              value={resourceType} 
              onChange={setResourceType}
              disabled={!!editingResource}
            >
              <Option value="file">File Upload</Option>
              <Option value="youtube">YouTube Video</Option>
            </Select>
          </Form.Item>

          {resourceType === 'youtube' ? (
            <Form.Item
              name="youtube_url"
              label="YouTube URL"
              rules={[
                { required: true, message: 'YouTube URL is required' },
                { pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i, message: 'Please enter a valid YouTube URL' }
              ]}
            >
              <Input placeholder="https://www.youtube.com/watch?v=..." />
            </Form.Item>
          ) : (
            !editingResource && (
              <Form.Item
                name="file"
                label="File"
                rules={[{ required: true, message: 'File is required' }]}
              >
                <Upload.Dragger
                  beforeUpload={() => false}
                  maxCount={1}
                  showUploadList={true}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to upload</p>
                  <p className="ant-upload-hint">Maximum file size: 100MB</p>
                </Upload.Dragger>
              </Form.Item>
            )
          )}

          <Form.Item
            name="is_public"
            label="Visibility"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Public" 
              unCheckedChildren="Private"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}