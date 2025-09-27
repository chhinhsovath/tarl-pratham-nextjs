'use client';

import React, { useState } from 'react';
import { Card, Tag, Button, Empty, Spin, Input, Space, Avatar, Badge, Drawer } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import kmTranslations from '@/lib/translations/km';

interface MobileListItem {
  id: string | number;
  title: string;
  titleKm?: string;
  subtitle?: string;
  subtitleKm?: string;
  status?: 'active' | 'inactive' | 'pending' | 'completed';
  tags?: string[];
  avatar?: string;
  badge?: number;
  details?: { label: string; labelKm?: string; value: string | number }[];
}

interface MobileListProps {
  title?: string;
  titleKm?: string;
  items: MobileListItem[];
  loading?: boolean;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  onRefresh?: () => void;
  onView?: (item: MobileListItem) => void;
  onEdit?: (item: MobileListItem) => void;
  onDelete?: (item: MobileListItem) => void;
  searchPlaceholder?: string;
  searchPlaceholderKm?: string;
  emptyText?: string;
  emptyTextKm?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  cardActions?: boolean;
  swipeActions?: boolean;
}

export const MobileList: React.FC<MobileListProps> = ({
  title,
  titleKm,
  items,
  loading = false,
  onSearch,
  onFilter,
  onRefresh,
  onView,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  searchPlaceholderKm = kmTranslations.actions.search,
  emptyText = 'No data',
  emptyTextKm = kmTranslations.common.noData,
  showSearch = true,
  showFilter = true,
  cardActions = true,
  swipeActions = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [actionDrawer, setActionDrawer] = useState<{ visible: boolean; item?: MobileListItem }>({
    visible: false,
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'blue';
      case 'pending': return 'warning';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return kmTranslations.common.active;
      case 'completed': return kmTranslations.mentoring.status.completed;
      case 'pending': return kmTranslations.common.pending;
      case 'inactive': return kmTranslations.common.inactive;
      default: return status;
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const renderCard = (item: MobileListItem) => (
    <Card
      key={item.id}
      className="mb-3 shadow-sm border-0"
      bodyStyle={{ padding: 12 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {item.avatar ? (
              <Avatar src={item.avatar} size={40} />
            ) : (
              <Avatar icon={<UserOutlined />} size={40} style={{ backgroundColor: '#1890ff' }} />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-khmer font-semibold text-gray-900 m-0">
                  {item.titleKm || item.title}
                </h3>
                {item.badge && (
                  <Badge count={item.badge} style={{ backgroundColor: '#52c41a' }} />
                )}
              </div>
              {item.subtitle && (
                <p className="text-sm text-gray-500 m-0">
                  {item.subtitleKm || item.subtitle}
                </p>
              )}
            </div>
          </div>

          {item.details && (
            <div className="mt-3 space-y-1">
              {item.details.map((detail, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-500 font-khmer">
                    {detail.labelKm || detail.label}:
                  </span>
                  <span className="font-medium text-gray-900">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          {item.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <Tag key={index} className="font-khmer">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {item.status && (
            <div className="mt-2">
              <Tag color={getStatusColor(item.status)} className="font-khmer">
                {getStatusText(item.status)}
              </Tag>
            </div>
          )}
        </div>

        {cardActions && (
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={() => setActionDrawer({ visible: true, item })}
            className="p-0"
          />
        )}
      </div>

      {swipeActions && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
          {onView && (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(item)}
              className="font-khmer"
            >
              {kmTranslations.actions.view}
            </Button>
          )}
          {onEdit && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(item)}
              className="font-khmer"
            >
              {kmTranslations.actions.edit}
            </Button>
          )}
          {onDelete && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(item)}
              className="font-khmer"
            >
              {kmTranslations.actions.delete}
            </Button>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <div className="mobile-list">
      {/* Header */}
      {(title || showSearch || showFilter) && (
        <div className="mb-4">
          {title && (
            <div className="mb-3">
              <h2 className="text-xl font-khmer font-bold text-gray-900">
                {titleKm || title}
              </h2>
              {title !== titleKm && (
                <p className="text-sm text-gray-500">{title}</p>
              )}
            </div>
          )}

          {(showSearch || showFilter) && (
            <div className="flex gap-2">
              {showSearch && (
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={searchPlaceholderKm}
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  size="large"
                  className="flex-1 font-khmer"
                  style={{ fontSize: 16 }}
                  allowClear
                />
              )}
              {showFilter && (
                <Button
                  icon={<FilterOutlined />}
                  size="large"
                  onClick={onFilter}
                  className="px-4"
                />
              )}
              {onRefresh && (
                <Button
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={onRefresh}
                  className="px-4"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* List Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <Empty
          description={
            <div>
              <p className="font-khmer text-base">{emptyTextKm}</p>
              <p className="text-sm text-gray-500">{emptyText}</p>
            </div>
          }
          className="mt-8"
        />
      ) : (
        <div className="space-y-0">
          {items.map(renderCard)}
        </div>
      )}

      {/* Action Drawer */}
      <Drawer
        title={
          <div>
            <p className="font-khmer text-base font-semibold m-0">
              {kmTranslations.actions.select}
            </p>
            <p className="text-sm text-gray-500 m-0">Select Action</p>
          </div>
        }
        placement="bottom"
        onClose={() => setActionDrawer({ visible: false })}
        open={actionDrawer.visible}
        height="auto"
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" size="middle" className="w-full">
          {onView && (
            <Button
              block
              size="large"
              icon={<EyeOutlined />}
              onClick={() => {
                if (actionDrawer.item) onView(actionDrawer.item);
                setActionDrawer({ visible: false });
              }}
              className="h-12 font-khmer text-base"
            >
              {kmTranslations.actions.view} / View
            </Button>
          )}
          {onEdit && (
            <Button
              block
              size="large"
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => {
                if (actionDrawer.item) onEdit(actionDrawer.item);
                setActionDrawer({ visible: false });
              }}
              className="h-12 font-khmer text-base"
            >
              {kmTranslations.actions.edit} / Edit
            </Button>
          )}
          {onDelete && (
            <Button
              block
              size="large"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                if (actionDrawer.item) onDelete(actionDrawer.item);
                setActionDrawer({ visible: false });
              }}
              className="h-12 font-khmer text-base"
            >
              {kmTranslations.actions.delete} / Delete
            </Button>
          )}
          <Button
            block
            size="large"
            onClick={() => setActionDrawer({ visible: false })}
            className="h-12 font-khmer text-base"
          >
            {kmTranslations.actions.cancel} / Cancel
          </Button>
        </Space>
      </Drawer>

      <style jsx global>{`
        .mobile-list .ant-card {
          border-radius: 12px;
        }
        
        .mobile-list .ant-card:active {
          transform: scale(0.98);
          transition: transform 0.1s;
        }
        
        .mobile-list .ant-tag {
          border-radius: 6px;
          padding: 2px 8px;
        }
        
        .mobile-list .ant-empty {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
};

// Swipeable List Item Component
export const SwipeableListItem: React.FC<{
  item: MobileListItem;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
}> = ({ item, onSwipeLeft, onSwipeRight, children }) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!swiping) return;
    
    const threshold = 100;
    if (currentX > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (currentX < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setCurrentX(0);
    setSwiping(false);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${currentX}px)`,
        transition: swiping ? 'none' : 'transform 0.3s',
      }}
    >
      {children}
    </div>
  );
};