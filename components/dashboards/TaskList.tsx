'use client';

import { useState } from 'react';
import { List, Checkbox, Space, Typography, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete?: (taskId: string) => void;
}

export default function TaskList({ tasks, onTaskComplete }: TaskListProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(
    new Set(tasks.filter(t => t.completed).map(t => t.id))
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'បន្ទាន់';
      case 'medium': return 'មធ្យម';
      case 'low': return 'ទាប';
      default: return priority;
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      if (onTaskComplete) {
        onTaskComplete(taskId);
      }
    }
    setCompletedTasks(newCompleted);
  };

  return (
    <List
      dataSource={tasks}
      renderItem={(task) => {
        const isCompleted = completedTasks.has(task.id);
        return (
          <List.Item
            style={{
              padding: '12px 0',
              opacity: isCompleted ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }} align="start">
                <Space align="start" style={{ flex: 1, minWidth: '200px' }}>
                  <Checkbox
                    checked={isCompleted}
                    onChange={() => handleTaskToggle(task.id)}
                    style={{ marginTop: '4px', minWidth: '20px', minHeight: '20px' }}
                  />
                  <Space direction="vertical" size={4}>
                    <Text
                      strong
                      style={{
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        fontSize: '15px'
                      }}
                    >
                      {isCompleted && <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />}
                      {task.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {task.description}
                    </Text>
                    {task.dueDate && (
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        <ClockCircleOutlined /> {task.dueDate}
                      </Text>
                    )}
                  </Space>
                </Space>
                <Tag color={getPriorityColor(task.priority)} style={{ marginTop: '4px' }}>
                  {getPriorityLabel(task.priority)}
                </Tag>
              </Space>
            </div>
          </List.Item>
        );
      }}
    />
  );
}
