'use client';

import React, { useState } from 'react';
import { Button, Modal, message, Space, Alert } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SoftDeleteButtonProps {
  /** Type of record to delete */
  type: 'student' | 'assessment' | 'mentoring-visit';
  /** ID of the record */
  id: number;
  /** Display name of the record */
  displayName: string;
  /** Button size */
  size?: 'small' | 'middle' | 'large';
  /** Button type */
  buttonType?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  /** Show icon on button */
  showIcon?: boolean;
  /** Button text (default: "លុប") */
  buttonText?: string;
  /** Callback after successful delete */
  onSuccess?: () => void;
  /** Additional info to show in confirmation modal */
  additionalInfo?: string;
  /** Show as icon button only */
  iconOnly?: boolean;
}

export default function SoftDeleteButton({
  type,
  id,
  displayName,
  size = 'small',
  buttonType = 'default',
  showIcon = true,
  buttonText = 'លុប',
  onSuccess,
  additionalInfo,
  iconOnly = false,
}: SoftDeleteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user has permission (only admin and coordinator)
  const userRole = (session?.user as any)?.role;
  const hasPermission = ['admin', 'coordinator'].includes(userRole);

  if (!hasPermission) {
    return null; // Don't show button if no permission
  }

  const getApiEndpoint = () => {
    switch (type) {
      case 'student':
        return `/api/students/${id}/soft-delete`;
      case 'assessment':
        return `/api/assessments/${id}/soft-delete`;
      case 'mentoring-visit':
        return `/api/mentoring-visits/${id}/soft-delete`;
      default:
        return '';
    }
  };

  const getTypeName = () => {
    switch (type) {
      case 'student':
        return 'សិស្ស';
      case 'assessment':
        return 'ការវាយតម្លៃ';
      case 'mentoring-visit':
        return 'ការណែនាំ';
      default:
        return '';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(getApiEndpoint(), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'បរាជ័យក្នុងការលុប');
      }

      message.success(data.message || `លុប${getTypeName()}បានជោគជ័យ`);
      setIsModalOpen(false);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default: refresh the page
        router.refresh();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      message.error(error.message || `បរាជ័យក្នុងការលុប${getTypeName()}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const getWarningMessage = () => {
    switch (type) {
      case 'student':
        return 'ការលុបសិស្សនេះនឹងលុបការវាយតម្លៃទាំងអស់របស់សិស្សផងដែរ។';
      case 'assessment':
        return 'ការលុបការវាយតម្លៃនេះមិនអាចធ្វើឡើងវិញបានទេ។';
      case 'mentoring-visit':
        return 'ការលុបការណែនាំនេះមិនអាចធ្វើឡើងវិញបានទេ។';
      default:
        return '';
    }
  };

  return (
    <>
      <Button
        type={buttonType}
        danger
        size={size}
        icon={showIcon ? <DeleteOutlined /> : undefined}
        onClick={() => setIsModalOpen(true)}
        title={`លុប${getTypeName()}`}
      >
        {!iconOnly && buttonText}
      </Button>

      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
            <span>បញ្ជាក់ការលុប{getTypeName()}</span>
          </Space>
        }
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isDeleting}
        okText="យល់ព្រម លុប"
        cancelText="បោះបង់"
        okButtonProps={{ danger: true }}
        width={600}
      >
        <div style={{ padding: '20px 0' }}>
          <Alert
            message="ការប្រុងប្រយ័ត្ន"
            description={getWarningMessage()}
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>
              <strong>តើអ្នកប្រាកដថាចង់លុប{getTypeName()}នេះទេ?</strong>
            </p>
            <div
              style={{
                background: '#f5f5f5',
                padding: '12px 16px',
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 15 }}>
                <strong>{getTypeName()}:</strong> {displayName}
              </p>
              {additionalInfo && (
                <p style={{ margin: '8px 0 0 0', fontSize: 13, color: '#666' }}>
                  {additionalInfo}
                </p>
              )}
            </div>
          </div>

          {type === 'student' && (
            <Alert
              message="ចំណាំសំខាន់"
              description="ការលុបសិស្សនេះនឹងធ្វើឱ្យការវាយតម្លៃទាំងអស់ត្រូវបានលុបដោយស្វ័យប្រវត្តិ។ ទិន្នន័យនឹងត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធប៉ុន្តែមិនបង្ហាញក្នុងបញ្ជីទេ។"
              type="info"
              showIcon
              style={{ marginTop: 16, fontSize: 13 }}
            />
          )}

          <p style={{ marginTop: 16, fontSize: 13, color: '#666' }}>
            ការលុបនេះគឺជាការលុបទន់ (Soft Delete) ដែលមានន័យថាទិន្នន័យនឹងត្រូវបានលាក់ប៉ុណ្ណោះ
            មិនមែនលុបចេញពីមូលដ្ឋានទិន្នន័យទាំងស្រុងទេ។
          </p>
        </div>
      </Modal>
    </>
  );
}
