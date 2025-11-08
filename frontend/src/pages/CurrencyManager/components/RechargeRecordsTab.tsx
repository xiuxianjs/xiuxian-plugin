import React from 'react';
import { Button, Input, Select, Tag, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, GiftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { RechargeRecord } from '@/types/CurrencyManager';

const { Option } = Select;

interface RechargeRecordsTabProps {
  records: RechargeRecord[];
  loading: boolean;
  config?: any; // 配置信息
}

export default function RechargeRecordsTab({ records, loading, config }: RechargeRecordsTabProps) {
  const [searchText, setSearchText] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [typeFilter, setTypeFilter] = React.useState<string>('');

  const getAmountByTier = (tier: string): number => {
    if (!config) { return 0; }
    if (tier === config.monthCardConfig?.SMALL?.name) { return config.monthCardConfig.SMALL.price; }
    if (tier === config.monthCardConfig?.BIG?.name) { return config.monthCardConfig.BIG.price; }
    const tierData = config.rechargeTiers?.find((t: any) => t.name === tier);

    return tierData?.amount ?? 0;
  };

  const columns: ColumnsType<RechargeRecord> = [
    {
      title: '记录ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: id => <span style={{ fontFamily: 'monospace' }}>{id}</span>
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 120,
      render: userId => <span style={{ fontFamily: 'monospace' }}>{userId}</span>
    },
    {
      title: '充值类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type, record) => (
        <div>
          <Tag color={getTypeColor(type)}>{getTypeName(type)}</Tag>
          {record.tier && <div style={{ fontSize: 12, opacity: 0.8 }}>{record.tier}</div>}
        </div>
      )
    },
    {
      title: '充值金额',
      dataIndex: 'tier',
      key: 'amount',
      width: 120,
      render: (tier, record) => {
        const amount = getAmountByTier(tier);

        return (
          <div>
            <strong>¥{amount}</strong>
            {record.currency_gained > 0 && <div style={{ fontSize: 12 }}>获得金币: {record.currency_gained.toLocaleString()}</div>}
            {record.month_card_days > 0 && <div style={{ fontSize: 12 }}>月卡天数: {record.month_card_days}天</div>}
          </div>
        );
      }
    },
    {
      title: '支付状态',
      dataIndex: 'payment_status',
      key: 'payment_status',
      width: 100,
      render: status => <Tag color={getStatusColor(status)}>{getStatusName(status)}</Tag>
    },
    {
      title: '支付信息',
      key: 'paymentInfo',
      width: 150,
      render: (_unused, record) => (
        <div style={{ fontSize: 12 }}>
          <div>
            <span>方式:</span>
            <span style={{ marginLeft: 4 }}>{record.payment_method}</span>
          </div>
          {record.transaction_id && <div style={{ fontFamily: 'monospace', opacity: 0.8 }}>{record.transaction_id.slice(0, 8)}...</div>}
        </div>
      )
    },
    {
      title: '时间信息',
      key: 'timeInfo',
      width: 180,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>
            <span>创建:</span>
            <div>{dayjs(record.created_at).format('MM-DD HH:mm')}</div>
          </div>
          {record.paid_at && (
            <div>
              <span>支付:</span>
              <div>{dayjs(record.paid_at).format('MM-DD HH:mm')}</div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '特殊标记',
      key: 'special',
      width: 100,
      render: (_, record) => (
        <div>
          {record.is_first_recharge && (
            <Tag color='gold' icon={<GiftOutlined />}>首充</Tag>
          )}
          {record.first_recharge_bonus > 0 && <div style={{ fontSize: 12 }}>奖励: +{record.first_recharge_bonus}</div>}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: () => (
        <Space>
          <Button size='small' icon={<EyeOutlined />}>详情</Button>
        </Space>
      )
    }
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.user_id.toLowerCase().includes(searchText.toLowerCase()) || record.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || record.payment_status === statusFilter;
    const matchesType = !typeFilter || record.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-4 items-center'>
        <div className='flex-1 min-w-0'>
          <Input.Search
            placeholder='搜索用户ID或记录ID'
            className='w-full'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onSearch={() => {}}
            onKeyPress={e => e.key === 'Enter' && setSearchText((e.target as HTMLInputElement).value)}
          />
        </div>
        <Select placeholder='支付状态' allowClear style={{ width: 120 }} onChange={setStatusFilter}>
          <Option value='pending'>待支付</Option>
          <Option value='success'>支付成功</Option>
          <Option value='failed'>支付失败</Option>
          <Option value='refunded'>已退款</Option>
        </Select>
        <Select placeholder='充值类型' allowClear style={{ width: 120 }} onChange={setTypeFilter}>
          <Option value='currency'>金币充值</Option>
          <Option value='small_month_card'>小月卡</Option>
          <Option value='big_month_card'>大月卡</Option>
          <Option value='combo'>组合充值</Option>
        </Select>
        <div>共 {filteredRecords.length} 条记录</div>
      </div>

      <Table<RechargeRecord>
        columns={columns}
        dataSource={filteredRecords}
        loading={loading}
        rowKey='id'
        pagination={{
          current: 1,
          pageSize: 20,
          total: filteredRecords.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`
        }}
      />
    </div>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'currency':
      return 'green';
    case 'small_month_card':
      return 'blue';
    case 'big_month_card':
      return 'purple';
    case 'combo':
      return 'orange';
    default:
      return 'default';
  }
}

function getTypeName(type: string): string {
  switch (type) {
    case 'currency':
      return '金币充值';
    case 'small_month_card':
      return '小月卡';
    case 'big_month_card':
      return '大月卡';
    case 'combo':
      return '组合充值';
    default:
      return type;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'success':
      return 'green';
    case 'failed':
      return 'red';
    case 'refunded':
      return 'gray';
    default:
      return 'default';
  }
}

function getStatusName(status: string): string {
  switch (status) {
    case 'pending':
      return '待支付';
    case 'success':
      return '支付成功';
    case 'failed':
      return '支付失败';
    case 'refunded':
      return '已退款';
    default:
      return status;
  }
}
