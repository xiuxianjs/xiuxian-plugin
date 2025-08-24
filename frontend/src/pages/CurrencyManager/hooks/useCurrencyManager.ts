import React from 'react'
import { Form, message } from 'antd'
import type {
  CurrencyUser,
  RechargeRecord,
  GlobalStats,
  RechargeFormValues
} from '@/types/CurrencyManager'
import {
  fetchUsersAPI,
  fetchRecordsAPI,
  fetchStatsAPI,
  fetchConfigAPI,
  createRechargeRecordAPI,
  completePaymentAPI
} from '@/api/auth/currency'

export const useCurrencyManager = () => {
  const [loading, setLoading] = React.useState(false)
  const [users, setUsers] = React.useState<CurrencyUser[]>([])
  const [records, setRecords] = React.useState<RechargeRecord[]>([])
  const [stats, setStats] = React.useState<GlobalStats | null>(null)
  const [config, setConfig] = React.useState<any>(null)
  const [selectedTab, setSelectedTab] = React.useState('users')
  const [rechargeModalVisible, setRechargeModalVisible] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<CurrencyUser | null>(
    null
  )
  const [rechargeForm] = Form.useForm()

  // 获取配置信息
  const fetchConfig = async () => {
    const res = await fetchConfigAPI()
    if (res.success && res.data) {
      setConfig(res.data)
    } else {
      message.error(res.message || '获取配置信息失败')
    }
  }

  // 获取用户货币信息
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetchUsersAPI()
      console.log('获取用户数据结果:', res)
      if (res.success && res.data) {
        setUsers(res.data)
      } else {
        message.error(res.message || '获取用户数据失败')
      }
    } catch (error) {
      console.error('获取用户数据错误:', error)
      message.error('获取用户数据失败')
    }
    setLoading(false)
  }

  // 获取充值记录
  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await fetchRecordsAPI()
      console.log('获取充值记录结果:', res)
      if (res.success && res.data) {
        setRecords(res.data)
      } else {
        message.error(res.message || '获取充值记录失败')
      }
    } catch (error) {
      console.error('获取充值记录错误:', error)
      message.error('获取充值记录失败')
    }
    setLoading(false)
  }

  // 获取全局统计
  const fetchStats = async () => {
    const res = await fetchStatsAPI()
    if (res.success && res.data) {
      setStats(res.data)
    } else {
      message.error(res.message || '获取统计数据失败')
    }
  }

  // 处理充值确认
  const handleRechargeOk = async (values: RechargeFormValues) => {
    try {
      // 第一步：创建充值记录
      const createRes = await createRechargeRecordAPI({
        action: values.type,
        userId: values.userId,
        tier: values.tier,
        paymentMethod: 'admin',
        remark: values.remark
      })

      if (createRes.success && createRes.data) {
        // 第二步：完成支付
        const completeRes = await completePaymentAPI({
          recordId: createRes.data.id,
          transactionId: 'ADMIN_' + Date.now(),
          paymentMethod: 'admin'
        })

        if (completeRes.success) {
          message.success('充值成功')
          setRechargeModalVisible(false)
          setSelectedUser(null)
          rechargeForm.resetFields()
          fetchUsers()
          fetchStats()
        } else {
          message.error(completeRes.message || '支付完成失败')
        }
      } else {
        message.error(createRes.message || '创建充值记录失败')
      }
    } catch (error) {
      message.error('充值操作失败，请重试')
      console.error('充值错误:', error)
    }
  }

  // 初始化数据
  React.useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([fetchConfig(), fetchUsers(), fetchStats()])
      } catch (error) {
        console.error('初始化数据失败:', error)
      }
    }
    initData()
  }, [])

  return {
    loading,
    users,
    records,
    stats,
    config,
    selectedTab,
    rechargeModalVisible,
    selectedUser,
    rechargeForm,
    setSelectedTab,
    setRechargeModalVisible,
    setSelectedUser,
    fetchUsers,
    fetchRecords,
    fetchStats,
    fetchConfig,
    handleRechargeOk
  }
}
