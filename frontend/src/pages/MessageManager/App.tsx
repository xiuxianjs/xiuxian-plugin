import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getUserMessages,
  sendMessage,
  deleteMessage,
  getMessageStats,
  cleanExpiredMessages
} from '../../api/messages';
import type { MessageListResponse, SendMessageParams, MessageStats } from '../../types/message';

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianStatCard,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianTableWithPagination,
  XiuxianEmptyState
} from '@/components/ui';

const { TextArea } = Input;
const { Option } = Select;

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<MessageListResponse | null>(null);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentUserId, setCurrentUserId] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取消息统计
  const fetchStats = async () => {
    try {
      const response = await getMessageStats({ global: true });
      setStats(response.data);
    } catch (error) {
      message.error('获取统计信息失败');
    }
  };

  // 获取用户消息列表
  const fetchMessages = async (userId: string, page = 1, pageSize = 10) => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await getUserMessages({
        userId,
        page,
        pageSize
      });
      setMessages(response.data);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total
      });
    } catch (error) {
      message.error('获取消息列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 发送消息
  const handleSendMessage = async (values: any) => {
    try {
      const data: SendMessageParams = {
        title: values.title,
        content: values.content,
        type: values.type,
        priority: values.priority || 2,
        receivers: values.receivers
          ? values.receivers.split(',').map((id: string) => id.trim())
          : [],
        expireTime: values.expireTime ? new Date(values.expireTime).getTime() : undefined
      };

      await sendMessage(data);
      message.success('消息发送成功');
      setModalVisible(false);
      form.resetFields();

      // 刷新统计
      fetchStats();
    } catch (error) {
      message.error('发送消息失败');
    }
  };

  // 删除消息
  const handleDeleteMessage = async (userId: string, messageId: string) => {
    try {
      await deleteMessage({ userId, messageId });
      message.success('删除成功');
      fetchMessages(userId, pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 清理过期消息
  const handleCleanExpired = async () => {
    try {
      const response = await cleanExpiredMessages();
      message.success(`清理成功，共清理 ${response.data.cleanedCount} 条过期消息`);
      fetchStats();
    } catch (error) {
      message.error('清理失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: (
        <div className='flex items-center gap-2 text-purple-400 font-bold'>
          <MessageOutlined className='text-lg' />
          <span>消息标题</span>
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string) => <span className='text-white font-medium'>{title}</span>
    },
    {
      title: (
        <div className='flex items-center gap-2 text-blue-400 font-bold'>
          <span>消息内容</span>
        </div>
      ),
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className='text-slate-300'>
            {text.length > 50 ? `${text.substring(0, 50)}...` : text}
          </span>
        </Tooltip>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-orange-400 font-bold'>
          <span>消息类型</span>
        </div>
      ),
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          system: { color: 'blue', text: '系统消息' },
          announcement: { color: 'red', text: '公告' },
          reward: { color: 'green', text: '奖励通知' },
          activity: { color: 'orange', text: '活动通知' },
          personal: { color: 'purple', text: '个人消息' }
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: (
        <div className='flex items-center gap-2 text-yellow-400 font-bold'>
          <ExclamationCircleOutlined className='text-lg' />
          <span>优先级</span>
        </div>
      ),
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: number) => {
        const priorityMap: Record<number, { color: string; text: string }> = {
          1: { color: 'default', text: '低' },
          2: { color: 'blue', text: '普通' },
          3: { color: 'orange', text: '高' },
          4: { color: 'red', text: '紧急' }
        };
        const config = priorityMap[priority] || { color: 'default', text: '普通' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: (
        <div className='flex items-center gap-2 text-green-400 font-bold'>
          <CheckCircleOutlined className='text-lg' />
          <span>状态</span>
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        const statusMap: Record<number, { color: string; text: string }> = {
          0: { color: 'red', text: '未读' },
          1: { color: 'green', text: '已读' },
          2: { color: 'default', text: '已删除' }
        };
        const config = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: (
        <div className='flex items-center gap-2 text-cyan-400 font-bold'>
          <UserOutlined className='text-lg' />
          <span>发送者</span>
        </div>
      ),
      dataIndex: 'senderName',
      key: 'senderName',
      width: 120,
      render: (senderName: string) => <span className='text-slate-300'>{senderName || '系统'}</span>
    },
    {
      title: (
        <div className='flex items-center gap-2 text-pink-400 font-bold'>
          <ClockCircleOutlined className='text-lg' />
          <span>创建时间</span>
        </div>
      ),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time: number) => (
        <span className='text-slate-400 text-sm'>{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-red-400 font-bold'>
          <span>操作</span>
        </div>
      ),
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title='确定要删除这条消息吗？'
            onConfirm={() => handleDeleteMessage(currentUserId, record.id)}
            okText='确定'
            cancelText='取消'
          >
            <Button
              type='text'
              size='small'
              icon={<DeleteOutlined />}
              className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<MessageOutlined />}
        title='站内信管理'
        subtitle='管理修仙界道友的站内信系统'
        actions={
          <div className='flex gap-2'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              className='bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600'
            >
              发送消息
            </Button>
            <Button
              danger
              icon={<StopOutlined />}
              onClick={handleCleanExpired}
              className='hover:bg-red-600'
            >
              清理过期
            </Button>
            <XiuxianRefreshButton
              loading={loading}
              onClick={() => {
                fetchStats();
                if (currentUserId) {
                  fetchMessages(currentUserId, pagination.current, pagination.pageSize);
                }
              }}
            />
          </div>
        }
      />

      <div className='space-y-6'>
        {/* 统计卡片 */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <XiuxianStatCard
            title='总消息数'
            value={(stats?.total || 0).toLocaleString()}
            icon={<MessageOutlined />}
            gradient='blue'
          />
          <XiuxianStatCard
            title='未读消息'
            value={(stats?.unread || 0).toLocaleString()}
            icon={<ExclamationCircleOutlined />}
            gradient='red'
          />
          <XiuxianStatCard
            title='已读消息'
            value={(stats?.read || 0).toLocaleString()}
            icon={<CheckCircleOutlined />}
            gradient='green'
          />
          <XiuxianStatCard
            title='已删除消息'
            value={(stats?.deleted || 0).toLocaleString()}
            icon={<DeleteOutlined />}
            gradient='purple'
          />
        </div>

        {/* 搜索和查看区域 */}
        <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg'>
          <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
            <EyeOutlined className='text-blue-400' />
            查看用户消息
          </h3>
          <div className='flex gap-4 items-center'>
            <Input
              placeholder='输入用户ID查看消息...'
              value={currentUserId}
              onChange={e => setCurrentUserId(e.target.value)}
              className='xiuxian-input flex-1'
              onPressEnter={() => fetchMessages(currentUserId)}
            />
            <Button
              type='primary'
              icon={<EyeOutlined />}
              onClick={() => fetchMessages(currentUserId)}
              disabled={!currentUserId}
              className='bg-gradient-to-r from-blue-500 to-cyan-500 border-0 hover:from-blue-600 hover:to-cyan-600'
            >
              查看消息
            </Button>
          </div>
        </div>

        {/* 消息列表表格 */}
        <XiuxianTableContainer title='消息列表' icon={<MessageOutlined />}>
          {!currentUserId ? (
            <XiuxianEmptyState
              icon='📝'
              title='请先输入用户ID'
              description='在上方输入框中输入用户ID来查看该用户的消息列表'
            />
          ) : messages?.messages.length === 0 ? (
            <XiuxianEmptyState
              icon='📭'
              title='暂无消息'
              description='该用户目前没有任何消息记录'
            />
          ) : (
            <XiuxianTableWithPagination
              columns={columns}
              dataSource={messages?.messages || []}
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
              onPaginationChange={(page, size) => {
                fetchMessages(currentUserId, page, size || 10);
              }}
              rowClassName={() =>
                'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-300 bg-slate-700 hover:bg-slate-600'
              }
            />
          )}
        </XiuxianTableContainer>
      </div>

      {/* 发送消息模态框 */}
      <Modal
        title={
          <div className='flex items-center gap-2'>
            <SendOutlined className='text-purple-400' />
            <span className='text-white'>发送站内信</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        className='xiuxian-modal'
        width={600}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSendMessage}
          initialValues={{
            type: 'system',
            priority: 2
          }}
          className='mt-4'
        >
          <Form.Item
            name='title'
            label={<span className='text-slate-300'>消息标题</span>}
            rules={[{ required: true, message: '请输入消息标题' }]}
          >
            <Input placeholder='请输入消息标题' className='xiuxian-input' />
          </Form.Item>

          <Form.Item
            name='content'
            label={<span className='text-slate-300'>消息内容</span>}
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <TextArea rows={4} placeholder='请输入消息内容' className='xiuxian-input' />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='type'
                label={<span className='text-slate-300'>消息类型</span>}
                rules={[{ required: true, message: '请选择消息类型' }]}
              >
                <Select placeholder='请选择消息类型' className='xiuxian-select'>
                  <Option value='system'>系统消息</Option>
                  <Option value='announcement'>公告</Option>
                  <Option value='reward'>奖励通知</Option>
                  <Option value='activity'>活动通知</Option>
                  <Option value='personal'>个人消息</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='priority'
                label={<span className='text-slate-300'>优先级</span>}
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder='请选择优先级' className='xiuxian-select'>
                  <Option value={1}>低</Option>
                  <Option value={2}>普通</Option>
                  <Option value={3}>高</Option>
                  <Option value={4}>紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name='receivers'
            label={<span className='text-slate-300'>接收者ID</span>}
            extra={<span className='text-slate-500'>多个用户ID用逗号分隔，留空表示全服发送</span>}
          >
            <Input placeholder='例如: 123456,789012' className='xiuxian-input' />
          </Form.Item>

          <Form.Item
            name='expireTime'
            label={<span className='text-slate-300'>过期时间</span>}
            extra={<span className='text-slate-500'>可选，留空表示永不过期</span>}
          >
            <Input type='datetime-local' className='xiuxian-input' />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type='primary'
                htmlType='submit'
                icon={<SendOutlined />}
                className='bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600'
              >
                发送
              </Button>
              <Button
                onClick={() => setModalVisible(false)}
                className='bg-slate-700 hover:bg-slate-600 border-slate-600'
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </XiuxianPageWrapper>
  );
};

export default MessagesPage;
