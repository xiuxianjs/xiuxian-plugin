import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getGameUsersStatsAPI,
  getAssociationsStatsAPI,
  getNajieStatsAPI,
  getRankingsStatsAPI,
  getTaskStatusAPI
} from '@/api/auth'
import { DashboardStats } from '@/types'

export const useDashboardCode = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  // 获取统计数据
  const fetchStats = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('未找到登录令牌')
        return
      }

      // 并行获取所有统计数据
      const [userStats, associationStats, najieStats, rankingStats, taskStats] =
        await Promise.all([
          getGameUsersStatsAPI(token),
          getAssociationsStatsAPI(token),
          getNajieStatsAPI(token),
          getRankingsStatsAPI(token),
          getTaskStatusAPI(token)
        ])

      const dashboardStats: DashboardStats = {
        users: {
          total: userStats.success ? userStats.data?.total || 0 : 0,
          active: userStats.success ? userStats.data?.total || 0 : 0,
          newToday: 0
        },
        associations: {
          total: associationStats.success
            ? associationStats.data?.total || 0
            : 0,
          totalMembers: associationStats.success
            ? associationStats.data?.totalMembers || 0
            : 0,
          totalPower: associationStats.success
            ? associationStats.data?.totalPower || 0
            : 0,
          totalLingshi: associationStats.success
            ? associationStats.data?.totalLingshi || 0
            : 0
        },
        najie: {
          total: najieStats.success ? najieStats.data?.total || 0 : 0,
          totalLingshi: najieStats.success
            ? najieStats.data?.totalLingshi || 0
            : 0,
          totalItems: najieStats.success ? najieStats.data?.totalItems || 0 : 0
        },
        rankings: {
          lastUpdate: rankingStats.success
            ? rankingStats.data?.lastUpdate || ''
            : '',
          topAssociations: rankingStats.success
            ? rankingStats.data?.topAssociations || []
            : [],
          topPlayers: rankingStats.success
            ? rankingStats.data?.topPlayers || []
            : []
        },
        system: {
          uptime: '7天 12小时 30分钟',
          lastBackup: new Date().toISOString(),
          activeTasks: taskStats.success
            ? Object.keys(taskStats.data || {}).length
            : 0
        }
      }

      setStats(dashboardStats)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  return {
    loading,
    stats,
    fetchStats
  }
}
