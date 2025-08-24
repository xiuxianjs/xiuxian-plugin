import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { useAuth } from '@/contexts/AuthContext'
import { getNajieAPI, updateNajieAPI } from '@/api/auth'
import { Najie } from '@/types/types'
import { pageSize } from '@/config'

export const useNajieManagerCode = () => {
  const { user } = useAuth()
  const [najieList, setNajieList] = useState<Najie[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedNajie, setSelectedNajie] = useState<Najie | null>(null)
  const [najieDetailVisible, setNajieDetailVisible] = useState(false)
  const [najieEditVisible, setNajieEditVisible] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
    total: 0,
    totalPages: 0
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

      console.log('Fetching najie data with token:', token)

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

  useEffect(() => {
    fetchNajie(1, pageSize)
  }, [user])

  // 处理搜索变化
  const handleSearchAndFilter = () => {
    fetchNajie(1, pagination.pageSize)
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

  // 处理编辑背包
  const handleEditNajie = (najie: Najie) => {
    setSelectedNajie(najie)
    setNajieEditVisible(true)
  }

  // 保存编辑的背包
  const handleSaveNajie = async (updatedNajie: Najie) => {
    setEditLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      console.log('Saving najie data with token:', token, updatedNajie)

      const result = await updateNajieAPI(token, updatedNajie)
      if (result.success) {
        message.success('背包更新成功')
        setNajieEditVisible(false)
        // 刷新数据
        fetchNajie(pagination.current, pagination.pageSize)
      } else {
        message.error(result.message || '背包更新失败')
      }
    } catch (error) {
      console.error('背包更新失败:', error)
      message.error('背包更新失败')
    } finally {
      setEditLoading(false)
    }
  }

  return {
    najieList,
    loading,
    searchText,
    selectedNajie,
    najieDetailVisible,
    najieEditVisible,
    editLoading,
    pagination,
    fetchNajie,
    handleSearchAndFilter,
    handleTableChange,
    handleEditNajie,
    handleSaveNajie,
    getTotalItems,
    setSearchText,
    setSelectedNajie,
    setNajieDetailVisible,
    setNajieEditVisible
  }
}
