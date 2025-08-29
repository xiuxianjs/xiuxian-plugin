import React from 'react';
import { Table, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Najie } from '@/types/types';
import NajieInfo from './NajieInfo';
import NajieEditModal from './NajieEditModal';
import { useNajieManagerCode } from './NajieManager.code';

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianSearchBar,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianTableWithPagination
} from '@/components/ui';

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
      title: (
        <div className='flex items-center gap-2 text-purple-400 font-bold'>
          <span>用户信息</span>
        </div>
      ),
      key: 'userInfo',
      width: 150,
      render: (_, record) => (
        <div>
          <div className='font-bold text-white'>用户ID: {record.userId}</div>
          <div className='text-xs text-slate-400'>背包等级: {record.等级 || 1}</div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-green-400 font-bold'>
          <span>灵石信息</span>
        </div>
      ),
      key: 'lingshi',
      width: 120,
      render: (_, record) => (
        <div>
          <div className='text-xs text-green-500'>当前: {record.灵石?.toLocaleString() || 0}</div>
          <div className='text-xs text-yellow-500'>上限: {record.灵石上限?.toLocaleString() || 0}</div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-blue-400 font-bold'>
          <span>物品统计</span>
        </div>
      ),
      key: 'items',
      width: 200,
      render: (_, record) => (
        <div>
          <div className='text-xs text-slate-300'>总物品: {getTotalItems(record)}</div>
          <div className='text-xs text-slate-300'>装备: {record.装备?.length || 0}</div>
          <div className='text-xs text-slate-300'>丹药: {record.丹药?.length || 0}</div>
          <div className='text-xs text-slate-300'>道具: {record.道具?.length || 0}</div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-yellow-400 font-bold'>
          <span>操作</span>
        </div>
      ),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className='flex gap-2'>
          <Tooltip title='查看详情'>
            <button
              className='p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl'
              onClick={() => {
                setSelectedNajie(record);
                setNajieDetailVisible(true);
              }}
            >
              <EyeOutlined className='text-lg' />
            </button>
          </Tooltip>
          <Tooltip title='编辑背包'>
            <button
              className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl'
              onClick={() => handleEditNajie(record)}
            >
              <EditOutlined className='text-lg' />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<ShoppingOutlined />}
        title='背包管理'
        subtitle='管理修仙界道友的背包物品'
        actions={<XiuxianRefreshButton loading={loading} onClick={() => fetchNajie(1, pagination.pageSize)} />}
      />

      {/* 搜索栏 */}
      <XiuxianSearchBar
        placeholder='搜索用户ID'
        value={searchText}
        onChange={setSearchText}
        onSearch={handleSearchAndFilter}
        onKeyPress={e => e.key === 'Enter' && handleSearchAndFilter()}
        className='mb-6'
      />

      {/* 背包表格 */}
      <XiuxianTableContainer title='背包列表' icon={<ShoppingOutlined />}>
        <XiuxianTableWithPagination
          columns={columns}
          dataSource={najieList}
          rowKey='userId'
          loading={loading}
          rowClassName={record => {
            // 如果是损坏数据，添加黄色背景
            return record.数据状态 === 'corrupted'
              ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400  bg-slate-700 hover:bg-slate-600'
              : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-300 bg-slate-700 hover:bg-slate-600';
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          onPaginationChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </XiuxianTableContainer>

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
        onSave={handleSaveNajie}
        najie={selectedNajie}
        loading={editLoading}
      />
    </XiuxianPageWrapper>
  );
}
