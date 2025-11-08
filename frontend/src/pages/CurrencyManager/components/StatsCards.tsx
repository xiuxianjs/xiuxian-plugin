import { BarChartOutlined } from '@ant-design/icons';
import { Card, Row, Col, Statistic } from 'antd';
import type { GlobalStats } from '@/types/CurrencyManager';

interface StatsCardsProps {
  stats: GlobalStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <Row gutter={[16, 16]} className='mb-6'>
      <Col xs={24} sm={12} md={6}>
        <Card className='shadow-md'>
          <Statistic title='总充值金额' value={stats.total_amount} prefix='¥' suffix='' />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card className='shadow-md'>
          <Statistic title='总充值次数' value={stats.total_count} prefix={<BarChartOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card className='shadow-md'>
          <Statistic title='首充用户数' value={stats.first_recharge_users} prefix={<BarChartOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card className='shadow-md'>
          <Statistic title='今日充值' value={stats.today_amount} prefix='¥' />
        </Card>
      </Col>
    </Row>
  );
}
