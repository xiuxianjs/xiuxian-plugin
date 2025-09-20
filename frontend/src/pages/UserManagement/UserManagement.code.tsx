import { useState } from 'react';
import { message } from 'antd';
import { AdminUser, UserFormData, UserRole } from '@/types/permissions';
import { getUsersAPI, createUserAPI, updateUserAPI, deleteUserAPI, resetUserPasswordAPI, updateUserStatusAPI, batchUserOperationAPI } from '@/api/auth/users';

export const useUserManagementCode = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
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
        setEditingUser(null);
        void fetchUsers(pagination.current, pagination.pageSize);

        return true;
      } else {
        message.error(result.message || '操作失败');

        return false;
      }
    } catch (error) {
      console.error('保存用户失败:', error);
      message.error('保存用户失败');

      return false;
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteUserAPI(userId);

      if (result.success) {
        message.success('用户删除成功');
        void fetchUsers(pagination.current, pagination.pageSize);

        return true;
      } else {
        message.error(result.message || '删除失败');

        return false;
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败');

      return false;
    }
  };

  // 重置密码
  const handleResetPassword = async (userId: string) => {
    try {
      const result = await resetUserPasswordAPI(userId);

      if (result.success && result.data) {
        message.success(`密码重置成功，新密码：${result.data.newPassword}`);

        return result.data.newPassword;
      } else {
        message.error(result.message || '密码重置失败');

        return null;
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      message.error('重置密码失败');

      return null;
    }
  };

  // 更新用户状态
  const handleUpdateStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const result = await updateUserStatusAPI(userId, status);

      if (result.success) {
        message.success('状态更新成功');
        void fetchUsers(pagination.current, pagination.pageSize);

        return true;
      } else {
        message.error(result.message || '状态更新失败');

        return false;
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      message.error('更新状态失败');

      return false;
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

        return true;
      } else {
        message.error(result.message || '批量操作失败');

        return false;
      }
    } catch (error) {
      console.error('批量操作失败:', error);
      message.error('批量操作失败');

      return false;
    }
  };

  // 打开编辑模态框
  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  // 打开创建模态框
  const handleCreateUser = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  // 搜索和过滤
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    void fetchUsers(1, pagination.pageSize);
  };

  // 分页处理
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
    void fetchUsers(page, pageSize);
  };

  // 刷新数据
  const handleRefresh = () => {
    void fetchUsers(pagination.current, pagination.pageSize);
  };

  // 统计信息
  const stats = {
    total: users?.length || 0,
    active: users?.filter(u => u.status === 'active').length || 0,
    inactive: users?.filter(u => u.status === 'inactive').length || 0,
    suspended: users?.filter(u => u.status === 'suspended').length || 0
  };

  return {
    // 状态
    users,
    loading,
    searchText,
    selectedRole,
    selectedStatus,
    selectedRowKeys,
    modalVisible,
    editingUser,
    pagination,
    stats,

    // 设置函数
    setSearchText,
    setSelectedRole,
    setSelectedStatus,
    setSelectedRowKeys,
    setModalVisible,
    setEditingUser,

    // 操作函数
    fetchUsers,
    handleSaveUser,
    handleDeleteUser,
    handleResetPassword,
    handleUpdateStatus,
    handleBatchOperation,
    handleEditUser,
    handleCreateUser,
    handleCloseModal,
    handleSearch,
    handleTableChange,
    handleRefresh
  };
};
