import React from 'react';
import { Tag, Badge, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined, CalendarOutlined, CrownOutlined, GiftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CurrencyUser } from '@/types/CurrencyManager';

interface UserCurrencyTabProps {
  users: CurrencyUser[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onStatsRefresh: () => Promise<void>;
}

export default function UserCurrencyTab({ users, loading, onRefresh: _onRefresh, onStatsRefresh: _onStatsRefresh }: UserCurrencyTabProps) {
  const [searchText, setSearchText] = React.useState('');

  const columns: ColumnsType<CurrencyUser> = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
  render: id => <span style={{ fontFamily: 'monospace' }}>{id}</span>
    },
    {
      title: '金币余额',
      dataIndex: 'currency',
      key: 'currency',
      width: 120,
      render: currency => (
        <div className='flex items-center gap-2'>
          <DollarOutlined />
          <span>{currency.toLocaleString()}</span>
        </div>
      )
    },
    {
      title: '月卡状态',
      key: 'monthCards',
      width: 200,
      render: (_unused, record) => (
        <div>
          <div className='flex items-center gap-2'>
            <CalendarOutlined />
            <span>小月卡:</span>
            <Badge
              count={dayjs(record.small_month_card_expire_time).diff(dayjs(), 'day') + 1}
              showZero
              color={record.small_month_card_expire_time > Date.now() ? 'blue' : 'default'}
            />
          </div>
          <div className='flex items-center gap-2'>
            <CrownOutlined />
            <span>大月卡:</span>
            <Badge
              count={dayjs(record.big_month_card_expire_time).diff(dayjs(), 'day') + 1}
              showZero
              color={record.big_month_card_expire_time > Date.now() ? 'purple' : 'default'}
            />
          </div>
        </div>
      )
    },
    {
      title: '充值信息',
      key: 'rechargeInfo',
      width: 180,
      render: (_, record) => (
        <div>
          <div>
            总充值: <span>¥{record.total_recharge_amount}</span>
          </div>
          <div>
            充值次数: <span>{record.total_recharge_count}</span>
          </div>
          {record.is_first_recharge && (
            <Tag color='gold' icon={<GiftOutlined />}>
              首充用户
            </Tag>
          )}
        </div>
      )
    },
    {
      title: '时间信息',
      key: 'timeInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div>
            最后充值: <div>{record.last_recharge_time ? dayjs(record.last_recharge_time).format('YYYY-MM-DD HH:mm') : '无'}</div>
          </div>
          {record.first_recharge_time && (
            <div>
              首充时间: <div>{dayjs(record.first_recharge_time).format('YYYY-MM-DD HH:mm')}</div>
            </div>
          )}
        </div>
      )
    }
  ];

  const filteredUsers = users.filter(user => user.id.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center gap-4'>
        <Input.Search placeholder='输入关键词搜索...' value={searchText} onChange={e => setSearchText(e.target.value)} onSearch={() => {}} className='flex-1' />
        <div>共 {filteredUsers.length} 个用户</div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey='id'
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`
        }}
      />
    </div>
  );
}
