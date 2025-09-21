import React from 'react';
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { getRankingsAPI, getRankingsStatsAPI, triggerRankingCalculationAPI } from '@/api/auth';
import { RankingItem, RankingStats } from '@/types/types';

import { TrophyOutlined, CrownOutlined, FireOutlined, TeamOutlined, BankOutlined, StarOutlined } from '@ant-design/icons';

// 排名类型选项
export const rankingTypes = [
  {
    value: 'ASSOCIATION_POWER',
    label: '宗门综合实力',
    icon: <CrownOutlined />
  },
  {
    value: 'ASSOCIATION_MEMBERS',
    label: '宗门成员数',
    icon: <TeamOutlined />
  },
  {
    value: 'ASSOCIATION_LINGSHI',
    label: '宗门灵石池',
    icon: <BankOutlined />
  },
  { value: 'ASSOCIATION_LEVEL', label: '宗门等级', icon: <StarOutlined /> },
  { value: 'PLAYER_LEVEL', label: '玩家境界', icon: <FireOutlined /> },
  { value: 'PLAYER_ATTACK', label: '玩家攻击力', icon: <TrophyOutlined /> },
  { value: 'PLAYER_DEFENSE', label: '玩家防御力', icon: <TrophyOutlined /> }
];

export const useRankingManagerCode = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rankingStats, setRankingStats] = useState<RankingStats | null>(null);
  const [selectedRankingType, setSelectedRankingType] = useState<string>('ASSOCIATION_POWER');
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  const [rankingLimit, setRankingLimit] = useState<number>(10);

  // 获取排名统计信息
  const fetchRankingStats = async () => {
    if (!user) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      const result = await getRankingsStatsAPI();

      if (result.success && result.data) {
        setRankingStats(result.data);
      } else {
        message.error(result.message || '获取排名统计失败');
      }
    } catch (error) {
      console.error('获取排名统计失败:', error);
      message.error('获取排名统计失败');
    }
  };

  // 获取排名数据
  const fetchRankingData = async (type: string, limit: number) => {
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

      const result = await getRankingsAPI({
        type,
        limit
      });

      if (result.success && result.data) {
        setRankingData(result.data);
      } else {
        message.error(result.message || '获取排名数据失败');
      }
    } catch (error) {
      console.error('获取排名数据失败:', error);
      message.error('获取排名数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 触发排名计算
  const handleTriggerCalculation = async () => {
    if (!user) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      message.loading('正在计算排名...', 0);
      const result = await triggerRankingCalculationAPI();

      message.destroy();

      if (result.success) {
        message.success('排名计算完成');
        // 重新获取数据
        fetchRankingStats();
        fetchRankingData(selectedRankingType, rankingLimit);
      } else {
        message.error(result.message || '排名计算失败');
      }
    } catch (error) {
      message.destroy();
      console.error('触发排名计算失败:', error);
      message.error('触发排名计算失败');
    }
  };

  useEffect(() => {
    fetchRankingStats();
    fetchRankingData(selectedRankingType, rankingLimit);
  }, [user]);

  // 处理排名类型变化
  const handleRankingTypeChange = (type: string) => {
    setSelectedRankingType(type);
    fetchRankingData(type, rankingLimit);
  };

  // 处理排名数量变化
  const handleRankingLimitChange = (limit: number) => {
    setRankingLimit(limit);
    fetchRankingData(selectedRankingType, limit);
  };

  // 获取排名类型显示名称
  const getRankingTypeLabel = (type: string) => {
    const found = rankingTypes.find(item => item.value === type);

    return found ? found.label : type;
  };

  return {
    rankingStats,
    selectedRankingType,
    rankingData,
    rankingLimit,
    loading,
    handleRankingTypeChange,
    handleRankingLimitChange,
    getRankingTypeLabel,
    fetchRankingStats,
    fetchRankingData,
    handleTriggerCalculation
  };
};
