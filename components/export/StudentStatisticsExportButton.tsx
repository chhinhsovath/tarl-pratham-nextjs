'use client';

import React, { useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { DownloadOutlined, FileExcelOutlined, BarChartOutlined } from '@ant-design/icons';

interface StudentStatisticsExportButtonProps {
  variant?: 'primary' | 'default';
  size?: 'small' | 'middle' | 'large';
  showIcon?: boolean;
}

export default function StudentStatisticsExportButton({
  variant = 'default',
  size = 'middle',
  showIcon = true,
}: StudentStatisticsExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const startTime = Date.now();
      message.loading({ content: 'កំពុងបង្កើតរបាយការណ៍ស្ថិតិ...', key: 'export', duration: 0 });

      const response = await fetch('/api/students/statistics-export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export statistics');
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `TaRL_Student_Statistics_${new Date().toISOString().split('T')[0]}.xlsx`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      message.success({
        content: `បានទាញយករបាយការណ៍ស្ថិតិដោយជោគជ័យក្នុងរយៈពេល ${duration}វិនាទី!`,
        key: 'export',
        duration: 5,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      message.error({
        content: `មានបញ្ហាក្នុងការទាញយករបាយការណ៍: ${error.message}`,
        key: 'export',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type={variant}
        size={size}
        icon={showIcon ? <BarChartOutlined /> : undefined}
        loading={loading}
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        Export ស្ថិតិ
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <span>Export របាយការណ៍ស្ថិតិសិស្ស</span>
          </div>
        }
        open={showConfirm}
        onOk={handleExport}
        onCancel={() => setShowConfirm(false)}
        okText="Export"
        cancelText="បោះបង់"
        confirmLoading={loading}
        width={650}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ marginBottom: '16px', fontSize: '14px' }}>
            របាយការណ៍នេះនឹងរួមបញ្ចូលទិន្នន័យស្ថិតិទាំងអស់ក្នុងទម្រង់ Excel ជាមួយនឹងទំព័រច្រើន:
          </p>

          <div style={{
            background: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>Summary Statistics</strong> - ស្ថិតិសង្ខេបទូទៅ (សរុប, សកម្ម, ផលិតកម្ម)</li>
              <li><strong>Gender Distribution</strong> - ចែកចាយតាមភេទ (ប្រុស/ស្រី)</li>
              <li><strong>Grade Distribution</strong> - ចែកចាយតាមថ្នាក់ (ទី៤, ទី៥)</li>
              <li><strong>Schools Distribution</strong> - ចែកចាយតាមសាលារៀន (ព័ត៌មានលម្អិត)</li>
              <li><strong>Province Summary</strong> - សង្ខេបតាមខេត្ត</li>
              <li><strong>Assessment Levels</strong> - កម្រិតការវាយតម្លៃ (Baseline, Midline, Endline)</li>
              <li><strong>Student Details</strong> - បញ្ជីសិស្សលម្អិតទាំងអស់</li>
            </ol>
          </div>

          <div style={{
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
          }}>
            <Space direction="vertical" size="small">
              <div><strong>📊 របាយការណ៍នេះសម្រាប់:</strong></div>
              <div>✅ Admin, Coordinator, Super Admin</div>
              <div>✅ ទិន្នន័យសិស្សសកម្មទាំងអស់</div>
              <div>✅ ស្ថិតិពេញលេញជាមួយវិភាគ</div>
              <div>✅ ទម្រង់ Excel ងាយស្រួលប្រើប្រាស់</div>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  );
}
