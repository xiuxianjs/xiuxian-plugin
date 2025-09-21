import React, { useState, useEffect } from 'react';
import { message } from 'antd';

import { useAuth } from '@/contexts/AuthContext';
import { getAssociationsAPI, getAssociationsStatsAPI } from '@/api/auth';
import { AssociationManagerPageSize, levelNames } from '@/config';
import { Association } from '@/types/types';

export const useAssociationManagerCode = () => {
  const { user } = useAuth();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [associationDetailVisible, setAssociationDetailVisible] = useState(false);

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: AssociationManagerPageSize,
    total: 0,
    totalPages: 0
  });

  // 统计数据状态
  const [stats, setStats] = useState({
    total: 0,
    totalMembers: 0,
    totalPower: 0,
    totalLingshi: 0,
    xianjieCount: 0,
    fanjieCount: 0
  });

  // 获取宗门数据
  const fetchAssociations = async (page = 1, pSize = AssociationManagerPageSize) => {
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

      const result = await getAssociationsAPI({
        page,
        pageSize: pSize,
        search: searchText
      });

      if (result.success && result.data) {
        setAssociations(result.data.list);
        setPagination(result.data.pagination);
      } else {
        message.error(result.message || '获取宗门数据失败');
      }
    } catch (error) {
      console.error('获取宗门数据失败:', error);
      message.error('获取宗门数据失败');
    } finally {
      setLoading(false);
    }
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

      const result = await getAssociationsStatsAPI({
        search: searchText
      });

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  useEffect(() => {
    fetchAssociations(1, AssociationManagerPageSize);
    fetchStats();
  }, [user]);

  // 处理搜索变化
  const handleSearchAndFilter = () => {
    fetchAssociations(1, pagination.pageSize);
    fetchStats();
  };

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    fetchAssociations(page, pageSize);
  };

  // 获取境界名称
  const getLevelName = (levelId: number) => {
    return levelNames[levelId] || `境界${levelId}`;
  };

  // 获取宗门类型
  const getAssociationType = (power: number) => {
    return power > 0 ? '仙界' : '凡界';
  };

  return {
    associations,
    loading,
    searchText,
    selectedAssociation,
    associationDetailVisible,
    pagination,
    stats,
    fetchAssociations,
    fetchStats,
    handleSearchAndFilter,
    handleTableChange,
    getLevelName,
    getAssociationType,
    setSearchText,
    setSelectedAssociation,
    setAssociationDetailVisible
  };
};
