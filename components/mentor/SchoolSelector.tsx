"use client";

import { useState, useEffect } from "react";
import { Select, Space, Tag, Spin, Alert } from "antd";
import { BankOutlined, BookOutlined } from "@ant-design/icons";

const { Option } = Select;

interface SchoolAssignment {
  pilot_school_id: number;
  subject: string;
  school_name: string;
  province: string;
  district: string;
}

interface SchoolSelectorProps {
  value?: number | "all";
  onChange?: (value: number | "all") => void;
  style?: React.CSSProperties;
  size?: "small" | "middle" | "large";
  showSubjectTag?: boolean;
  allowAll?: boolean;
  filterBySubject?: "Language" | "Math";
}

/**
 * SchoolSelector Component
 * A reusable component for mentors to select from their assigned schools
 */
export default function SchoolSelector({
  value,
  onChange,
  style = {},
  size = "middle",
  showSubjectTag = true,
  allowAll = true,
  filterBySubject,
}: SchoolSelectorProps) {
  const [schools, setSchools] = useState<SchoolAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignedSchools();
  }, [filterBySubject]);

  const fetchAssignedSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterBySubject) {
        params.append("subject", filterBySubject);
      }

      const response = await fetch(`/api/mentor/schools?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch assigned schools");
      }

      const data = await response.json();
      setSchools(data.schools || []);
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError("មិនអាចទាញយកទិន្នន័យសាលារៀន");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Select
        placeholder="កំពុងផ្ទុក..."
        style={{ minWidth: 250, ...style }}
        size={size}
        loading
        disabled
      />
    );
  }

  if (error) {
    return (
      <Alert
        message={error}
        type="error"
        showIcon
        style={{ maxWidth: 400 }}
      />
    );
  }

  // Group schools by school_name to combine subjects
  const groupedSchools = schools.reduce((acc, school) => {
    const existing = acc.find(
      (s) => s.pilot_school_id === school.pilot_school_id
    );
    if (existing) {
      existing.subjects.push(school.subject);
    } else {
      acc.push({
        ...school,
        subjects: [school.subject],
      });
    }
    return acc;
  }, [] as Array<SchoolAssignment & { subjects: string[] }>);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="ជ្រើសរើសសាលារៀន (Select School)"
      style={{ minWidth: 250, ...style }}
      size={size}
      showSearch
      optionFilterProp="children"
    >
      {allowAll && (
        <Option value="all">
          <Space>
            <BankOutlined />
            សាលារៀនទាំងអស់ (All Schools)
          </Space>
        </Option>
      )}

      {groupedSchools.map((school) => (
        <Option
          key={school.pilot_school_id}
          value={school.pilot_school_id}
        >
          <Space direction="vertical" size={0}>
            <Space>
              <BankOutlined />
              {school.school_name}
            </Space>
            <span style={{ fontSize: 12, color: "#999" }}>
              {school.province} - {school.district}
            </span>
            {showSubjectTag && (
              <Space size={4}>
                {school.subjects.map((subject) => (
                  <Tag
                    key={subject}
                    icon={<BookOutlined />}
                    color={subject === "Language" ? "blue" : "green"}
                    style={{ fontSize: 10, marginRight: 0 }}
                  >
                    {subject === "Language" ? "ភាសា" : "គណិត"}
                  </Tag>
                ))}
              </Space>
            )}
          </Space>
        </Option>
      ))}
    </Select>
  );
}
