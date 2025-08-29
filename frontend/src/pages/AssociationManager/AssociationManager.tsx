import React from 'react';
import { Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, TeamOutlined, FireOutlined, CrownOutlined, BankOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Association } from '@/types/types';
import AssociationInfo from './AssociationInfo';
import { useAssociationManagerCode } from './AssociationManager.code';

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianStatCard,
  XiuxianSearchBar,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianTableWithPagination
} from '@/components/ui';

export default function AssociationManager() {
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

  // 表格列定义
  const columns: ColumnsType<Association> = [
    {
      title: (
        <div className='flex items-center gap-2 text-purple-400 font-bold'>
          <span>宗门信息</span>
        </div>
      ),
      key: 'associationInfo',
      width: 280,
      render: (_, record) => (
        <div className='flex items-center space-x-4 p-3 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-xl'>
          <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg'>
            {record.宗门名称?.charAt(0) || '宗'}
          </div>
          <div className='flex-1'>
            <div className='text-white font-semibold text-base mb-1'>{record.宗门名称}</div>
            <div className='text-slate-300 text-sm mb-1'>
              <CrownOutlined className='mr-1 text-purple-400' />
              等级: <span className='text-purple-400 font-medium'>{record.宗门等级}</span>
            </div>
            <div className='text-slate-300 text-sm'>
              <UserOutlined className='mr-1 text-blue-400' />
              宗主: <span className='text-blue-400 font-medium'>{record.宗主}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-blue-400 font-bold'>
          <span>宗门类型</span>
        </div>
      ),
      key: 'type',
      width: 120,
      render: (_, record) => (
        <div className='flex justify-center'>
          <Tag
            color={record.power > 0 ? 'purple' : 'blue'}
            className='px-3 py-1 rounded-full font-medium text-sm border-0 shadow-lg'
            style={{
              background: record.power > 0 ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: 'white'
            }}
          >
            <CrownOutlined className='mr-1' />
            {getAssociationType(record.power)}
          </Tag>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-green-400 font-bold'>
          <span>成员统计</span>
        </div>
      ),
      key: 'members',
      width: 180,
      render: (_, record) => (
        <div className='bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-3'>
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-slate-300 text-sm'>总成员</span>
              <span className='text-white font-bold'>{(record.所有成员?.length || 0).toLocaleString()}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-slate-300 text-sm'>副宗主</span>
              <span className='text-purple-400 font-bold'>{(record.副宗主?.length || 0).toLocaleString()}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-slate-300 text-sm'>长老</span>
              <span className='text-green-400 font-bold'>{(record.长老?.length || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-yellow-400 font-bold'>
          <span>资源信息</span>
        </div>
      ),
      key: 'resources',
      width: 160,
      render: (_, record) => (
        <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-3'>
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-slate-300 text-sm'>灵石池</span>
              <span className='text-green-400 font-bold text-sm'>{(record.灵石池 || 0).toLocaleString()}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-slate-300 text-sm'>大阵血量</span>
              <span className='text-yellow-400 font-bold text-sm'>{(record.大阵血量 || 0).toLocaleString()}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-slate-300 text-sm'>最低境界</span>
              <span className='text-purple-400 font-bold text-sm'>{getLevelName(record.最低加入境界)}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-cyan-400 font-bold'>
          <span>宗门驻地</span>
        </div>
      ),
      key: 'location',
      width: 140,
      render: (_, record) => (
        <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3'>
          <div className='space-y-2'>
            <div className='text-center'>
              <div className='text-slate-300 text-sm mb-1'>驻地</div>
              <div className='text-white font-bold text-sm'>{record.宗门驻地 || '无驻地'}</div>
            </div>
            <div className='text-center'>
              <div className='text-slate-300 text-sm mb-1'>神兽</div>
              <div className='text-pink-400 font-bold text-sm'>{record.宗门神兽 || '无'}</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-purple-400 font-bold'>
          <span>操作</span>
        </div>
      ),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className='flex justify-center'>
          <Tooltip title='查看详情' placement='top'>
            <button
              className='px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-1'
              onClick={() => {
                setSelectedAssociation(record);
                setAssociationDetailVisible(true);
              }}
            >
              <EyeOutlined />
              查看
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
        icon={<TeamOutlined />}
        title='宗门管理'
        subtitle='管理修仙世界的宗门信息'
        actions={<XiuxianRefreshButton loading={loading} onClick={() => fetchAssociations(1, pagination.pageSize)} />}
      />

      {/* 统计卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <XiuxianStatCard
          title='总宗门数'
          value={(stats.total || 0).toLocaleString()}
          icon={<TeamOutlined />}
          gradient='blue'
          subtitle={`仙界: ${stats.xianjieCount || 0} | 凡界: ${stats.fanjieCount || 0}`}
        />
        <XiuxianStatCard
          title='仙界宗门'
          value={(stats.xianjieCount || 0).toLocaleString()}
          icon={<CrownOutlined />}
          gradient='purple'
          subtitle={`占比: ${stats.total ? Math.round((stats.xianjieCount / stats.total) * 100) : 0}%`}
        />
        <XiuxianStatCard
          title='总灵石池'
          value={(stats.totalLingshi || 0).toLocaleString()}
          icon={<BankOutlined />}
          gradient='green'
          subtitle={`平均: ${stats.total ? Math.round(stats.totalLingshi / stats.total) : 0}`}
        />
        <XiuxianStatCard
          title='总成员数'
          value={(stats.totalMembers || 0).toLocaleString()}
          icon={<FireOutlined />}
          gradient='orange'
          subtitle={`平均: ${stats.total ? Math.round(stats.totalMembers / stats.total) : 0}`}
        />
      </div>

      {/* 搜索栏 */}
      <XiuxianSearchBar
        placeholder='搜索宗门名称、宗主或驻地...'
        value={searchText}
        onChange={setSearchText}
        onSearch={handleSearchAndFilter}
        onKeyPress={e => e.key === 'Enter' && handleSearchAndFilter()}
        className='mb-6'
      />

      {/* 宗门表格 */}
      <XiuxianTableContainer title='宗门列表' icon={<TeamOutlined />}>
        <XiuxianTableWithPagination
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
          onPaginationChange={handleTableChange}
          scroll={{ x: 1200 }}
          rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
        />
      </XiuxianTableContainer>

      {/* 宗门详情弹窗 */}
      <AssociationInfo
        associationDetailVisible={associationDetailVisible}
        setAssociationDetailVisible={setAssociationDetailVisible}
        selectedAssociation={selectedAssociation}
        getAssociationType={getAssociationType}
        getLevelName={getLevelName}
      />
    </XiuxianPageWrapper>
  );
}
