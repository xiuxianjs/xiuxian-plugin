import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { getGameUsersAPI, getGameUsersStatsAPI, updateGameUserAPI } from '@/api/auth';
import { GameUser } from '@/types/types';
import { levelNames, pageSize } from '@/config';

export const useUserManagerCode = () => {
  const { user } = useAuth();
  const [gameUsers, setGameUsers] = useState<GameUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState<GameUser | null>(null);
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [userEditVisible, setUserEditVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
    total: 0,
    totalPages: 0
  });

  // 统计数据状态
  const [stats, setStats] = useState({
    total: 0,
    highLevel: 0,
    mediumLevel: 0,
    lowLevel: 0,
    totalLingshi: 0,
    totalShenshi: 0,
    totalLunhui: 0
  });

  // 获取游戏用户数据
  const fetchGameUsers = async (page = 1, pSize = pageSize) => {
    if (!user) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      const result = await getGameUsersAPI(token, {
        page,
        pageSize: pSize,
        search: searchText
      });

      if (result.success && result.data) {
        setGameUsers(result.data.list);
        setPagination(result.data.pagination);
      } else {
        message.error(result.message || '获取用户数据失败');
      }
    } catch (error) {
      console.error('获取游戏用户数据失败:', error);
      message.error('获取用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameUsers(1, 20);
    fetchStats();
  }, [user]);

  // 处理搜索和筛选变化
  const handleSearchAndFilter = () => {
    fetchGameUsers(1, pagination.pageSize);
    fetchStats();
  };

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    fetchGameUsers(page, pageSize);
  };

  // 获取境界名称
  const getLevelName = (levelId: number) => {
    return levelNames[levelId] || `境界${levelId}`;
  };

  // 获取性别显示
  const getSexDisplay = (sex: string) => {
    return sex === '0' ? '男' : sex === '1' ? '女' : '未知';
  };

  // 获取灵根颜色
  const getLinggenColor = (linggen: unknown) => {
    if (!linggen) {
      return 'default';
    }
    const name = (linggen as { name?: string })?.name || '';

    if (name.includes('混沌') || name.includes('天五') || name.includes('九转')) {
      return 'gold';
    }
    if (name.includes('五灵') || name.includes('九重')) {
      return 'purple';
    }
    if (name.includes('三灵') || name.includes('双灵')) {
      return 'blue';
    }

    return 'green';
  };

  // 获取统计数据
  const fetchStats = async () => {
    if (!user) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      const result = await getGameUsersStatsAPI(token, {
        search: searchText
      });

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  // 处理编辑用户
  const handleEditUser = (user: GameUser) => {
    setSelectedUser(user);
    setUserEditVisible(true);
  };

  // 保存编辑的用户
  const handleSaveUser = async (updatedUser: GameUser) => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      const result = await updateGameUserAPI(token, updatedUser);

      if (result.success) {
        message.success('用户更新成功');
        setUserEditVisible(false);
        // 刷新数据
        fetchGameUsers(pagination.current, pagination.pageSize);
        fetchStats();
      } else {
        message.error(result.message || '用户更新失败');
      }
    } catch (error) {
      console.error('用户更新失败:', error);
      message.error('用户更新失败');
    } finally {
      setEditLoading(false);
    }
  };

  return {
    gameUsers,
    loading,
    searchText,
    selectedUser,
    userDetailVisible,
    userEditVisible,
    editLoading,
    pagination,
    stats,
    getLevelName,
    getSexDisplay,
    getLinggenColor,
    handleSearchAndFilter,
    handleTableChange,
    handleEditUser,
    handleSaveUser,
    fetchGameUsers,
    fetchStats,
    setSearchText,
    setSelectedUser,
    setUserDetailVisible,
    setUserEditVisible
  };
};
