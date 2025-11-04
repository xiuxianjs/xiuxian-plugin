import { Row, Col, Table } from 'antd';
import { Card, Typography, Space, Button, Statistic, Empty } from 'antd';
import { UserOutlined, TeamOutlined, CrownOutlined, TrophyOutlined, RiseOutlined, ClockCircleOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import { TopAssociation, TopPlayer } from '@/types/types';
import { levelNames } from '@/config';
import { useDashboardCode } from './Dashboard.code';

// 导入UI组件库

export default function Dashboard() {
  const { stats, loading, fetchStats } = useDashboardCode();

  // 玩家排行榜列配置
  const playerColumns: ColumnsType<TopPlayer> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>
    },
    {
      title: '玩家',
      key: 'name',
      render: (_, record) => <span>{record.name}</span>
    },
    {
      title: 'ID',
      key: 'id',
      render: (_, record) => <span>{record.id}</span>
    },
    {
      title: '境界',
      key: 'level',
      render: (_, record) => <span>{levelNames[record.level]}</span>
    },
    {
      title: '战力',
      key: 'power',
  render: (_, record) => <span>{(record.power ?? 0).toLocaleString()}</span>
    }
  ];

  // 宗门排行榜列配置
  const associationColumns: ColumnsType<TopAssociation> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>
    },
    {
      title: '宗门',
      key: 'name',
      render: (_, record) => <span>{record.name}</span>
    },
    {
      title: '成员数',
      key: 'members',
      render: (_, record) => <span>{record.members}</span>
    },
    {
      title: '总战力',
      key: 'power',
  render: (_, record) => <span>{(record.power ?? 0).toLocaleString()}</span>
    },
    {
      title: '灵石池',
      key: 'lingshi',
  render: (_, record) => <span>{(record.lingshi ?? 0).toLocaleString()}</span>
    }
  ];

  return (
    <Space direction='vertical' size='large' className='bg-slate-200 p-4' style={{ width: '100%' }}>
      <Card
        title={
          <Space align='center'>
            <TrophyOutlined />
            <Typography.Text strong>数据看板</Typography.Text>
          </Space>
        }
        extra={
          <Button
            onClick={() => {
              void fetchStats();
            }}
            loading={loading}
            type='primary'
            icon={<RiseOutlined />}
          >
            刷新
          </Button>
        }
      >
        <Typography.Text type='secondary'>修仙界数据总览</Typography.Text>
      </Card>

      {stats && (
        <>
          {/* 统计卡片 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Card>
                <Statistic title='总玩家数' value={stats.users.total} prefix={<UserOutlined />} />
                <Typography.Text type='secondary'>
                  活跃: {stats.users.active} | 今日新增: {stats.users.newToday}
                </Typography.Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card>
                <Statistic title='宗门总数' value={stats.associations.total} prefix={<TeamOutlined />} />
                <Typography.Text type='secondary'>总成员: {stats.associations.totalMembers}</Typography.Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card>
                <Statistic title='定时任务总数' value={stats.system.activeTasks} prefix={<ClockCircleOutlined />} />
                <Typography.Text type='secondary'>运行时间: {stats.system.uptime}</Typography.Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card>
                <Statistic title='数据更新时间' value={new Date(stats.rankings.lastUpdate).toLocaleString('zh-CN')} />
                <Typography.Text type='secondary'>最后更新: {new Date(stats.rankings.lastUpdate).toLocaleString('zh-CN')}</Typography.Text>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* 玩家排行榜 */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space align='center'>
                    <TrophyOutlined /> 玩家排行榜 TOP10
                  </Space>
                }
              >
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
              <Card
                title={
                  <Space align='center'>
                    <CrownOutlined /> 宗门排行榜 TOP10
                  </Space>
                }
              >
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
        </>
      )}

      {!stats && !loading && (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction='vertical'>
                <Typography.Text>暂无数据</Typography.Text>
                <Typography.Text type='secondary'>请点击刷新按钮获取最新数据</Typography.Text>
              </Space>
            }
          />
        </Card>
      )}
    </Space>
  );
}
