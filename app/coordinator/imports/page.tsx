'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Steps,
  Button,
  Upload,
  Table,
  Alert,
  Space,
  Select,
  Form,
  Progress,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Modal,
  Result,
  List,
  Tooltip
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  BankOutlined,
  UserOutlined,
  FileDoneOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import * as XLSX from 'xlsx';

const { Step } = Steps;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface ImportData {
  headers: string[];
  rows: any[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: any[];
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

function BulkImportPageContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [importType, setImportType] = useState<string>('');
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importResult, setImportResult] = useState<any>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const importTypes = [
    {
      value: 'users',
      label: 'Users (Teachers/Mentors)',
      icon: <UserOutlined />,
      color: '#1890ff',
      requiredFields: ['name', 'email', 'role', 'username', 'password'],
      optionalFields: ['phone', 'sex', 'subject', 'holding_classes', 'pilot_school_id'],
      template: 'user_import_template.xlsx'
    },
    {
      value: 'schools',
      label: 'Schools',
      icon: <BankOutlined />,
      color: '#52c41a',
      requiredFields: ['school_name', 'school_code', 'province', 'district'],
      optionalFields: ['cluster', 'commune', 'village', 'latitude', 'longitude'],
      template: 'school_import_template.xlsx'
    },
    {
      value: 'students',
      label: 'Students',
      icon: <TeamOutlined />,
      color: '#722ed1',
      requiredFields: ['name', 'pilot_school_id'],
      optionalFields: ['age', 'gender', 'guardian_name', 'guardian_phone', 'address'],
      template: 'student_import_template.xlsx'
    },
    {
      value: 'assessments',
      label: 'Assessments',
      icon: <FileDoneOutlined />,
      color: '#fa8c16',
      requiredFields: ['student_id', 'assessment_type', 'subject'],
      optionalFields: ['level', 'score', 'notes', 'assessed_date'],
      template: 'assessment_import_template.xlsx'
    }
  ];

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (json.length < 2) {
          message.error('File must contain headers and at least one data row');
          return;
        }

        const headers = json[0] as string[];
        const rows = json.slice(1).filter((row: any) => row.length > 0);
        
        // Validate and prepare data
        const typeConfig = importTypes.find(t => t.value === importType);
        const errors: ValidationError[] = [];
        const processedRows = rows.map((row: any[], index: number) => {
          const rowData: any = {};
          headers.forEach((header, colIndex) => {
            rowData[header] = row[colIndex];
          });

          // Validate required fields
          typeConfig?.requiredFields.forEach(field => {
            if (!rowData[field] || rowData[field] === '') {
              errors.push({
                row: index + 2,
                field,
                message: `${field} is required`,
                value: rowData[field]
              });
            }
          });

          return rowData;
        });

        setImportData({
          headers,
          rows: processedRows,
          totalRows: processedRows.length,
          validRows: processedRows.length - errors.length,
          invalidRows: errors.length,
          errors
        });
        
        setValidationErrors(errors);
        setSelectedFile(file);
        
        if (errors.length === 0) {
          message.success(`File validated successfully. ${processedRows.length} rows ready for import.`);
          setCurrentStep(1);
        } else {
          message.warning(`File has ${errors.length} validation errors. Please review.`);
          setCurrentStep(1);
        }
      } catch (error) {
        console.error('Error reading file:', error);
        message.error('Failed to read file. Please check the format.');
      }
    };
    
    reader.readAsArrayBuffer(file);
    return false;
  };

  const handleImport = async () => {
    if (!importData || validationErrors.length > 0) {
      message.error('Please fix all validation errors before importing');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/bulk-import/${importType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: importData.rows,
          imported_by: session?.user?.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        setImportResult(result);
        setCurrentStep(2);
        message.success(`Successfully imported ${result.successful} records`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      message.error('Import failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadTemplate = (type: string) => {
    const typeConfig = importTypes.find(t => t.value === type);
    if (!typeConfig) return;

    const headers = [...typeConfig.requiredFields, ...typeConfig.optionalFields];
    const template = [headers];
    
    // Add sample row
    const sampleRow = headers.map(header => {
      switch (header) {
        case 'email': return 'user@example.com';
        case 'role': return 'teacher';
        case 'sex': return 'male';
        case 'subject': return 'khmer';
        case 'assessment_type': return 'baseline';
        case 'level': return 'beginner';
        case 'score': return 85;
        default: return `Sample ${header}`;
      }
    });
    template.push(sampleRow);

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Import Template');
    XLSX.writeFile(wb, typeConfig.template);
    
    message.success('Template downloaded successfully');
  };

  const errorColumns = [
    {
      title: 'Row',
      dataIndex: 'row',
      key: 'row',
      width: 80,
      render: (row: number) => <Tag color="orange">Row {row}</Tag>
    },
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
      render: (field: string) => <Text code>{field}</Text>
    },
    {
      title: 'Error',
      dataIndex: 'message',
      key: 'message',
      render: (msg: string) => <Text type="danger">{msg}</Text>
    },
    {
      title: 'Current Value',
      dataIndex: 'value',
      key: 'value',
      render: (value: any) => (
        <Text type="secondary">{value || '<empty>'}</Text>
      )
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Alert
              message="Import Instructions"
              description={
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li>Select the type of data you want to import</li>
                  <li>Download the template and fill it with your data</li>
                  <li>Upload the completed Excel file</li>
                  <li>Review validation results and fix any errors</li>
                  <li>Confirm import to add data to the system</li>
                </ul>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form layout="vertical">
              <Form.Item label="Import Type" required>
                <Select
                  value={importType}
                  onChange={setImportType}
                  placeholder="Select what you want to import"
                  size="large"
                >
                  {importTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <Space>
                        <span style={{ color: type.color, fontSize: 16 }}>
                          {type.icon}
                        </span>
                        {type.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {importType && (
                <>
                  <Divider />
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card>
                        <Title level={5}>Required Fields</Title>
                        <List
                          size="small"
                          dataSource={importTypes.find(t => t.value === importType)?.requiredFields}
                          renderItem={field => (
                            <List.Item>
                              <Text code>{field}</Text>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card>
                        <Title level={5}>Optional Fields</Title>
                        <List
                          size="small"
                          dataSource={importTypes.find(t => t.value === importType)?.optionalFields}
                          renderItem={field => (
                            <List.Item>
                              <Text code type="secondary">{field}</Text>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Divider />

                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => downloadTemplate(importType)}
                      block
                    >
                      Download Excel Template
                    </Button>

                    <Dragger
                      accept=".xlsx,.xls"
                      beforeUpload={handleFileUpload}
                      showUploadList={false}
                      disabled={!importType}
                    >
                      <p className="ant-upload-drag-icon">
                        <FileExcelOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag Excel file to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for .xlsx and .xls files only
                      </p>
                    </Dragger>
                  </Space>
                </>
              )}
            </Form>
          </div>
        );

      case 1:
        return (
          <div>
            {importData && (
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Rows"
                      value={importData.totalRows}
                      prefix={<FileExcelOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Valid Rows"
                      value={importData.validRows}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Invalid Rows"
                      value={importData.invalidRows}
                      valueStyle={{ color: importData.invalidRows > 0 ? '#ff4d4f' : '#52c41a' }}
                      prefix={<CloseCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Progress
                      type="circle"
                      percent={Math.round((importData.validRows / importData.totalRows) * 100)}
                      width={80}
                      status={importData.invalidRows > 0 ? 'exception' : 'success'}
                    />
                  </Card>
                </Col>
              </Row>
            )}

            {validationErrors.length > 0 && (
              <>
                <Alert
                  message="Validation Errors Found"
                  description="Please fix the following errors in your Excel file and re-upload"
                  type="error"
                  showIcon
                  style={{ margin: '24px 0' }}
                />
                
                <Table
                  dataSource={validationErrors}
                  columns={errorColumns}
                  rowKey={(record) => `${record.row}-${record.field}`}
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              </>
            )}

            {validationErrors.length === 0 && importData && (
              <>
                <Alert
                  message="Validation Successful"
                  description={`All ${importData.totalRows} rows passed validation and are ready for import`}
                  type="success"
                  showIcon
                  style={{ margin: '24px 0' }}
                />

                <Card title="Data Preview (First 5 Rows)">
                  <Table
                    dataSource={importData.rows.slice(0, 5)}
                    columns={importData.headers.map(header => ({
                      title: header,
                      dataIndex: header,
                      key: header,
                      ellipsis: true
                    }))}
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                  />
                  
                  {importData.rows.length > 5 && (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                      <Button
                        type="link"
                        onClick={() => setPreviewModalVisible(true)}
                      >
                        View All {importData.rows.length} Rows
                      </Button>
                    </div>
                  )}
                </Card>
              </>
            )}

            <Divider />

            <Space>
              <Button onClick={() => setCurrentStep(0)}>
                Back
              </Button>
              
              {validationErrors.length === 0 && (
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handleImport}
                  loading={processing}
                >
                  Import {importData?.totalRows} Records
                </Button>
              )}
              
              {validationErrors.length > 0 && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setCurrentStep(0);
                    setImportData(null);
                    setValidationErrors([]);
                  }}
                >
                  Re-upload File
                </Button>
              )}
            </Space>
          </div>
        );

      case 2:
        return (
          <Result
            status={importResult?.failed > 0 ? 'warning' : 'success'}
            title={importResult?.failed > 0 ? 'Import Completed with Errors' : 'Import Successful!'}
            subTitle={
              <div>
                <p>Successfully imported {importResult?.successful} records</p>
                {importResult?.failed > 0 && (
                  <p>{importResult?.failed} records failed to import</p>
                )}
              </div>
            }
            extra={[
              <Button 
                type="primary" 
                key="new"
                onClick={() => {
                  setCurrentStep(0);
                  setImportData(null);
                  setValidationErrors([]);
                  setImportResult(null);
                  setImportType('');
                }}
              >
                New Import
              </Button>,
              <Button key="view" onClick={() => router.push('/coordinator')}>
                Back to Workspace
              </Button>
            ]}
          >
            {importResult?.errors && importResult.errors.length > 0 && (
              <Card title="Import Errors" style={{ marginTop: 24 }}>
                <List
                  size="small"
                  dataSource={importResult.errors}
                  renderItem={(error: any) => (
                    <List.Item>
                      <Text type="danger">{error.message}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Result>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <Card title="Bulk Data Import">
        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          <Step title="Select & Upload" icon={<UploadOutlined />} />
          <Step title="Validate & Review" icon={<EyeOutlined />} />
          <Step title="Import Results" icon={<CheckCircleOutlined />} />
        </Steps>

        {renderStepContent()}
      </Card>

      {/* Preview Modal */}
      <Modal
        title="Complete Data Preview"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        width="90%"
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {importData && (
          <Table
            dataSource={importData.rows}
            columns={importData.headers.map(header => ({
              title: header,
              dataIndex: header,
              key: header,
              ellipsis: true
            }))}
            size="small"
            scroll={{ x: true, y: 400 }}
          />
        )}
      </Modal>
    </div>
  );
}
export default function BulkImportPage() {
  return (
    <HorizontalLayout>
      <BulkImportPageContent />
    </HorizontalLayout>
  );
}
