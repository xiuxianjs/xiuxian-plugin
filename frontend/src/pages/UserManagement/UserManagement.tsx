import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, Row, Col } from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { AdminUser, UserFormData, UserRole, ROLE_INFO } from '@/types/permissions';
import { getUsersAPI, createUserAPI, updateUserAPI, deleteUserAPI, resetUserPasswordAPI, updateUserStatusAPI, batchUserOperationAPI } from '@/api/auth/users';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Permission } from '@/types/permissions';

// 导入UI组件库
import {
  XiuxianPageWrapper,
  XiuxianPageTitle,
  XiuxianTableContainer,
  XiuxianRefreshButton,
  XiuxianSearchBar,
  XiuxianTableWithPagination,
  XiuxianStatCard
} from '@/components/ui';

const { Option } = Select;

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取用户列表
  const fetchUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await getUsersAPI({
        page,
        pageSize,
        search: searchText,
        role: selectedRole || undefined,
        status: (selectedStatus as any) || undefined
      });

      if (result.success && result.data) {
        setUsers(result.data.users);
        setPagination({
          current: result.data.page,
          pageSize: result.data.pageSize,
          total: result.data.total
        });
      } else {
        message.error(result.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建/更新用户
  const handleSaveUser = async (values: UserFormData) => {
    try {
      let result;

      if (editingUser) {
        result = await updateUserAPI(editingUser.id, values);
      } else {
        result = await createUserAPI(values);
      }

      if (result.success) {
        message.success(editingUser ? '用户更新成功' : '用户创建成功');
        setModalVisible(false);
        form.resetFields();
        setEditingUser(null);
        void fetchUsers(pagination.current, pagination.pageSize);
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      console.error('保存用户失败:', error);
      message.error('保存用户失败');
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteUserAPI(userId);

      if (result.success) {
        message.success('用户删除成功');
        fetchUsers(pagination.current, pagination.pageSize);
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败');
    }
  };

  // 重置密码
  const handleResetPassword = async (userId: string) => {
    try {
      const result = await resetUserPasswordAPI(userId);

      if (result.success && result.data) {
        message.success(`密码重置成功，新密码：${result.data.newPassword}`);
      } else {
        message.error(result.message || '密码重置失败');
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error('重置密码失败');
    }
  };

  // 更新用户状态
  const handleUpdateStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const result = await updateUserStatusAPI(userId, status);

      if (result.success) {
        message.success('状态更新成功');
        void fetchUsers(pagination.current, pagination.pageSize);
      } else {
        message.error(result.message || '状态更新失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      message.error('更新状态失败');
    }
  };

  // 批量操作
  const handleBatchOperation = async (operation: 'activate' | 'deactivate' | 'suspend' | 'delete') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要操作的用户');

      return;
    }

    try {
      const result = await batchUserOperationAPI({
        userIds: selectedRowKeys,
        operation
      });

      if (result.success && result.data) {
        message.success(`批量操作完成，成功 ${result.data.successCount} 个，失败 ${result.data.failedCount} 个`);
        setSelectedRowKeys([]);
        void fetchUsers(pagination.current, pagination.pageSize);
      } else {
        message.error(result.message || '批量操作失败');
      }
    } catch (error) {
      console.error('批量操作失败:', error);
      message.error('批量操作失败');
    }
  };

  // 打开编辑模态框
  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      realName: user.realName,
      department: user.department,
      phone: user.phone
    });
    setModalVisible(true);
  };

  // 打开创建模态框
  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      active: { color: 'green', text: '正常' },
      inactive: { color: 'orange', text: '未激活' },
      suspended: { color: 'red', text: '已暂停' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };

    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<AdminUser> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_, record) => (
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold'>
            {record.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className='font-medium text-white'>{record.username}</div>
            <div className='text-sm text-slate-400'>{record.realName || '未设置'}</div>
          </div>
        </div>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: UserRole) => {
        const roleInfo = ROLE_INFO[role];

        return (
          <Tag color={roleInfo.color} icon={<span>{roleInfo.icon}</span>}>
            {roleInfo.name}
          </Tag>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (department: string) => department || '未设置'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (timestamp: number) => new Date(timestamp).toLocaleString('zh-CN')
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 150,
      render: (timestamp: number) => (timestamp ? new Date(timestamp).toLocaleString('zh-CN') : '从未登录')
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <PermissionGuard permission={Permission.USER_UPDATE}>
            <Button type='text' size='small' icon={<EditOutlined />} onClick={() => handleEditUser(record)} className='text-blue-400 hover:text-blue-300'>
              编辑
            </Button>
          </PermissionGuard>

          <PermissionGuard permission={Permission.USER_UPDATE}>
            <Button
              type='text'
              size='small'
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record.id)}
              className='text-orange-400 hover:text-orange-300'
            >
              重置密码
            </Button>
          </PermissionGuard>

          <PermissionGuard permission={Permission.USER_UPDATE}>
            <Button
              type='text'
              size='small'
              icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleUpdateStatus(record.id, record.status === 'active' ? 'suspended' : 'active')}
              className={record.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}
            >
              {record.status === 'active' ? '暂停' : '激活'}
            </Button>
          </PermissionGuard>

          <PermissionGuard permission={Permission.USER_DELETE}>
            <Popconfirm title='确定要删除这个用户吗？' onConfirm={() => handleDeleteUser(record.id)} okText='确定' cancelText='取消'>
              <Button type='text' size='small' icon={<DeleteOutlined />} className='text-red-400 hover:text-red-300'>
                删除
              </Button>
            </Popconfirm>
          </PermissionGuard>
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

  // 搜索和过滤
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers(1, pagination.pageSize);
  };

  // 分页处理
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
    fetchUsers(page, pageSize);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 统计信息
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<UserOutlined />}
        title='账户管理'
        subtitle='管理系统用户账户和权限'
        actions={
          <div className='flex gap-2'>
            <PermissionGuard permission={Permission.USER_CREATE}>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
                className='bg-gradient-to-r from-green-500 to-emerald-500 border-0 hover:from-green-600 hover:to-emerald-600'
              >
                创建用户
              </Button>
            </PermissionGuard>

            <PermissionGuard permission={Permission.USER_UPDATE}>
              <Button danger icon={<CheckCircleOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleBatchOperation('activate')}>
                批量激活 ({selectedRowKeys.length})
              </Button>
            </PermissionGuard>

            <PermissionGuard permission={Permission.USER_UPDATE}>
              <Button danger icon={<StopOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleBatchOperation('suspend')}>
                批量暂停 ({selectedRowKeys.length})
              </Button>
            </PermissionGuard>

            <XiuxianRefreshButton loading={loading} onClick={() => fetchUsers(pagination.current, pagination.pageSize)} />
          </div>
        }
      />

      {/* 搜索和过滤 */}

      <div className='flex flex-col gap-2'>
        <XiuxianSearchBar placeholder='搜索用户名或真实姓名...' value={searchText} onChange={setSearchText} onSearch={handleSearch} className='mb-0' />
        <div className='flex flex-col gap-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6'>
          <div className='flex gap-4 justify-end'>
            <Select placeholder='选择角色' value={selectedRole} onChange={setSelectedRole} className='w-40' allowClear>
              {Object.values(ROLE_INFO).map(role => (
                <Option key={role.role} value={role.role}>
                  {role.icon} {role.name}
                </Option>
              ))}
            </Select>
            <Select placeholder='选择状态' value={selectedStatus} onChange={setSelectedStatus} className='w-32' allowClear>
              <Option value='active'>正常</Option>
              <Option value='inactive'>未激活</Option>
              <Option value='suspended'>已暂停</Option>
            </Select>
            <Button type='primary' onClick={handleSearch}>
              搜索
            </Button>
          </div>
        </div>
      </div>

      {/* 用户表格 */}
      <XiuxianTableContainer title='用户列表' icon={<UserOutlined />}>
        <XiuxianTableWithPagination
          columns={columns}
          dataSource={users}
          rowKey='id'
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          onPaginationChange={handleTableChange}
          rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
        />
      </XiuxianTableContainer>

      {/* 创建/编辑用户模态框 */}
      <Modal
        title={
          <div className='flex items-center gap-2'>
            <UserOutlined className='text-purple-400' />
            <span className='text-white'>{editingUser ? '编辑用户' : '创建用户'}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
        className='xiuxian-modal'
      >
        <Form form={form} layout='vertical' onFinish={handleSaveUser} className='mt-4'>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='username' label={<span className='text-slate-300'>用户名</span>} rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder='请输入用户名' className='xiuxian-input' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='email' label={<span className='text-slate-300'>邮箱</span>} rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}>
                <Input placeholder='请输入邮箱' className='xiuxian-input' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='role' label={<span className='text-slate-300'>角色</span>} rules={[{ required: true, message: '请选择角色' }]}>
                <Select placeholder='请选择角色' className='xiuxian-select'>
                  {Object.values(ROLE_INFO)
                    .filter(role => role.role !== 'super_admin')
                    .map(role => (
                      <Option key={role.role} value={role.role}>
                        {role.icon} {role.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='status' label={<span className='text-slate-300'>状态</span>} rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder='请选择状态' className='xiuxian-select'>
                  <Option value='active'>正常</Option>
                  <Option value='inactive'>未激活</Option>
                  <Option value='suspended'>已暂停</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='realName' label={<span className='text-slate-300'>真实姓名</span>}>
                <Input placeholder='请输入真实姓名' className='xiuxian-input' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='department' label={<span className='text-slate-300'>部门</span>}>
                <Input placeholder='请输入部门' className='xiuxian-input' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='phone' label={<span className='text-slate-300'>电话</span>}>
            <Input placeholder='请输入电话' className='xiuxian-input' />
          </Form.Item>

          {!editingUser && (
            <Form.Item name='password' label={<span className='text-slate-300'>密码</span>} rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password placeholder='请输入密码' className='xiuxian-input' />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </XiuxianPageWrapper>
  );
}
