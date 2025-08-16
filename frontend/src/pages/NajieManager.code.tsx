import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { useAuth } from '@/contexts/AuthContext'
import { getNajieAPI, getNajieStatsAPI } from '@/api/auth'
import { Najie } from '@/types'
import { pageSize } from '@/config'

export const useNajieManagerCode = () => {
  const { user } = useAuth()
  const [najieList, setNajieList] = useState<Najie[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedNajie, setSelectedNajie] = useState<Najie | null>(null)
  const [najieDetailVisible, setNajieDetailVisible] = useState(false)

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
    total: 0,
    totalPages: 0
  })

  // 统计数据状态
  const [stats, setStats] = useState({
    total: 0,
    totalLingshi: 0,
    totalItems: 0,
    categoryStats: {
      装备: 0,
      丹药: 0,
      道具: 0,
      功法: 0,
      草药: 0,
      材料: 0,
      仙宠: 0,
      仙宠口粮: 0
    }
  })

  // 获取背包数据
  const fetchNajie = async (page = 1, pSize = pageSize) => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getNajieAPI(token, {
        page,
        pageSize: pSize,
        search: searchText
      })

      if (result.success && result.data) {
        setNajieList(result.data.list)
        setPagination(result.data.pagination)
      } else {
        message.error(result.message || '获取背包数据失败')
      }
    } catch (error) {
      console.error('获取背包数据失败:', error)
      message.error('获取背包数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStats = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getNajieStatsAPI(token, {
        search: searchText
      })

      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  useEffect(() => {
    fetchNajie(1, pageSize)
    fetchStats()
  }, [user])

  // 处理搜索变化
  const handleSearchAndFilter = () => {
    fetchNajie(1, pagination.pageSize)
    fetchStats()
  }

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    fetchNajie(page, pageSize)
  }

  // 计算背包总物品数
  const getTotalItems = (najie: Najie) => {
    const categories = [
      '装备',
      '丹药',
      '道具',
      '功法',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ] as const
    return categories.reduce((total, cat) => {
      return total + (Array.isArray(najie[cat]) ? najie[cat].length : 0)
    }, 0)
  }

  return {
    najieList,
    loading,
    searchText,
    selectedNajie,
    najieDetailVisible,
    pagination,
    stats,
    fetchNajie,
    fetchStats,
    handleSearchAndFilter,
    handleTableChange,
    getTotalItems,
    setSearchText,
    setSelectedNajie,
    setNajieDetailVisible
  }
}
