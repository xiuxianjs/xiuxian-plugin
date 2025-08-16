import React from 'react'
import { Table, Tag, Tooltip, Card, Input, Col, Statistic, Row } from 'antd'
import {
  EyeOutlined,
  TeamOutlined,
  FireOutlined,
  CrownOutlined,
  ReloadOutlined,
  SearchOutlined,
  BankOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Association } from '@/types'
import AssociationInfo from './modals/AssociationInfo'
import { useAssociationManagerCode } from './AssociationManager.code'

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
  } = useAssociationManagerCode()
  // 表格列定义
  const columns: ColumnsType<Association> = [
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>宗门信息</span>
        </div>
      ),
      key: 'associationInfo',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-4 p-3 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {record.宗门名称?.charAt(0) || '宗'}
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-base mb-1">
              {record.宗门名称}
            </div>
            <div className="text-slate-300 text-sm mb-1">
              <CrownOutlined className="mr-1" />
              等级: {record.宗门等级}
            </div>
            <div className="text-slate-300 text-sm">
              <UserOutlined className="mr-1" />
              宗主: {record.宗主}
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <span>宗门类型</span>
        </div>
      ),
      key: 'type',
      width: 120,
      render: (_, record) => (
        <div className="flex justify-center">
          <Tag
            color={record.power > 0 ? 'purple' : 'blue'}
            className="px-3 py-1 rounded-full font-medium text-sm border-0 shadow-lg"
            style={{
              background:
                record.power > 0
                  ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                  : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: 'white'
            }}
          >
            <CrownOutlined className="mr-1" />
            {getAssociationType(record.power)}
          </Tag>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-green-400 font-bold">
          <span>成员统计</span>
        </div>
      ),
      key: 'members',
      width: 180,
      render: (_, record) => (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">总成员</span>
              <span className="text-white font-semibold">
                {record.所有成员?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">副宗主</span>
              <span className="text-purple-400 font-semibold">
                {record.副宗主?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">长老</span>
              <span className="text-green-400 font-semibold">
                {record.长老?.length || 0}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <span>资源信息</span>
        </div>
      ),
      key: 'resources',
      width: 160,
      render: (_, record) => (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">灵石池</span>
              <span className="text-green-400 font-semibold text-sm">
                {(record.灵石池 || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">大阵血量</span>
              <span className="text-yellow-400 font-semibold text-sm">
                {(record.大阵血量 || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">最低境界</span>
              <span className="text-purple-400 font-semibold text-sm">
                {getLevelName(record.最低加入境界)}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <span>宗门驻地</span>
        </div>
      ),
      key: 'location',
      width: 140,
      render: (_, record) => (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3">
          <div className="space-y-2">
            <div className="text-center">
              <div className="text-slate-300 text-sm mb-1">驻地</div>
              <div className="text-white font-semibold text-sm">
                {record.宗门驻地 || '无驻地'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-300 text-sm mb-1">神兽</div>
              <div className="text-pink-400 font-semibold text-sm">
                {record.宗门神兽 || '无'}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>操作</span>
        </div>
      ),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex justify-center">
          <Tooltip title="查看详情" placement="top">
            <button
              className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-1"
              onClick={() => {
                setSelectedAssociation(record)
                setAssociationDetailVisible(true)
              }}
            >
              <EyeOutlined />
              查看
            </button>
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10  p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和操作按钮 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <TeamOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                宗门管理
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                管理修仙世界的宗门信息
              </p>
            </div>
          </div>
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            onClick={() => fetchAssociations(1, pagination.pageSize)}
            disabled={loading}
          >
            <ReloadOutlined className={loading ? 'animate-spin' : ''} />
            {loading ? '刷新中...' : '刷新数据'}
          </button>
        </div>
        {/* 统计信息 */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Statistic
                title={<span className="text-slate-300">总宗门数</span>}
                value={stats.total || 0}
                valueStyle={{
                  color: '#60a5fa',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
                prefix={<TeamOutlined className="text-blue-400" />}
                suffix={
                  <div className="text-slate-400 text-sm">
                    <div>仙界: {stats.xianjieCount || 0}</div>
                    <div>凡界: {stats.fanjieCount || 0}</div>
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Statistic
                title={<span className="text-slate-300">仙界宗门</span>}
                value={stats.xianjieCount || 0}
                valueStyle={{
                  color: '#a855f7',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
                prefix={<CrownOutlined className="text-purple-400" />}
                suffix={
                  <div className="text-slate-400 text-sm">
                    <div>
                      占比:{' '}
                      {stats.total
                        ? Math.round((stats.xianjieCount / stats.total) * 100)
                        : 0}
                      %
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Statistic
                title={<span className="text-slate-300">总灵石池</span>}
                value={stats.totalLingshi || 0}
                valueStyle={{
                  color: '#10b981',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
                prefix={<BankOutlined className="text-green-400" />}
                suffix={
                  <div className="text-slate-400 text-sm">
                    <div>
                      平均:{' '}
                      {stats.total
                        ? Math.round(stats.totalLingshi / stats.total)
                        : 0}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Statistic
                title={<span className="text-slate-300">总成员数</span>}
                value={stats.totalMembers || 0}
                valueStyle={{
                  color: '#f97316',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
                prefix={<FireOutlined className="text-orange-400" />}
                suffix={
                  <div className="text-slate-400 text-sm">
                    <div>
                      平均:{' '}
                      {stats.total
                        ? Math.round(stats.totalMembers / stats.total)
                        : 0}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索栏 */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
              <Input
                size="large"
                placeholder="搜索宗门名称、宗主或驻地..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onPressEnter={handleSearchAndFilter}
                className=" focus:bg-slate-500 hover:bg-slate-600 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 rounded-xl pl-12 h-12 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={handleSearchAndFilter}
            >
              <SearchOutlined />
              搜索
            </button>
          </div>
        </Card>
        {/* 宗门表格 */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={associations}
            rowKey="name"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              onChange: handleTableChange,
              className: 'p-6'
            }}
            scroll={{ x: 1200 }}
            rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
            className="bg-transparent xiuxian-table"
          />
        </Card>

        {/* 宗门详情弹窗 */}
        <AssociationInfo
          associationDetailVisible={associationDetailVisible}
          setAssociationDetailVisible={setAssociationDetailVisible}
          selectedAssociation={selectedAssociation}
          getAssociationType={getAssociationType}
          getLevelName={getLevelName}
        />
      </div>
    </div>
  )
}
