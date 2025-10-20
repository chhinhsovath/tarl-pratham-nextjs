'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Upload,
  Button,
  Table,
  message,
  Steps,
  Space,
  Alert,
  Typography,
  Row,
  Col,
  Tag,
  Spin,
  Divider
} from 'antd';
import { UploadOutlined, DownloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { hasPermission } from '@/lib/permissions';

const { Title, Text } = Typography;
const { Step } = Steps;

interface PreviewData {
  total: number;
  valid: number;
  invalid: number;
  students: any[];
  errors: any[];
}

function BulkImportStudentsPageContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [importResults, setImportResults] = useState<any>(null);

  // Wait for client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Check permissions
  if (!hasPermission(user, 'students.bulk_import')) {
    router.push('/unauthorized');
    return null;
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/students/bulk-import');
      const data = await response.json();
      
      // Create and download template
      const worksheet = [
        Object.keys(data.template[0]),
        ...data.template.map((row: any) => Object.values(row))
      ];
      
      const csvContent = worksheet.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'student_import_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('Template downloaded successfully');
    } catch (error) {
      message.error('Failed to download template');
    }
  };

  const handleFileUpload = (file: File) => {
    setFile(file);
    setCurrentStep(1);
    return false; // Prevent auto upload
  };

  const validateFile = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('preview', 'true');
      
      const response = await fetch('/api/students/bulk-import', {
        method: 'POST',
        headers: {
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setPreviewData(data);
        setCurrentStep(2);
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to validate file');
      }
    } catch (error) {
      message.error('Failed to validate file');
    } finally {
      setLoading(false);
    }
  };

  const importStudents = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('preview', 'false');
      
      const response = await fetch('/api/students/bulk-import', {
        method: 'POST',
        headers: {
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setImportResults(data);
        setCurrentStep(3);
        message.success(data.message || 'Students imported successfully');
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to import students');
      }
    } catch (error) {
      message.error('Failed to import students');
    } finally {
      setLoading(false);
    }
  };

  const resetImport = () => {
    setCurrentStep(0);
    setFile(null);
    setPreviewData(null);
    setImportResults(null);
  };

  const errorColumns = [
    {
      title: 'Row',
      dataIndex: 'row',
      key: 'row',
      width: 80
    },
    {
      title: 'Errors',
      dataIndex: 'errors',
      key: 'errors',
      render: (errors: string[]) => (
        <div>
          {errors.map((error, index) => (
            <Tag color="red" key={index} style={{ marginBottom: 4 }}>
              {error}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (data: any) => (
        <Text code style={{ fontSize: '12px' }}>
          {JSON.stringify(data, null, 2)}
        </Text>
      )
    }
  ];

  const previewColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Guardian', dataIndex: 'guardian_name', key: 'guardian_name' },
    { title: 'Phone', dataIndex: 'guardian_phone', key: 'guardian_phone' }
  ];

  return (
    <div className="max-w-full overflow-x-hidden">
      <Card>
        <Title level={2}>Bulk Import Students</Title>
        
        <Steps current={currentStep} style={{ marginBottom: '32px' }}>
          <Step title="Upload File" />
          <Step title="Validate Data" />
          <Step title="Review & Import" />
          <Step title="Complete" />
        </Steps>

        {currentStep === 0 && (
          <div>
            <Alert
              message="Import Instructions"
              description={
                <div>
                  <p>1. Download the template file to see the required format</p>
                  <p>2. Fill in your student data following the template structure</p>
                  <p>3. Upload your completed file for validation</p>
                  <p>4. Review the validation results and proceed with import</p>
                  {user?.role === 'mentor' && (
                    <p><strong>Note:</strong> As a mentor, imported students will be marked as temporary and automatically deleted after 48 hours.</p>
                  )}
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>Step 1: Download Template</Title>
                <Button 
                  icon={<DownloadOutlined />}
                  onClick={downloadTemplate}
                >
                  Download Template
                </Button>
              </div>

              <Divider />

              <div>
                <Title level={4}>Step 2: Upload Your File</Title>
                <Upload
                  beforeUpload={handleFileUpload}
                  accept=".xlsx,.xls,.csv"
                  maxCount={1}
                  fileList={file ? [{
                    uid: '1',
                    name: file.name,
                    status: 'done'
                  }] : []}
                  onRemove={() => setFile(null)}
                >
                  <Button icon={<UploadOutlined />}>
                    Select File
                  </Button>
                </Upload>
                <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                  Supported formats: Excel (.xlsx, .xls) and CSV files
                </Text>
              </div>

              {file && (
                <Button 
                  type="primary" 
                  onClick={validateFile}
                  loading={loading}
                >
                  Validate File
                </Button>
              )}
            </Space>
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '16px' }}>Validating your file...</p>
          </div>
        )}

        {currentStep === 2 && previewData && (
          <div>
            <Title level={4}>Validation Results</Title>
            
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Card size="small">
                  <Text strong>Total Rows</Text>
                  <div style={{ fontSize: '24px', color: '#1890ff' }}>
                    {previewData.total}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Text strong>Valid Students</Text>
                  <div style={{ fontSize: '24px', color: '#52c41a' }}>
                    {previewData.valid}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Text strong>Errors</Text>
                  <div style={{ fontSize: '24px', color: '#f5222d' }}>
                    {previewData.invalid}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Text strong>Success Rate</Text>
                  <div style={{ fontSize: '24px', color: '#fa8c16' }}>
                    {Math.round((previewData.valid / previewData.total) * 100)}%
                  </div>
                </Card>
              </Col>
            </Row>

            {previewData.valid > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Preview Valid Students (First 10)</Title>
                <Table scroll={{ x: "max-content" }}
                  columns={previewColumns}
                  dataSource={previewData.students}
                  pagination={false}
                  size="small"
                  rowKey={(record, index) => index}
                />
              </div>
            )}

            {previewData.errors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Validation Errors</Title>
                <Table scroll={{ x: "max-content" }}
                  columns={errorColumns}
                  dataSource={previewData.errors}
                  pagination={{ pageSize: 5 }}
                  size="small"
                  rowKey="row"
                />
              </div>
            )}

            <Space>
              <Button onClick={resetImport}>
                Start Over
              </Button>
              <Button 
                type="primary" 
                onClick={importStudents}
                disabled={previewData.valid === 0}
                loading={loading}
              >
                Import {previewData.valid} Students
              </Button>
            </Space>
          </div>
        )}

        {currentStep === 3 && importResults && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
              <Title level={3} style={{ marginTop: '16px' }}>
                Import Completed Successfully!
              </Title>
            </div>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={8}>
                <Card size="small">
                  <Text strong>Created</Text>
                  <div style={{ fontSize: '24px', color: '#52c41a' }}>
                    {importResults.created}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Text strong>Errors</Text>
                  <div style={{ fontSize: '24px', color: '#f5222d' }}>
                    {importResults.errors?.length || 0}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Text strong>Total Processed</Text>
                  <div style={{ fontSize: '24px', color: '#1890ff' }}>
                    {importResults.created + (importResults.errors?.length || 0)}
                  </div>
                </Card>
              </Col>
            </Row>

            {importResults.isTemporary && (
              <Alert
                message="Temporary Import"
                description="As a mentor, these students are marked as temporary and will be automatically deleted after 48 hours unless permanently saved by an admin or teacher."
                type="warning"
                showIcon
                style={{ marginBottom: '24px' }}
              />
            )}

            <Space>
              <Button onClick={resetImport}>
                Import More Students
              </Button>
              <Button 
                type="primary"
                onClick={() => router.push('/students')}
              >
                View Students
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
}
export default function BulkImportStudentsPage() {
  return (
    <HorizontalLayout>
      <BulkImportStudentsPageContent />
    </HorizontalLayout>
  );
}
