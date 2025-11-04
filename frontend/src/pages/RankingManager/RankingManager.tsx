import { Table, Button, Card, Space, Row, Col, Statistic, Radio } from 'antd';
import { TrophyOutlined, CrownOutlined, TeamOutlined, ReloadOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import { RankingItem } from '@/types/types';
import { levelNames } from '@/config';
import { rankingTypes, useRankingManagerCode } from './RankingManager.code';

export default function RankingManager() {
  const {
    rankingStats,
    selectedRankingType,
    rankingLimit,
    rankingData,
    loading,
    getRankingTypeLabel,
    handleTriggerCalculation,
    fetchRankingStats,
    handleRankingTypeChange,
    handleRankingLimitChange,
    fetchRankingData
  } = useRankingManagerCode();

  // 表格列定义
  const columns: ColumnsType<RankingItem> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_, record) => record.rank
    },
    {
      title: '名称',
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div>
          <div className='font-bold'>{record.name}</div>
          {record.extra?.名号 && <div className='text-xs'>道号: {record.extra.名号}</div>}
          {record.extra?.宗主 && <div className='text-xs'>宗主: {record.extra.宗主}</div>}
        </div>
      )
    },
    {
      title: selectedRankingType === 'PLAYER_LEVEL' ? '境界' : '数值',
      key: 'value',
      width: 120,
      render: (_, record) => {
        // 如果选择了境界，value是境界等级
        if (selectedRankingType === 'PLAYER_LEVEL') {
          return levelNames[record.value];
        }

        return record.value.toLocaleString();
      }
    },
    {
      title: '类型',
      key: 'type',
      width: 100,
      render: (_, record) => (record.extra?.type === 'player' ? '玩家' : '宗门')
    }
  ];

  return (
    <div className='min-h-screen bg-gray-200 p-4'>
      {/* 页面标题和操作按钮 */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold m-0'>排行榜管理</h1>
          <p className='text-sm mt-2 mb-0'>管理修仙界各种排行榜数据</p>
        </div>
        <Space>
          <Button type='primary' icon={<TrophyOutlined />} onClick={() => void handleTriggerCalculation()}>
            重新计算排名
          </Button>
          <Button
            icon={<ReloadOutlined spin={loading} />}
            loading={loading}
            onClick={() => {
              void fetchRankingStats();
              void fetchRankingData(selectedRankingType, rankingLimit);
            }}
          >
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 统计信息 */}
      {rankingStats && (
        <Row gutter={[16, 16]} className='mb-6'>
          <Col xs={24} md={8}>
            <Card className='shadow-md'>
              <Statistic title='总排行榜数' value={rankingStats.associationCount + rankingStats.playerCount} prefix={<TrophyOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className='shadow-md'>
              <Statistic title='玩家排行榜' value={rankingStats.playerCount} prefix={<CrownOutlined />} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className='shadow-md'>
              <Statistic title='宗门排行榜' value={rankingStats.associationCount} prefix={<TeamOutlined />} />
            </Card>
          </Col>
        </Row>
      )}

      {/* 排名类型选择 */}
      <Card title='排名类型' className='mb-6'>
        <Radio.Group value={selectedRankingType} onChange={e => handleRankingTypeChange(e.target.value)} buttonStyle='solid'>
          {rankingTypes.map(type => (
            <Radio.Button key={type.value} value={type.value}>
              {type.icon} {type.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Card>

      {/* 排名数量选择 */}
      <Card title='显示数量' className='mb-6'>
        <Radio.Group value={rankingLimit} onChange={e => handleRankingLimitChange(e.target.value)} buttonStyle='solid'>
          {[10, 20, 50, 100].map(limit => (
            <Radio.Button key={limit} value={limit}>
              前{limit}名
            </Radio.Button>
          ))}
        </Radio.Group>
      </Card>

      {/* 排名表格 */}
      <Card title={`${getRankingTypeLabel(selectedRankingType)} - 前${rankingLimit}名`}>
        <Table columns={columns} dataSource={rankingData} rowKey='id' loading={loading} pagination={false} scroll={{ x: 800 }} />
      </Card>
    </div>
  );
}
