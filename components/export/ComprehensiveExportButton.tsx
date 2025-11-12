'use client';

import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';

interface ComprehensiveExportButtonProps {
  variant?: 'primary' | 'default';
  size?: 'small' | 'middle' | 'large';
  showIcon?: boolean;
}

export default function ComprehensiveExportButton({
  variant = 'primary',
  size = 'middle',
  showIcon = true,
}: ComprehensiveExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const startTime = Date.now();
      message.loading({ content: 'Generating comprehensive export...', key: 'export', duration: 0 });

      const response = await fetch('/api/export/comprehensive', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export data');
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `TaRL_Pratham_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

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
        content: `Export completed successfully in ${duration}s! File: ${filename}`,
        key: 'export',
        duration: 5,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      message.error({
        content: `Export failed: ${error.message}`,
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
        icon={showIcon ? <DownloadOutlined /> : undefined}
        loading={loading}
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        Export All Data
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileExcelOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            <span>Export Comprehensive Data</span>
          </div>
        }
        open={showConfirm}
        onOk={handleExport}
        onCancel={() => setShowConfirm(false)}
        okText="Export"
        cancelText="Cancel"
        confirmLoading={loading}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ marginBottom: '16px', fontSize: '14px' }}>
            This will export all production data to an Excel file with the following sheets:
          </p>

          <div style={{
            background: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>Teachers</strong> - All active teachers with school assignments</li>
              <li><strong>Mentors</strong> - All active mentors with assignment details</li>
              <li><strong>Pilot Schools</strong> - School information with assessment periods</li>
              <li><strong>Students</strong> - Active students with baseline/midline/endline levels</li>
              <li><strong>Assessments - Baseline</strong> - All baseline assessments</li>
              <li><strong>Assessments - Midline</strong> - All midline assessments</li>
              <li><strong>Assessments - Endline</strong> - All endline assessments</li>
              <li><strong>Verified Assessments</strong> - All verified assessments</li>
              <li><strong>Observations</strong> - Mentoring visits and classroom observations</li>
            </ol>
          </div>

          <div style={{
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
          }}>
            <strong>📊 Note:</strong> Only production data (not test/demo data) will be exported.
            The export may take a few moments depending on data volume.
          </div>
        </div>
      </Modal>
    </>
  );
}
