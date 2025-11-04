import { Row, Col, Table, Button, Card, Statistic, Empty } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ReloadOutlined,
  RiseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import { TopAssociation, TopPlayer } from '@/types/types';
import { levelNames } from '@/config';
import { useDashboardCode } from './Dashboard.code';

export default function DashboardRefactored() {
  const { stats, loading, fetchStats } = useDashboardCode();

  // 玩家排行榜列配置
  const playerColumns: ColumnsType<TopPlayer> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: '玩家',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '境界',
      key: 'level',
      render: (_, record) => levelNames[record.level]
    },
    {
      title: '战力',
      key: 'power',
  render: (_, record) => (record.power ?? 0).toLocaleString()
    }
  ];

  // 宗门排行榜列配置
  const associationColumns: ColumnsType<TopAssociation> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: '宗门',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '成员数',
      dataIndex: 'members',
      key: 'members'
    },
    {
      title: '总战力',
      key: 'power',
  render: (_, record) => (record.power ?? 0).toLocaleString()
    },
    {
      title: '灵石池',
      key: 'lingshi',
  render: (_, record) => (record.lingshi ?? 0).toLocaleString()
    }
  ];

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      {/* 页面标题和刷新按钮 */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold m-0'>数据看板</h1>
          <p className='text-sm mt-2 mb-0'>修仙界数据总览</p>
        </div>
        <Button icon={<ReloadOutlined spin={loading} />} onClick={() => { void fetchStats(); }} loading={loading}>
          刷新数据
        </Button>
      </div>

      {stats && (
        <>
          {/* 统计卡片 */}
          <Row gutter={[16, 16]} className='mb-6'>
            <Col xs={24} sm={12} md={6}>
              <Card className='shadow-md'>
                <Statistic
                  title='总玩家数'
                  value={stats.users.total}
                  prefix={<UserOutlined />}
                  suffix={
                    <div className='text-xs'>
                      活跃: {stats.users.active} | 今日新增: {stats.users.newToday}
                    </div>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className='shadow-md'>
                <Statistic
                  title='宗门总数'
                  value={stats.associations.total}
                  prefix={<TeamOutlined />}
                  suffix={<div className='text-xs'>总成员: {stats.associations.totalMembers}</div>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className='shadow-md'>
                <Statistic
                  title='定时任务总数'
                  value={stats.system.activeTasks}
                  prefix={<ClockCircleOutlined />}
                  suffix={<div className='text-xs'>运行时间: {stats.system.uptime}</div>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className='shadow-md'>
                <Statistic title='数据更新时间' value={new Date(stats.rankings.lastUpdate).toLocaleString('zh-CN')} prefix={<RiseOutlined />} />
              </Card>
            </Col>
          </Row>

          {/* 排行榜区域 */}
          <Card title='排行榜数据' className='shadow-md'>
            <Row gutter={[16, 16]}>
              {/* 玩家排行榜 */}
              <Col xs={24} lg={12}>
                <Card type='inner' title='玩家排行榜 TOP10' size='small' className='shadow-sm'>
                  <Table
                    columns={playerColumns}
                    dataSource={stats.rankings.topPlayers.slice(0, 10)}
                    rowKey='id'
                    pagination={false}
                    size='small'
                    scroll={{ x: 300, y: 300 }}
                  />
                </Card>
              </Col>

              {/* 宗门排行榜 */}
              <Col xs={24} lg={12}>
                <Card type='inner' title='宗门排行榜 TOP10' size='small' className='shadow-sm'>
                  <Table
                    columns={associationColumns}
                    dataSource={stats.rankings.topAssociations.slice(0, 10)}
                    rowKey='name'
                    pagination={false}
                    size='small'
                    scroll={{ x: 400, y: 300 }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </>
      )}

      {!stats && !loading && <Empty description='暂无数据，请点击刷新按钮获取最新数据' />}
    </div>
  );
}
