'use client';

import { useState, useEffect } from 'react';
import { Form, Select, InputNumber, DatePicker, Input, Space, Typography, Row, Col, Card } from 'antd';
import { BookOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getAssessmentTypeOptions,
  getSubjectOptions,
  getLevelOptions
} from '@/lib/constants/assessment-levels';
import { WizardData } from '../AssessmentWizard';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface AssessmentDetailsStepProps {
  data: WizardData;
  onChange: (data: Partial<WizardData>) => void;
}

export default function AssessmentDetailsStep({ data, onChange }: AssessmentDetailsStepProps) {
  const [selectedSubject, setSelectedSubject] = useState<'language' | 'math'>(data.subject);
  const [availableLevels, setAvailableLevels] = useState(getLevelOptions(data.subject));

  useEffect(() => {
    setAvailableLevels(getLevelOptions(selectedSubject));
  }, [selectedSubject]);

  const handleSubjectChange = (value: 'language' | 'math') => {
    setSelectedSubject(value);
    onChange({ subject: value, level: undefined });
  };

  const assessmentTypes = getAssessmentTypeOptions();
  const subjects = getSubjectOptions();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={4}>
          <BookOutlined /> លម្អិតការវាយតម្លៃ
        </Title>
        <Text type="secondary">
          បញ្ចូលពត៌មានការវាយតម្លៃសិស្ស
        </Text>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card
            size="small"
            title="ប្រភេទការវាយតម្លៃ"
            style={{ marginBottom: '16px' }}
          >
            <Select
              value={data.assessment_type}
              onChange={(value) => onChange({ assessment_type: value })}
              style={{ width: '100%' }}
              size="large"
            >
              {assessmentTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <strong>{type.label_km}</strong>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {type.label_en}
                  </Text>
                </Option>
              ))}
            </Select>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            size="small"
            title="មុខវិជ្ជា"
            style={{ marginBottom: '16px' }}
          >
            <Select
              value={selectedSubject}
              onChange={handleSubjectChange}
              style={{ width: '100%' }}
              size="large"
            >
              {subjects.map(subject => (
                <Option key={subject.value} value={subject.value}>
                  <strong>{subject.label_km}</strong>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {subject.label_en}
                  </Text>
                </Option>
              ))}
            </Select>
          </Card>
        </Col>
      </Row>

      <Card
        size="small"
        title={
          <Space>
            <TrophyOutlined />
            <Text>កម្រិតសិស្ស</Text>
          </Space>
        }
      >
        <Select
          value={data.level}
          onChange={(value) => onChange({ level: value })}
          placeholder="ជ្រើសរើសកម្រិត"
          style={{ width: '100%' }}
          size="large"
        >
          {availableLevels.map(level => (
            <Option key={level.value} value={level.value}>
              <div style={{ padding: '8px 0' }}>
                <Text strong style={{ fontSize: '15px' }}>
                  {level.label_km}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  {level.label_en}
                </Text>
              </div>
            </Option>
          ))}
        </Select>
        <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
          {selectedSubject === 'language' ? '7 កម្រិតសម្រាប់ភាសាខ្មែរ' : '6 កម្រិតសម្រាប់គណិតវិទ្យា'}
        </Text>
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card size="small" title="ពិន្ទុ (ស្រេចចិត្ត)">
            <InputNumber
              value={data.score}
              onChange={(value) => onChange({ score: value || undefined })}
              min={0}
              max={100}
              placeholder="0-100"
              style={{ width: '100%' }}
              size="large"
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card size="small" title="កាលបរិច្ឆេទវាយតម្លៃ">
            <DatePicker
              value={data.assessed_date ? dayjs(data.assessed_date) : dayjs()}
              onChange={(date) => onChange({ assessed_date: date?.toISOString() || new Date().toISOString() })}
              style={{ width: '100%' }}
              size="large"
              format="DD/MM/YYYY"
            />
          </Card>
        </Col>
      </Row>

      <Card size="small" title="កំណត់ចំណាំ (ស្រេចចិត្ត)">
        <TextArea
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="បញ្ចូលកំណត់ចំណាំបន្ថែម..."
          rows={4}
          maxLength={500}
          showCount
        />
      </Card>
    </Space>
  );
}
