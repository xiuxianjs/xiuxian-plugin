import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, message, Popconfirm, Space, Tag, Card, Typography, Statistic, Table, Tabs, List, Empty } from 'antd';
import { StopOutlined, UnlockOutlined, PlusOutlined, DeleteOutlined, ClockCircleOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
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
        message.error(result.message ?? '获取日志失败');
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
        message.success(result.message ?? '清理日志成功');
        void fetchLogs(activeTab as 'mute' | 'unmute');
      } else {
        message.error(result.message ?? '清理日志失败');
      }
    } catch (error) {
      console.error('清理日志错误:', error);
      message.error('清理日志失败');
    }
  };

  // 标签页切换
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    void fetchLogs(tabName as 'mute' | 'unmute');
  };

  // 模态框打开时加载数据
  useEffect(() => {
    if (visible) {
      void fetchLogs(activeTab as 'mute' | 'unmute');
    }
  }, [visible, activeTab]);

  const tabItems = [
    {
      key: 'mute',
      label: (
        <Space align='center'>
          <StopOutlined />
          <span>禁言记录</span>
        </Space>
      ),
      children: (
        <Space direction='vertical' style={{ width: '100%' }} size='middle'>
          <Space align='center' style={{ width: '100%', justifyContent: 'space-between' }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              禁言记录
            </Typography.Title>
            <Popconfirm
              title='确定要清理禁言记录吗？'
              onConfirm={() => {
                void handleClearLogs('mute');
              }}
              okText='确定'
              cancelText='取消'
            >
              <Button danger size='small'>
                清理禁言记录
              </Button>
            </Popconfirm>
          </Space>
          <List
            loading={loading}
            locale={{ emptyText: <Empty description='暂无禁言记录' /> }}
            dataSource={logs}
            renderItem={log => (
              <List.Item>
                <Space direction='vertical' size={2} style={{ width: '100%' }}>
                  <Space align='center' style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space size='middle'>
                      <Typography.Text code>{log.userId}</Typography.Text>
                      {log.reason ? <Tag color='orange'>{log.reason}</Tag> : null}
                      {log.duration ? <Tag color='blue'>{Math.floor((log.duration ?? 0) / 60)}分钟</Tag> : null}
                    </Space>
                    <Typography.Text type='secondary'>{dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
                  </Space>
                  {log.adminId ? <Typography.Text type='secondary'>操作管理员: {log.adminId}</Typography.Text> : null}
                </Space>
              </List.Item>
            )}
          />
        </Space>
      )
    },
    {
      key: 'unmute',
      label: (
        <Space align='center'>
          <CheckCircleOutlined />
          <span>解除记录</span>
        </Space>
      ),
      children: (
        <Space direction='vertical' style={{ width: '100%' }} size='middle'>
          <Space align='center' style={{ width: '100%', justifyContent: 'space-between' }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              解除记录
            </Typography.Title>
            <Popconfirm
              title='确定要清理解除记录吗？'
              onConfirm={() => {
                void handleClearLogs('unmute');
              }}
              okText='确定'
              cancelText='取消'
            >
              <Button danger size='small'>
                清理解除记录
              </Button>
            </Popconfirm>
          </Space>
          <List
            loading={loading}
            locale={{ emptyText: <Empty description='暂无解除记录' /> }}
            dataSource={logs}
            renderItem={log => (
              <List.Item>
                <Space direction='vertical' size={2} style={{ width: '100%' }}>
                  <Space align='center' style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space size='middle'>
                      <Typography.Text code>{log.userId}</Typography.Text>
                      {log.reason ? <Tag color='green'>{log.reason}</Tag> : null}
                    </Space>
                    <Typography.Text type='secondary'>{dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
                  </Space>
                  {log.adminId ? <Typography.Text type='secondary'>操作管理员: {log.adminId}</Typography.Text> : null}
                </Space>
              </List.Item>
            )}
          />
        </Space>
      )
    }
  ];

  return (
    <Modal
      title={
        <Space align='center'>
          <FileTextOutlined />
          <Typography.Text>禁言日志</Typography.Text>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={
        <Space align='center' style={{ width: '100%', justifyContent: 'space-between' }}>
          <Popconfirm
            title='确定要清理所有日志吗？'
            onConfirm={() => {
              void handleClearLogs('all');
            }}
            okText='确定'
            cancelText='取消'
          >
            <Button danger>清理所有日志</Button>
          </Popconfirm>
          <Button onClick={onCancel}>关闭</Button>
        </Space>
      }
      width={900}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
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
        message.error(result.message ?? '获取禁言列表失败');
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
        void fetchMuteList();
      } else {
        message.error(result.message ?? '禁言设置失败');
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
        void fetchMuteList();
      } else {
        message.error(result.message ?? '禁言解除失败');
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
        void fetchMuteList();
      } else {
        message.error(result.message ?? '批量解除禁言失败');
      }
    } catch (error) {
      console.error('批量解除禁言错误:', error);
      message.error('批量解除禁言失败');
    }
  };

  // 搜索过滤
  const filteredMuteList = muteList.filter(item => item.userId.toLowerCase().includes(searchText.toLowerCase()));

  // 分页处理
  // 由 antd Table 内置分页处理，无需手动 slice

  // 表格列定义
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => <Typography.Text code>{userId}</Typography.Text>
    },
    {
      title: '剩余时间',
      dataIndex: 'remainingTime',
      key: 'remainingTime',
      render: (remainingTime: string) => <Typography.Text>{remainingTime}</Typography.Text>
    },
    {
      title: '解除时间',
      dataIndex: 'unlockTime',
      key: 'unlockTime',
      render: (unlockTime: string) => <Typography.Text>{dayjs(unlockTime).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: MuteRecord) => (
        <Space>
          <Popconfirm
            title='确定要解除该用户的禁言吗？'
            onConfirm={() => {
              void handleUnmute(record.userId);
            }}
            okText='确定'
            cancelText='取消'
          >
            <Button type='link' size='small' icon={<UnlockOutlined />}>
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
    void fetchMuteList();
  }, []);

  return (
    <div className='space-y-6 p-4 bg-slate-200'>
      <Card
        title={
          <Space align='center'>
            <StopOutlined />
            <Typography.Text strong>禁言管理</Typography.Text>
          </Space>
        }
        extra={
          <Space>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
              添加禁言
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                void handleBatchUnmute();
              }}
            >
              批量解除 ({selectedRowKeys.length})
            </Button>
            <Button icon={<FileTextOutlined />} onClick={() => setLogsModalVisible(true)}>
              查看日志
            </Button>
            <Button
              type='primary'
              loading={loading}
              onClick={() => {
                void fetchMuteList();
              }}
            >
              刷新
            </Button>
          </Space>
        }
      >
        <Typography.Text type='secondary'>管理系统中的用户禁言状态</Typography.Text>
      </Card>

      {/* 统计卡片：布局使用 Tailwind 仅保留布局类 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <Statistic title='当前禁言用户' value={total} prefix={<StopOutlined />} />
        </Card>
        <Card>
          <Statistic title='即将解除' value={muteList.filter(item => item.ttl <= 3600).length} prefix={<ClockCircleOutlined />} />
        </Card>
        <Card>
          <Statistic title='已选择' value={selectedRowKeys.length} prefix={<UnlockOutlined />} />
        </Card>
      </div>

      {/* 搜索栏 */}
      <Input.Search
        placeholder='搜索用户ID...'
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onSearch={() => {
          /* 客户端过滤，触发重渲染即可 */
        }}
        allowClear
      />

      {/* 表格 */}
      <Card title='禁言列表'>
        {filteredMuteList.length === 0 ? (
          <Empty description='当前没有用户被禁言' />
        ) : (
          <Table
            columns={columns as any}
            dataSource={filteredMuteList}
            rowKey='userId'
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              current,
              pageSize,
              total: filteredMuteList.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (t, range) => `第 ${range[0]}-${range[1]} 条，共 ${t} 条`
            }}
            onChange={p => {
              setCurrent(p.current ?? 1);
              setPageSize(p.pageSize ?? 10);
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {/* 添加禁言模态框 */}
      <Modal
        title={
          <Space align='center'>
            <StopOutlined />
            <Typography.Text>添加禁言</Typography.Text>
          </Space>
        }
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => form.submit()}
        okText='确定'
        cancelText='取消'
        width={500}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={values => {
            void handleAddMute(values);
          }}
        >
          <Form.Item name='userId' label='用户ID' rules={[{ required: true, message: '请输入用户ID' }]}>
            <Input placeholder='请输入用户ID' />
          </Form.Item>

          <Form.Item name='duration' label='禁言时长' rules={[{ required: true, message: '请输入禁言时长' }]}>
            <Input
              placeholder='例如: 30m, 2h, 3600s'
              addonAfter={
                <Select defaultValue='m' style={{ width: 80 }}>
                  <Option value='m'>分钟</Option>
                  <Option value='h'>小时</Option>
                  <Option value='s'>秒</Option>
                </Select>
              }
            />
          </Form.Item>

          <Form.Item name='reason' label='禁言原因'>
            <Input.TextArea placeholder='请输入禁言原因（可选）' rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 日志查看组件 */}
      <LogsViewer visible={logsModalVisible} onCancel={() => setLogsModalVisible(false)} />
    </div>
  );
};

export default MuteManager;
