import { Tag, Tooltip, Card, Typography, Space, Button, Input, Table, Row, Col, Statistic, Avatar } from 'antd';
import { EyeOutlined, EditOutlined, UserOutlined, TrophyOutlined, FireOutlined, CrownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { GameUser } from '@/types/types';
import UserInfo from './UserInfo';
import UserEditModal from './UserEditModal';
import { useUserManagerCode } from './UserManager.code';
import { levelNames } from '@/config';

export default function UserManager() {
  const {
    gameUsers,
    loading,
    searchText,
    setSearchText,
    setSelectedUser,
    setUserDetailVisible,
    setUserEditVisible,
    stats,
    pagination,
    fetchGameUsers,
    handleSearchAndFilter,
    handleTableChange,
    handleEditUser,
    handleSaveUser,
    getSexDisplay,
    getLinggenColor,
    getLevelName,
    userDetailVisible,
    userEditVisible,
    editLoading,
    selectedUser
  } = useUserManagerCode();

  // 表格列定义
  const columns: ColumnsType<GameUser> = [
    {
      title: '修仙者信息',
      key: 'userInfo',
      width: 220,
      render: (_, record) => (
        <Space align='start'>
          <Avatar size={48} src={record.avatar}>
            {record.名号?.[0] ?? '道'}
          </Avatar>
          <Space direction='vertical' size={2}>
            <Typography.Text strong>{record.名号}</Typography.Text>
            <Typography.Text type='secondary'>ID: {record.id}</Typography.Text>
            <Typography.Text type='secondary'>
              {getSexDisplay(record.sex)} | 轮回: {record.lunhui}
            </Typography.Text>
          </Space>
        </Space>
      )
    },
    {
      title: '境界修为',
      key: 'level',
      width: 160,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text strong>{levelNames[record.level_id]}</Typography.Text>
          <Typography.Text>修为: {(record.修为 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>血气: {(record.血气 ?? 0).toLocaleString()}</Typography.Text>
        </Space>
      )
    },
    {
      title: '灵根资质',
      key: 'linggen',
      width: 130,
  render: (_, record) => <Tag color={getLinggenColor(record.灵根)}>{record.灵根?.name ?? '未知'}</Tag>
    },
    {
      title: '战斗属性',
      key: 'combat',
      width: 160,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>攻击: {(record.攻击 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>防御: {(record.防御 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>
            血量: {(record.当前血量 ?? 0).toLocaleString()}/{(record.血量上限 ?? 0).toLocaleString()}
          </Typography.Text>
        </Space>
      )
    },
    {
      title: '修仙资源',
      key: 'resources',
      width: 140,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>灵石: {(record.灵石 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>神石: {(record.神石 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>轮回点: {record.轮回点}</Typography.Text>
        </Space>
      )
    },
    {
      title: '修仙成就',
      key: 'achievements',
      width: 140,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>镇妖塔: {record.镇妖塔层数}层</Typography.Text>
          <Typography.Text>神魄段: {record.神魄段数}段</Typography.Text>
          <Typography.Text>魔道值: {record.魔道值}</Typography.Text>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title='查看修仙详情'>
            <Button
              type='primary'
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedUser(record);
                setUserDetailVisible(true);
              }}
            >
              查看
            </Button>
          </Tooltip>
          <Tooltip title='编辑用户信息'>
            <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
              编辑
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Space direction='vertical' size='large' className='bg-slate-200 p-4' style={{ width: '100%' }}>
      <Card
        title={
          <Space align='center'>
            <CrownOutlined />
            <Typography.Text strong>玩家管理</Typography.Text>
          </Space>
        }
        extra={
          <Button
            type='primary'
            loading={loading}
            onClick={() => {
              void fetchGameUsers(1, pagination.pageSize);
            }}
          >
            刷新
          </Button>
        }
      >
        <Typography.Text type='secondary'>管理修仙界众位道友信息</Typography.Text>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='总修仙者' value={Number(stats.total ?? 0)} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='高阶修士' value={Number(stats.highLevel ?? 0)} prefix={<CrownOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='总灵石' value={Number(stats.totalLingshi ?? 0)} prefix={<TrophyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title='总轮回' value={Number(stats.totalLunhui ?? 0)} prefix={<FireOutlined />} />
          </Card>
        </Col>
      </Row>

      <Input.Search
        placeholder='搜索修仙者名号或ID...'
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

      <Card title='修仙者列表'>
        <Table
          columns={columns}
          dataSource={gameUsers}
          rowKey='id'
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 用户详情弹窗 */}
      <UserInfo
        userDetailVisible={userDetailVisible}
        setUserDetailVisible={setUserDetailVisible}
        selectedUser={selectedUser}
        getSexDisplay={getSexDisplay}
        getLevelName={getLevelName}
        getLinggenColor={getLinggenColor}
      />

      {/* 用户编辑弹窗 */}
      <UserEditModal
        visible={userEditVisible}
        onCancel={() => setUserEditVisible(false)}
        onSave={user => {
          void handleSaveUser(user);
        }}
        user={selectedUser}
        loading={editLoading}
        getSexDisplay={getSexDisplay}
        getLinggenColor={getLinggenColor}
      />
    </Space>
  );
}
