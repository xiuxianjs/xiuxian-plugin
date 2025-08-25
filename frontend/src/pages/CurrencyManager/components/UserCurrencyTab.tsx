import React from 'react';
import { Tag, Badge, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined, CalendarOutlined, CrownOutlined, GiftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CurrencyUser } from '@/types/CurrencyManager';

// 导入UI组件库
import { XiuxianTableWithPagination } from '@/components/ui';

interface UserCurrencyTabProps {
  users: CurrencyUser[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onStatsRefresh: () => Promise<void>;
}

export default function UserCurrencyTab({
  users,
  loading,
  onRefresh: _onRefresh,
  onStatsRefresh: _onStatsRefresh
}: UserCurrencyTabProps) {
  const [searchText, setSearchText] = React.useState('');

  const columns: ColumnsType<CurrencyUser> = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: id => <div className='font-mono text-sm bg-slate-700/50 px-2 py-1 rounded'>{id}</div>
    },
    {
      title: '金币余额',
      dataIndex: 'currency',
      key: 'currency',
      width: 120,
      render: currency => (
        <div className='flex items-center gap-2'>
          <DollarOutlined className='text-yellow-400' />
          <span className='font-bold text-yellow-400'>{currency.toLocaleString()}</span>
        </div>
      )
    },
    {
      title: '月卡状态',
      key: 'monthCards',
      width: 200,
      render: (_unused, record) => (
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <CalendarOutlined className='text-blue-400' />
            <span className='text-sm'>小月卡:</span>
            <Badge
              count={record.small_month_card_days}
              showZero
              color={record.small_month_card_days > 0 ? 'blue' : 'default'}
            />
          </div>
          <div className='flex items-center gap-2'>
            <CrownOutlined className='text-purple-400' />
            <span className='text-sm'>大月卡:</span>
            <Badge
              count={record.big_month_card_days}
              showZero
              color={record.big_month_card_days > 0 ? 'purple' : 'default'}
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
        <div className='space-y-1'>
          <div className='text-sm'>
            <span className='text-slate-400'>总充值:</span>
            <span className='text-green-400 font-bold ml-1'>¥{record.total_recharge_amount}</span>
          </div>
          <div className='text-sm'>
            <span className='text-slate-400'>充值次数:</span>
            <span className='text-blue-400 font-bold ml-1'>{record.total_recharge_count}</span>
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
        <div className='space-y-1 text-xs'>
          <div>
            <span className='text-slate-400'>最后充值:</span>
            <div className='text-slate-300'>
              {record.last_recharge_time
                ? dayjs(record.last_recharge_time).format('YYYY-MM-DD HH:mm')
                : '无'}
            </div>
          </div>
          {record.first_recharge_time && (
            <div>
              <span className='text-slate-400'>首充时间:</span>
              <div className='text-slate-300'>
                {dayjs(record.first_recharge_time).format('YYYY-MM-DD HH:mm')}
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  const filteredUsers = users.filter(user =>
    user.id.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <div className='flex-1 min-w-0'>
          <Input.Search
            placeholder='输入关键词搜索...'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onSearch={() => {}}
            size='large'
            onKeyPress={e =>
              e.key === 'Enter' && setSearchText((e.target as HTMLInputElement).value)
            }
            className='w-full xiuxian-input'
          />
        </div>
        <div className='text-slate-400 text-sm'>共 {filteredUsers.length} 个用户</div>
      </div>

      <XiuxianTableWithPagination
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey='id'
        pagination={{
          current: 1,
          pageSize: 20,
          total: filteredUsers.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`
        }}
        rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
      />
    </div>
  );
}
