import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, message, Space, Tag, Tooltip, Popconfirm, Row, Col, Card, Statistic, Table, Empty } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  MessageOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getUserMessages, sendMessage, deleteMessage, getMessageStats, cleanExpiredMessages } from '../../api/messages';
import type { MessageListResponse, SendMessageParams, MessageStats } from '../../types/message';

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
    } catch (_error) {
      message.error('获取统计信息失败');
    }
  };

  // 获取用户消息列表
  const fetchMessages = async (userId: string, page = 1, pageSize = 10) => {
    if (!userId) {
      return;
    }

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
    } catch (_error) {
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
  priority: values.priority ?? 2,
        receivers: values.receivers ? values.receivers.split(',').map((id: string) => id.trim()) : [],
        expireTime: values.expireTime ? new Date(values.expireTime).getTime() : undefined
      };

      await sendMessage(data);
      message.success('消息发送成功');
      setModalVisible(false);
      form.resetFields();

      // 刷新统计
      void fetchStats();
    } catch (_error) {
      message.error('发送消息失败');
    }
  };

  // 删除消息
  const handleDeleteMessage = async (userId: string, messageId: string) => {
    try {
      await deleteMessage({ userId, messageId });
      message.success('删除成功');
      void fetchMessages(userId, pagination.current, pagination.pageSize);
    } catch (_error) {
      message.error('删除失败');
    }
  };

  // 清理过期消息
  const handleCleanExpired = async () => {
    try {
      const response = await cleanExpiredMessages();

      message.success(`清理成功，共清理 ${response.data.cleanedCount} 条过期消息`);
      void fetchStats();
    } catch (_error) {
      message.error('清理失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '消息标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (text: string) => <Tooltip title={text}>{text.length > 50 ? `${text.substring(0, 50)}...` : text}</Tooltip>
    },
    {
      title: '消息类型',
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
  const config = typeMap[type] ?? { color: 'default', text: type };

        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '优先级',
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
  const config = priorityMap[priority] ?? { color: 'default', text: '普通' };

        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        const statusMap: Record<number, { color: string; text: string }> = {
          0: { color: 'red', text: '未读' },
          1: { color: 'green', text: '已读' },
          2: { color: 'default', text: '已删除' }
        };
  const config = statusMap[status] ?? { color: 'default', text: '未知' };

        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '发送者',
      dataIndex: 'senderName',
      key: 'senderName',
      width: 120,
  render: (senderName: string) => senderName ?? '系统'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Popconfirm title='确定要删除这条消息吗？' onConfirm={() => { void handleDeleteMessage(currentUserId, record.id); }} okText='确定' cancelText='取消'>
          <Button type='link' size='small' danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      )
    }
  ];

  useEffect(() => {
    void fetchStats();
  }, []);

  return (
    <div className='min-h-screen bg-gray-200 p-4'>
      {/* 页面标题和操作按钮 */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold m-0'>站内信管理</h1>
          <p className='text-sm mt-2 mb-0'>管理修仙界道友的站内信系统</p>
        </div>
        <Space>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            发送消息
          </Button>
          <Button danger icon={<StopOutlined />} onClick={() => { void handleCleanExpired(); }}>
            清理过期
          </Button>
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={() => {
              void fetchStats();
              if (currentUserId) {
                void fetchMessages(currentUserId, pagination.current, pagination.pageSize);
              }
            }}
            loading={loading}
          >
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-md'>
            <Statistic title='总消息数' value={stats?.total ?? 0} prefix={<MessageOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-md'>
            <Statistic title='未读消息' value={stats?.unread ?? 0} prefix={<ExclamationCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-md'>
            <Statistic title='已读消息' value={stats?.read ?? 0} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-md'>
            <Statistic title='已删除消息' value={stats?.deleted ?? 0} prefix={<DeleteOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* 搜索和查看区域 */}
      <Card title='查看用户消息' className='mb-6 shadow-md'>
        <Space.Compact className='w-full'>
          <Input
            placeholder='输入用户ID查看消息...'
            value={currentUserId}
            onChange={e => setCurrentUserId(e.target.value)}
            onPressEnter={() => { void fetchMessages(currentUserId); }}
          />
          <Button type='primary' icon={<EyeOutlined />} onClick={() => { void fetchMessages(currentUserId); }} disabled={!currentUserId}>
            查看消息
          </Button>
        </Space.Compact>
      </Card>

      {/* 消息列表表格 */}
      <Card title='消息列表' className='shadow-md'>
        {!currentUserId ? (
          <Empty description='请先输入用户ID来查看该用户的消息列表' />
        ) : messages?.messages.length === 0 ? (
          <Empty description='该用户目前没有任何消息记录' />
        ) : (
          <Table
            columns={columns}
            dataSource={messages?.messages ?? []}
            rowKey='id'
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              onChange: (page, size) => {
                void fetchMessages(currentUserId, page, size ?? 10);
              }
            }}
          />
        )}
      </Card>

      {/* 发送消息模态框 */}
      <Modal title='发送站内信' open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={600}>
        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => { void handleSendMessage(values); }}
          initialValues={{
            type: 'system',
            priority: 2
          }}
        >
          <Form.Item name='title' label='消息标题' rules={[{ required: true, message: '请输入消息标题' }]}>
            <Input placeholder='请输入消息标题' />
          </Form.Item>

          <Form.Item name='content' label='消息内容' rules={[{ required: true, message: '请输入消息内容' }]}>
            <TextArea rows={4} placeholder='请输入消息内容' />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='type' label='消息类型' rules={[{ required: true, message: '请选择消息类型' }]}>
                <Select placeholder='请选择消息类型'>
                  <Option value='system'>系统消息</Option>
                  <Option value='announcement'>公告</Option>
                  <Option value='reward'>奖励通知</Option>
                  <Option value='activity'>活动通知</Option>
                  <Option value='personal'>个人消息</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='priority' label='优先级' rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder='请选择优先级'>
                  <Option value={1}>低</Option>
                  <Option value={2}>普通</Option>
                  <Option value={3}>高</Option>
                  <Option value={4}>紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='receivers' label='接收者ID' extra='多个用户ID用逗号分隔，留空表示全服发送'>
            <Input placeholder='例如: 123456,789012' />
          </Form.Item>

          <Form.Item name='expireTime' label='过期时间' extra='可选，留空表示永不过期'>
            <Input type='datetime-local' />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' icon={<SendOutlined />}>
                发送
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MessagesPage;
