import { Row, Col, Card, Typography } from 'antd';
import { DollarOutlined, BarChartOutlined, UserOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { GlobalStats } from '@/types/CurrencyManager';

interface StatsTabProps {
  stats: GlobalStats | null;
}

export default function StatsTab({ stats }: StatsTabProps) {
  if (!stats) {
    return <div>暂无数据</div>;
  }

  return (
    <div className='space-y-6'>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              <DollarOutlined /> 充值金额统计
            </Typography.Title>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span>总充值金额</span>
                <span>¥{stats.total_amount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>本月充值金额</span>
                <span>¥{stats.month_amount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>今日充值金额</span>
                <span>¥{stats.today_amount.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              <BarChartOutlined /> 充值次数统计
            </Typography.Title>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span>总充值次数</span>
                <span>{stats.total_count.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>本月充值次数</span>
                <span>{stats.month_count.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>今日充值次数</span>
                <span>{stats.today_count.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              <UserOutlined /> 用户统计
            </Typography.Title>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span>首充用户数</span>
                <span>{stats.first_recharge_users.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>平均充值金额</span>
                <span>¥{stats.total_count > 0 ? (stats.total_amount / stats.total_count).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              <HistoryOutlined /> 系统信息
            </Typography.Title>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span>最后更新</span>
                <span>{dayjs(stats.updated_at).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
