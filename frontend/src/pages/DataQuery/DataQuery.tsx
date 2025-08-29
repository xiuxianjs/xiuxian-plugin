import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { useDataQueryCode } from './DataQuery.code';
import DataEditModal from './DataEditModal';

const { Option } = Select;
const { Search } = Input;

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianTableWithPagination,
  XiuxianSearchBar
} from '@/components/ui';

export default function DataQuery() {
  const {
    dataTypes,
    selectedDataType,
    dataList,
    loading,
    searchText,
    pagination,
    columns,
    editModalVisible,
    originalData,
    handleDataTypeChange,
    handleSearch,
    handleTableChange,
    handleRefresh,
    handleEdit,
    handleEditSuccess,
    handleEditCancel,
    getDataTypeDisplayName
  } = useDataQueryCode();

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<SearchOutlined />}
        title='数据查询'
        subtitle='查询和浏览游戏中的各种数据列表'
        actions={
          <div className='flex gap-2'>
            <button
              className='px-2 py-1 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2'
              onClick={handleEdit}
              disabled={!selectedDataType}
            >
              <EditOutlined />
              编辑数据
            </button>
            <XiuxianRefreshButton loading={loading} onClick={handleRefresh} />
          </div>
        }
      />

      {/* 查询控制区域 */}
      <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6'>
        <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
          <SearchOutlined className='text-purple-400' />
          查询条件
        </h3>
        <div className='flex flex-col md:flex-row gap-4 items-center'>
          <div className='flex-1 min-w-0'>
            <label className='block text-slate-300 text-sm font-medium mb-2'>数据类型</label>
            <Select value={selectedDataType} onChange={handleDataTypeChange} placeholder='请选择数据类型' className='w-full xiuxian-select' size='large'>
              {dataTypes.map(type => (
                <Option key={type} value={type}>
                  {getDataTypeDisplayName(type)}
                </Option>
              ))}
            </Select>
          </div>
          <div className='flex-1 min-w-0'>
            <label className='block text-slate-300 text-sm font-medium mb-2'>搜索关键词</label>
            <Search
              placeholder='输入关键词搜索...'
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              onSearch={handleSearch}
              size='large'
              className='w-full xiuxian-input'
            />
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <XiuxianTableContainer title={selectedDataType ? getDataTypeDisplayName(selectedDataType) : '数据列表'} icon={<SearchOutlined />}>
        <XiuxianTableWithPagination
          columns={columns}
          dataSource={dataList}
          rowKey={(record, index) => index?.toString() || '0'}
          loading={loading}
          rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
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

      {/* 数据编辑模态框 */}
      <DataEditModal
        visible={editModalVisible}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
        dataType={selectedDataType}
        dataTypeName={selectedDataType ? getDataTypeDisplayName(selectedDataType) : ''}
        originalData={originalData}
      />
    </XiuxianPageWrapper>
  );
}
