import { Table, Tooltip, Card, Typography, Space, Button, Input } from 'antd';
import { EyeOutlined, EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Najie } from '@/types/types';
import NajieInfo from './NajieInfo';
import NajieEditModal from './NajieEditModal';
import { useNajieManagerCode } from './NajieManager.code';

export default function NajieManager() {
  const {
    najieList,
    loading,
    searchText,
    selectedNajie,
    najieDetailVisible,
    najieEditVisible,
    editLoading,
    pagination,
    fetchNajie,
    handleSearchAndFilter,
    handleTableChange,
    handleEditNajie,
    handleSaveNajie,
    getTotalItems,
    setSearchText,
    setSelectedNajie,
    setNajieDetailVisible,
    setNajieEditVisible
  } = useNajieManagerCode();

  // 表格列定义
  const columns: ColumnsType<Najie> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 150,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text strong>用户ID: {record.userId}</Typography.Text>
          <Typography.Text type='secondary'>背包等级: {record.等级 ?? 1}</Typography.Text>
        </Space>
      )
    },
    {
      title: '灵石信息',
      key: 'lingshi',
      width: 120,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>当前: {(record.灵石 ?? 0).toLocaleString()}</Typography.Text>
          <Typography.Text>上限: {(record.灵石上限 ?? 0).toLocaleString()}</Typography.Text>
        </Space>
      )
    },
    {
      title: '物品统计',
      key: 'items',
      width: 200,
      render: (_, record) => (
        <Space direction='vertical' size={0}>
          <Typography.Text>总物品: {getTotalItems(record)}</Typography.Text>
          <Typography.Text>装备: {record.装备?.length ?? 0}</Typography.Text>
          <Typography.Text>丹药: {record.丹药?.length ?? 0}</Typography.Text>
          <Typography.Text>道具: {record.道具?.length ?? 0}</Typography.Text>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title='查看详情'>
            <Button
              type='primary'
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedNajie(record);
                setNajieDetailVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title='编辑背包'>
            <Button icon={<EditOutlined />} onClick={() => handleEditNajie(record)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className='space-y-6 bg-slate-200 p-4'>
      <Card
        title={
          <Space align='center'>
            <ShoppingOutlined />
            <Typography.Text strong>背包管理</Typography.Text>
          </Space>
        }
        extra={
          <Button
            type='primary'
            loading={loading}
            onClick={() => {
              void fetchNajie(1, pagination.pageSize);
            }}
          >
            刷新
          </Button>
        }
      >
        <Typography.Text type='secondary'>管理修仙界道友的背包物品</Typography.Text>
      </Card>

      <Input.Search
        placeholder='搜索用户ID'
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

      <Card title='背包列表'>
        <Table
          columns={columns}
          dataSource={najieList}
          rowKey='userId'
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

      {/* 背包详情弹窗 */}
      <NajieInfo
        najieDetailVisible={najieDetailVisible}
        setNajieDetailVisible={setNajieDetailVisible}
        selectedNajie={selectedNajie}
        getTotalItems={getTotalItems}
      />

      {/* 背包编辑弹窗 */}
      <NajieEditModal
        visible={najieEditVisible}
        onCancel={() => setNajieEditVisible(false)}
        onSave={najie => {
          void handleSaveNajie(najie);
        }}
        najie={selectedNajie}
        loading={editLoading}
      />
    </div>
  );
}
