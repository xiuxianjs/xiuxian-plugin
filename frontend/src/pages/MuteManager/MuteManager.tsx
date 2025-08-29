import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, message, Popconfirm, Space, Tag } from 'antd';
import {
  StopOutlined,
  UnlockOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianSearchBar,
  XiuxianTableWithPagination,
  XiuxianEmptyState,
  XiuxianStatCard,
  XiuxianTabGroup
} from '@/components/ui';

// 导入API接口
import { getMuteListAPI, addMuteAPI, unmuteAPI, batchUnmuteAPI, getMuteLogsAPI, clearMuteLogsAPI, type MuteRecord, type MuteFormValues } from '@/api/auth/mute';

const { Option } = Select;

// 日志查看组件
interface LogsViewerProps {
  visible: boolean;
  onCancel: () => void;
}

const LogsViewer: React.FC<LogsViewerProps> = ({ visible, onCancel }) => {
  const [activeTab, setActiveTab] = useState('mute');
  const [logs, setLogs] = useState<
    Array<{
      userId: string;
      duration?: number;
      reason?: string;
      adminId?: string;
      timestamp: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  // 获取日志
  const fetchLogs = async (type: 'mute' | 'unmute') => {
    setLoading(true);
    try {
      const result = await getMuteLogsAPI(type, 100);

      if (result.success && result.data) {
        setLogs(result.data.list);
      } else {
        message.error(result.message || '获取日志失败');
      }
    } catch (error) {
      console.error('获取日志错误:', error);
      message.error('获取日志失败');
    } finally {
      setLoading(false);
    }
  };

  // 清理日志
  const handleClearLogs = async (type: 'all' | 'mute' | 'unmute') => {
    try {
      const result = await clearMuteLogsAPI(type);

      if (result.success) {
        message.success(result.message || '清理日志成功');
        fetchLogs(activeTab as 'mute' | 'unmute');
      } else {
        message.error(result.message || '清理日志失败');
      }
    } catch (error) {
      console.error('清理日志错误:', error);
      message.error('清理日志失败');
    }
  };

  // 标签页切换
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    fetchLogs(tabName as 'mute' | 'unmute');
  };

  // 模态框打开时加载数据
  useEffect(() => {
    if (visible) {
      fetchLogs(activeTab as 'mute' | 'unmute');
    }
  }, [visible, activeTab]);

  const tabs = [
    {
      name: 'mute',
      icon: <StopOutlined />,
      content: (
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-white'>禁言记录</h3>
            <Popconfirm title='确定要清理禁言记录吗？' onConfirm={() => handleClearLogs('mute')} okText='确定' cancelText='取消'>
              <Button danger size='small'>
                清理禁言记录
              </Button>
            </Popconfirm>
          </div>
          <div className='max-h-96 overflow-y-auto'>
            {loading ? (
              <div className='text-center py-8'>
                <div className='text-slate-400'>加载中...</div>
              </div>
            ) : logs.length === 0 ? (
              <div className='text-center py-8'>
                <div className='text-slate-400'>暂无禁言记录</div>
              </div>
            ) : (
              <div className='space-y-2'>
                {logs.map((log, index) => (
                  <div key={index} className='bg-slate-800/50 border border-slate-700 rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='font-mono text-sm text-white'>{log.userId}</span>
                        {log.reason && (
                          <Tag color='orange' className='text-xs'>
                            {log.reason}
                          </Tag>
                        )}
                        {log.duration && (
                          <Tag color='blue' className='text-xs'>
                            {Math.floor(log.duration / 60)}分钟
                          </Tag>
                        )}
                      </div>
                      <div className='text-slate-400 text-xs'>{dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                    {log.adminId && <div className='text-slate-500 text-xs mt-1'>操作管理员: {log.adminId}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      name: 'unmute',
      icon: <CheckCircleOutlined />,
      content: (
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-white'>解除记录</h3>
            <Popconfirm title='确定要清理解除记录吗？' onConfirm={() => handleClearLogs('unmute')} okText='确定' cancelText='取消'>
              <Button danger size='small'>
                清理解除记录
              </Button>
            </Popconfirm>
          </div>
          <div className='max-h-96 overflow-y-auto'>
            {loading ? (
              <div className='text-center py-8'>
                <div className='text-slate-400'>加载中...</div>
              </div>
            ) : logs.length === 0 ? (
              <div className='text-center py-8'>
                <div className='text-slate-400'>暂无解除记录</div>
              </div>
            ) : (
              <div className='space-y-2'>
                {logs.map((log, index) => (
                  <div key={index} className='bg-slate-800/50 border border-slate-700 rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='font-mono text-sm text-white'>{log.userId}</span>
                        {log.reason && (
                          <Tag color='green' className='text-xs'>
                            {log.reason}
                          </Tag>
                        )}
                      </div>
                      <div className='text-slate-400 text-xs'>{dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                    {log.adminId && <div className='text-slate-500 text-xs mt-1'>操作管理员: {log.adminId}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <FileTextOutlined className='text-blue-400' />
          <span className='text-white'>禁言日志</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={
        <div className='flex justify-between'>
          <Popconfirm title='确定要清理所有日志吗？' onConfirm={() => handleClearLogs('all')} okText='确定' cancelText='取消'>
            <Button danger>清理所有日志</Button>
          </Popconfirm>
          <Button onClick={onCancel}>关闭</Button>
        </div>
      }
      className='xiuxian-modal'
      width={900}
    >
      <XiuxianTabGroup tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} className='mt-4' />
    </Modal>
  );
};

const MuteManager: React.FC = () => {
  const [muteList, setMuteList] = useState<MuteRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [form] = Form.useForm<MuteFormValues>();

  // 获取禁言列表
  const fetchMuteList = async () => {
    setLoading(true);
    try {
      const result = await getMuteListAPI();

      if (result.success && result.data) {
        setMuteList(result.data.list);
        setTotal(result.data.total);
      } else {
        message.error(result.message || '获取禁言列表失败');
      }
    } catch (error) {
      console.error('获取禁言列表错误:', error);
      message.error('获取禁言列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加禁言
  const handleAddMute = async (values: MuteFormValues) => {
    try {
      const result = await addMuteAPI(values);

      if (result.success) {
        message.success('禁言设置成功');
        setAddModalVisible(false);
        form.resetFields();
        fetchMuteList();
      } else {
        message.error(result.message || '禁言设置失败');
      }
    } catch (error) {
      console.error('设置禁言错误:', error);
      message.error('禁言设置失败');
    }
  };

  // 解除禁言
  const handleUnmute = async (userId: string) => {
    try {
      const result = await unmuteAPI(userId);

      if (result.success) {
        message.success('禁言解除成功');
        fetchMuteList();
      } else {
        message.error(result.message || '禁言解除失败');
      }
    } catch (error) {
      console.error('解除禁言错误:', error);
      message.error('禁言解除失败');
    }
  };

  // 批量解除禁言
  const handleBatchUnmute = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要解除禁言的用户');
      return;
    }

    try {
      const result = await batchUnmuteAPI(selectedRowKeys);

      if (result.success && result.data) {
        message.success(`批量解除禁言完成，成功解除 ${result.data.successCount} 个用户`);
        setSelectedRowKeys([]);
        fetchMuteList();
      } else {
        message.error(result.message || '批量解除禁言失败');
      }
    } catch (error) {
      console.error('批量解除禁言错误:', error);
      message.error('批量解除禁言失败');
    }
  };

  // 搜索过滤
  const filteredMuteList = muteList.filter(item => item.userId.toLowerCase().includes(searchText.toLowerCase()));

  // 分页处理
  const paginatedData = filteredMuteList.slice((current - 1) * pageSize, current * pageSize);

  // 表格列定义
  const columns = [
    {
      title: (
        <div className='flex items-center gap-2 text-purple-400 font-bold'>
          <UserOutlined className='text-lg' />
          <span>用户ID</span>
        </div>
      ),
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => <span className='font-mono text-sm text-white bg-slate-700/50 px-2 py-1 rounded'>{userId}</span>
    },
    {
      title: (
        <div className='flex items-center gap-2 text-orange-400 font-bold'>
          <ClockCircleOutlined className='text-lg' />
          <span>剩余时间</span>
        </div>
      ),
      dataIndex: 'remainingTime',
      key: 'remainingTime',
      render: (remainingTime: string, _record: MuteRecord) => (
        <div className='flex items-center gap-2'>
          <span className='text-orange-400 font-medium'>{remainingTime}</span>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-blue-400 font-bold'>
          <span>解除时间</span>
        </div>
      ),
      dataIndex: 'unlockTime',
      key: 'unlockTime',
      render: (unlockTime: string) => <span className='text-slate-300'>{dayjs(unlockTime).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: (
        <div className='flex items-center gap-2 text-green-400 font-bold'>
          <span>操作</span>
        </div>
      ),
      key: 'action',
      render: (_: unknown, record: MuteRecord) => (
        <Space>
          <Popconfirm title='确定要解除该用户的禁言吗？' onConfirm={() => handleUnmute(record.userId)} okText='确定' cancelText='取消'>
            <Button type='text' size='small' icon={<UnlockOutlined />} className='text-green-400 hover:text-green-300 hover:bg-green-400/10'>
              解除禁言
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    }
  };

  useEffect(() => {
    fetchMuteList();
  }, []);

  return (
    <XiuxianPageWrapper>
      <XiuxianPageTitle
        icon='🔇'
        title='禁言管理'
        subtitle='管理系统中的用户禁言状态'
        actions={
          <div className='flex gap-2'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
              className='bg-gradient-to-r from-red-500 to-pink-500 border-0 hover:from-red-600 hover:to-pink-600'
            >
              添加禁言
            </Button>
            <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={handleBatchUnmute}>
              批量解除 ({selectedRowKeys.length})
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => setLogsModalVisible(true)}
              className='bg-gradient-to-r from-blue-500 to-cyan-500 border-0 hover:from-blue-600 hover:to-cyan-600'
            >
              查看日志
            </Button>
            <XiuxianRefreshButton loading={loading} onClick={fetchMuteList} />
          </div>
        }
      />

      <div className='space-y-6'>
        {/* 统计卡片 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <XiuxianStatCard title='当前禁言用户' value={total} icon={<StopOutlined />} gradient='red' />
          <XiuxianStatCard title='即将解除' value={muteList.filter(item => item.ttl <= 3600).length} icon={<ClockCircleOutlined />} gradient='orange' />
          <XiuxianStatCard title='已选择' value={selectedRowKeys.length} icon={<UnlockOutlined />} gradient='green' />
        </div>

        {/* 搜索栏 */}
        <XiuxianSearchBar placeholder='搜索用户ID...' value={searchText} onChange={setSearchText} onSearch={() => {}} />

        {/* 表格 */}
        <XiuxianTableContainer title='禁言列表'>
          {filteredMuteList.length === 0 ? (
            <XiuxianEmptyState icon='🔇' title='暂无禁言记录' description='当前没有用户被禁言' />
          ) : (
            <XiuxianTableWithPagination
              columns={columns}
              dataSource={paginatedData}
              rowKey='userId'
              loading={loading}
              rowSelection={rowSelection}
              pagination={{
                current,
                pageSize,
                total: filteredMuteList.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              onPaginationChange={(page, size) => {
                setCurrent(page);
                setPageSize(size || 10);
              }}
            />
          )}
        </XiuxianTableContainer>
      </div>

      {/* 添加禁言模态框 */}
      <Modal
        title={
          <div className='flex items-center gap-2'>
            <StopOutlined className='text-red-400' />
            <span className='text-white'>添加禁言</span>
          </div>
        }
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => form.submit()}
        okText='确定'
        cancelText='取消'
        className='xiuxian-modal'
        width={500}
      >
        <Form form={form} layout='vertical' onFinish={handleAddMute} className='mt-4'>
          <Form.Item name='userId' label={<span className='text-slate-300'>用户ID</span>} rules={[{ required: true, message: '请输入用户ID' }]}>
            <Input placeholder='请输入用户ID' className='xiuxian-input' />
          </Form.Item>

          <Form.Item name='duration' label={<span className='text-slate-300'>禁言时长</span>} rules={[{ required: true, message: '请输入禁言时长' }]}>
            <Input
              placeholder='例如: 30m, 2h, 3600s'
              className='xiuxian-input'
              addonAfter={
                <Select defaultValue='m' className='w-20'>
                  <Option value='m'>分钟</Option>
                  <Option value='h'>小时</Option>
                  <Option value='s'>秒</Option>
                </Select>
              }
            />
          </Form.Item>

          <Form.Item name='reason' label={<span className='text-slate-300'>禁言原因</span>}>
            <Input.TextArea placeholder='请输入禁言原因（可选）' rows={3} className='xiuxian-input' />
          </Form.Item>
        </Form>
      </Modal>

      {/* 日志查看组件 */}
      <LogsViewer visible={logsModalVisible} onCancel={() => setLogsModalVisible(false)} />
    </XiuxianPageWrapper>
  );
};

export default MuteManager;
