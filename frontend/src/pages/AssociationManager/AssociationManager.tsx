import { Tag, Tooltip, Card, Typography, Space, Button, Input, Table, Row, Col, Statistic } from 'antd';
import { EyeOutlined, TeamOutlined, FireOutlined, CrownOutlined, BankOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Association } from '@/types/types';
import AssociationInfo from './AssociationInfo';
import { useAssociationManagerCode } from './AssociationManager.code';

const AssociationManager = () => {
  const {
    associations,
    loading,
    searchText,
    selectedAssociation,
    associationDetailVisible,
    pagination,
    stats,
    fetchAssociations,
    handleSearchAndFilter,
    handleTableChange,
    getAssociationType,
    getLevelName,
    setSearchText,
    setSelectedAssociation,
    setAssociationDetailVisible
  } = useAssociationManagerCode();

  const columns: ColumnsType<Association> = [
    {
      title: '宗门信息',
      key: 'associationInfo',
      width: 280,
      render: (_, record) => (
        <Space direction='vertical' size={2}>
          <Typography.Text strong>{record.宗门名称}</Typography.Text>
          <Typography.Text type='secondary'>等级: {record.宗门等级}</Typography.Text>
          <Typography.Text type='secondary'>宗主: {record.宗主}</Typography.Text>
        </Space>
      )
    },
    {
      title: '宗门类型',
      key: 'type',
      width: 120,
      render: (_, record) => <Tag color={record.power > 0 ? 'purple' : 'blue'}>{getAssociationType(record.power)}</Tag>
    },
    {
      title: '成员统计',
      key: 'members',
      width: 180,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>总成员：{(record.所有成员?.length ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>副宗主：{(record.副宗主?.length ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>长老：{(record.长老?.length ?? 0).toLocaleString()}</Typography.Text>
        </Space>
      )
    },
    {
      title: '资源信息',
      key: 'resources',
      width: 160,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>灵石池：{(record.灵石池 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>大阵血量：{(record.大阵血量 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>最低境界：{getLevelName(record.最低加入境界)}</Typography.Text>
        </Space>
      )
    },
    {
      title: '宗门驻地',
      key: 'location',
      width: 140,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>驻地：{record.宗门驻地 ?? '无驻地'}</Typography.Text>
          <Typography.Text>神兽：{record.宗门神兽 ?? '无'}</Typography.Text>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Tooltip title='查看详情' placement='top'>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAssociation(record);
              setAssociationDetailVisible(true);
            }}
          >
            查看
          </Button>
        </Tooltip>
      )
    }
  ];

  return (
    <Space direction='vertical' size='large' className='bg-slate-200 p-4' style={{ width: '100%' }}>
      <Card
        title={
          <Space align='center'>
            <TeamOutlined />
            <Typography.Text strong>宗门管理</Typography.Text>
          </Space>
        }
        extra={
          <Button
            type='primary'
            loading={loading}
            onClick={() => {
              void fetchAssociations(1, pagination.pageSize);
            }}
          >
            刷新
          </Button>
        }
      >
        <Typography.Text type='secondary'>管理修仙世界的宗门信息</Typography.Text>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='总宗门数' value={stats.total ?? 0} prefix={<TeamOutlined />} />
            <Typography.Text type='secondary'>
              仙界: {stats.xianjieCount ?? 0} | 凡界: {stats.fanjieCount ?? 0}
            </Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='仙界宗门' value={stats.xianjieCount ?? 0} prefix={<CrownOutlined />} />
            <Typography.Text type='secondary'>占比: {stats.total ? Math.round((stats.xianjieCount / stats.total) * 100) : 0}%</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='总灵石池' value={stats.totalLingshi ?? 0} prefix={<BankOutlined />} />
            <Typography.Text type='secondary'>平均: {stats.total ? Math.round(stats.totalLingshi / stats.total) : 0}</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='总成员数' value={stats.totalMembers ?? 0} prefix={<FireOutlined />} />
            <Typography.Text type='secondary'>平均: {stats.total ? Math.round(stats.totalMembers / stats.total) : 0}</Typography.Text>
          </Card>
        </Col>
      </Row>

      <Input.Search
        placeholder='搜索宗门名称、宗主或驻地...'
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onSearch={() => {
          void handleSearchAndFilter();
        }}
        onPressEnter={() => {
          void handleSearchAndFilter();
        }}
        allowClear
      />

      <Card title='宗门列表'>
        <Table
          columns={columns}
          dataSource={associations}
          rowKey='宗门名称'
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          onChange={p => {
            void handleTableChange(p.current!, p.pageSize!);
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <AssociationInfo
        associationDetailVisible={associationDetailVisible}
        setAssociationDetailVisible={setAssociationDetailVisible}
        selectedAssociation={selectedAssociation}
        getAssociationType={getAssociationType}
        getLevelName={getLevelName}
      />
    </Space>
  );
};

export default AssociationManager;
