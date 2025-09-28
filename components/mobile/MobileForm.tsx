'use client';

import React from 'react';
import { Form, Input, Select, Button, DatePicker, Radio, Upload, Space, Card } from 'antd';
import { CameraOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import kmTranslations from '@/lib/translations/km';

interface MobileFormFieldProps {
  name: string;
  label: string;
  labelKm?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'select' | 'date' | 'radio' | 'textarea' | 'photo';
  required?: boolean;
  placeholder?: string;
  placeholderKm?: string;
  options?: { label: string; labelKm?: string; value: any }[];
  rules?: any[];
  disabled?: boolean;
}

export const MobileFormField: React.FC<MobileFormFieldProps> = ({
  name,
  label,
  labelKm,
  type = 'text',
  required = false,
  placeholder,
  placeholderKm,
  options = [],
  rules = [],
  disabled = false,
}) => {
  const fieldRules = [
    ...(required ? [{ required: true, message: kmTranslations.forms.validation.required }] : []),
    ...rules,
  ];

  const renderLabel = () => (
    <div className="mb-2">
      <span className="text-base font-khmer font-semibold text-gray-700">
        {labelKm || label}
      </span>
      {label !== labelKm && (
        <span className="text-sm text-gray-500 ml-2">({label})</span>
      )}
      {required && <span className="text-red-500 ml-1">*</span>}
    </div>
  );

  switch (type) {
    case 'select':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Select
            placeholder={placeholderKm || placeholder}
            size="large"
            disabled={disabled}
            className="w-full"
            dropdownStyle={{ fontSize: 16 }}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={options.map(opt => ({
              label: (
                <div>
                  <span className="font-khmer">{opt.labelKm || opt.label}</span>
                  {opt.label !== opt.labelKm && (
                    <span className="text-xs text-gray-500 ml-2">({opt.label})</span>
                  )}
                </div>
              ),
              value: opt.value,
            }))}
          />
        </Form.Item>
      );

    case 'date':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <DatePicker
            placeholder={placeholderKm || placeholder}
            size="large"
            disabled={disabled}
            className="w-full"
            format="DD/MM/YYYY"
          />
        </Form.Item>
      );

    case 'radio':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Radio.Group disabled={disabled} className="w-full">
            <Space direction="vertical" className="w-full">
              {options.map(opt => (
                <Radio key={opt.value} value={opt.value} className="text-base">
                  <span className="font-khmer">{opt.labelKm || opt.label}</span>
                  {opt.label !== opt.labelKm && (
                    <span className="text-xs text-gray-500 ml-2">({opt.label})</span>
                  )}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
      );

    case 'textarea':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Input.TextArea
            placeholder={placeholderKm || placeholder}
            size="large"
            disabled={disabled}
            rows={4}
            className="font-khmer"
            style={{ fontSize: 16 }}
          />
        </Form.Item>
      );

    case 'photo':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Upload
            name="photo"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={async (options) => {
              const { file, onSuccess, onError } = options;
              try {
                const formData = new FormData();
                formData.append('file', file as File);
                formData.append('type', 'mobile_photos');

                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });

                if (response.ok) {
                  const data = await response.json();
                  onSuccess?.(data);
                } else {
                  throw new Error('Upload failed');
                }
              } catch (error) {
                console.error('Upload error:', error);
                onError?.(error as Error);
              }
            }}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              const isLt5M = file.size / 1024 / 1024 < 5;

              if (!isImage) {
                return false;
              }

              if (!isLt5M) {
                return false;
              }

              return true;
            }}
            disabled={disabled}
          >
            <div className="flex flex-col items-center justify-center p-4">
              <CameraOutlined style={{ fontSize: 32 }} />
              <div className="mt-2 font-khmer text-sm">{kmTranslations.actions.upload}</div>
            </div>
          </Upload>
        </Form.Item>
      );

    case 'password':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Input.Password
            placeholder={placeholderKm || placeholder}
            size="large"
            disabled={disabled}
            className="font-khmer"
            style={{ fontSize: 16 }}
          />
        </Form.Item>
      );

    case 'number':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Input
            type="number"
            placeholder={placeholderKm || placeholder}
            size="large"
            disabled={disabled}
            className="font-khmer"
            style={{ fontSize: 16 }}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </Form.Item>
      );

    case 'tel':
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Input
            placeholder={placeholderKm || placeholder}
            size="large"
            disabled={disabled}
            className="font-khmer"
            style={{ fontSize: 16 }}
            inputMode="tel"
            pattern="[0-9]*"
          />
        </Form.Item>
      );

    default:
      return (
        <Form.Item name={name} rules={fieldRules} className="mb-4">
          {renderLabel()}
          <Input
            placeholder={placeholderKm || placeholder}
            size="large"
            disabled={disabled}
            className="font-khmer"
            style={{ fontSize: 16 }}
          />
        </Form.Item>
      );
  }
};

interface MobileFormProps {
  title?: string;
  titleKm?: string;
  onSubmit: (values: any) => void;
  children: React.ReactNode;
  submitText?: string;
  submitTextKm?: string;
  loading?: boolean;
}

export const MobileForm: React.FC<MobileFormProps> = ({
  title,
  titleKm,
  onSubmit,
  children,
  submitText = 'Submit',
  submitTextKm = kmTranslations.actions.submit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  return (
    <Card className="shadow-sm border-0">
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-khmer font-bold text-gray-900">
            {titleKm || title}
          </h2>
          {title !== titleKm && (
            <p className="text-sm text-gray-500">{title}</p>
          )}
        </div>
      )}

      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        className="mobile-form"
        requiredMark={false}
      >
        {children}

        <div className="mt-6 space-y-3">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
            icon={<SaveOutlined />}
            className="h-12 text-base font-khmer font-semibold"
          >
            {submitTextKm}
            {submitText !== submitTextKm && (
              <span className="text-sm ml-2">({submitText})</span>
            )}
          </Button>
          
          <Button
            size="large"
            block
            onClick={() => form.resetFields()}
            className="h-12 text-base font-khmer"
          >
            {kmTranslations.actions.clear}
          </Button>
        </div>
      </Form>

      <style jsx global>{`
        .mobile-form .ant-form-item {
          margin-bottom: 16px;
        }
        
        .mobile-form .ant-form-item-label {
          padding: 0;
        }
        
        .mobile-form .ant-input,
        .mobile-form .ant-input-password,
        .mobile-form .ant-select-selector,
        .mobile-form .ant-picker {
          min-height: 48px !important;
          font-size: 16px !important;
        }
        
        .mobile-form .ant-select-selection-item {
          line-height: 46px !important;
        }
        
        .mobile-form .ant-radio-wrapper {
          padding: 8px 0;
        }
      `}</style>
    </Card>
  );
};