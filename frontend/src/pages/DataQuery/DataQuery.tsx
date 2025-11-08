import { Input, Select, Button, Card, Table, Row, Col, Space } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDataQueryCode } from './DataQuery.code';
import DataEditModal from './DataEditModal';

const { Option } = Select;
const { Search } = Input;

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
    <div className='min-h-screen bg-gray-200 p-4'>
      {/* 页面标题和操作按钮 */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold m-0'>数据查询</h1>
          <p className='text-sm mt-2 mb-0'>查询和浏览游戏中的各种数据列表</p>
        </div>
        <Space>
          <Button icon={<EditOutlined />} onClick={handleEdit} disabled={!selectedDataType}>
            编辑数据
          </Button>
          <Button icon={<ReloadOutlined spin={loading} />} onClick={handleRefresh} loading={loading}>
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 查询控制区域 */}
      <Card title='查询条件' className='mb-6'>
        <Row gutter={16}>
          <Col span={12}>
            <div className='mb-4'>
              <div className='mb-2'>数据类型</div>
              <Select value={selectedDataType} onChange={handleDataTypeChange} placeholder='请选择数据类型' className='w-full'>
                {dataTypes.map(type => (
                  <Option key={type} value={type}>
                    {getDataTypeDisplayName(type)}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div className='mb-4'>
              <div className='mb-2'>搜索关键词</div>
              <Search placeholder='输入关键词搜索...' value={searchText} onChange={e => handleSearch(e.target.value)} onSearch={handleSearch} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card title={selectedDataType ? getDataTypeDisplayName(selectedDataType) : '数据列表'}>
        <Table
          columns={columns}
          dataSource={dataList}
          rowKey={(_record, index) => index?.toString() ?? '0'}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handleTableChange
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 数据编辑模态框 */}
      <DataEditModal
        visible={editModalVisible}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
        dataType={selectedDataType}
        dataTypeName={selectedDataType ? getDataTypeDisplayName(selectedDataType) : ''}
        originalData={originalData}
      />
    </div>
  );
}
