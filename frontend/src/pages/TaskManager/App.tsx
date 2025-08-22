import React, { useState, useEffect } from 'react'
import { Table, message, Tag, Form } from 'antd'
import {
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import {
  getTaskConfigAPI,
  updateTaskConfigAPI,
  restartTasksAPI,
  getTaskStatusAPI,
  taskControlAPI
} from '@/api/auth'
import type { ColumnsType } from 'antd/es/table'
import { TaskInfo } from '@/types'
import TaskConfig from '../Drawers/TaskConfig'
import StatusTag from './StatusTag'
import formatCron from './config'
import classNames from 'classnames'

// 获取类型标签
const getTypeTag = (type: string) => {
  switch (type) {
    case 'system':
      return <Tag color="blue">系统</Tag>
    case 'game':
      return <Tag color="green">游戏</Tag>
    case 'maintenance':
      return <Tag color="purple">维护</Tag>
    default:
      return <Tag color="default">其他</Tag>
  }
}

const taskNames: {
  [key: string]: string
} = {
  ShopTask: '商店刷新',
  ExchangeTask: '冲水堂清理',
  BossTask: 'BOSS开启',
  BossTask2: 'BOSS开启2',
  AuctionofficialTask: '拍卖任务',
  ForumTask: '论坛任务',
  MojiTask: '魔界任务',
  PlayerControlTask: '玩家控制任务',
  SecretPlaceplusTask: '秘境任务（plus）',
  OccupationTask: '职业任务',
  MsgTask: '消息任务',
  ShenjieTask: '神界任务',
  ShopGradetask: '商店等级任务',
  Taopaotask: '逃跑任务',
  SecretPlaceTask: '秘境任务',
  TiandibangTask: '天地榜任务',
  Xijietask: '仙界任务'
}

export default function TaskManager() {
  const { user } = useAuth()
  const [loading] = useState(false)
  const [tasks, setTasks] = useState<TaskInfo[]>([])
  const [taskConfig, setTaskConfig] = useState<{ [key: string]: string }>({})
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false)
  const [configForm] = Form.useForm()

  // 根据实际配置生成任务数据
  const generateTasksFromConfig = (
    config: { [key: string]: string },
    taskStatus?: {
      [key: string]: { running: boolean; nextInvocation?: string }
    }
  ): TaskInfo[] => {
    const taskDescriptions: {
      [key: string]: {
        description: string
        type: 'system' | 'game' | 'maintenance'
      }
    } = {}

    return Object.entries(config).map(([name, schedule]) => {
      const taskInfo = taskDescriptions[name] || {
        description: name,
        type: 'system' as const
      }
      const status = taskStatus?.[name]
      return {
        name,
        description: taskInfo.description,
        schedule,
        status: status?.running ? 'running' : 'stopped',
        lastRun: new Date().toISOString(),
        nextRun:
          status?.nextInvocation || new Date(Date.now() + 60000).toISOString(),
        type: taskInfo.type
      }
    })
  }

  // 获取任务配置和状态
  const fetchTaskConfig = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const [configResult, statusResult] = await Promise.all([
        getTaskConfigAPI(token),
        getTaskStatusAPI(token)
      ])

      if (configResult.success && configResult.data) {
        setTaskConfig(configResult.data)
        // 更新任务数据以反映实际配置和状态
        updateTasksFromConfig(
          configResult.data,
          statusResult.success ? statusResult.data : undefined
        )
      }
    } catch (error) {
      console.error('获取任务配置失败:', error)
    }
  }

  // 根据配置更新任务数据
  const updateTasksFromConfig = (
    config: { [key: string]: string },
    taskStatus?: {
      [key: string]: { running: boolean; nextInvocation?: string }
    }
  ) => {
    const updatedTasks = generateTasksFromConfig(config, taskStatus)
    setTasks(updatedTasks)
  }

  useEffect(() => {
    fetchTaskConfig()
  }, [user])

  // 格式化时间
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN')
  }

  // 表格列定义
  const columns: ColumnsType<TaskInfo> = [
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>任务名称</span>
        </div>
      ),
      key: 'name',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="font-bold text-white">{record.name}</div>
          <div className="text-xs text-slate-400">{taskNames[record.name]}</div>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-2 text-blue-400 font-bold">
          <span>类型</span>
        </div>
      ),
      key: 'type',
      width: 100,
      render: (_, record) => getTypeTag(record.type)
    },
    {
      title: (
        <div className="flex items-center gap-2 text-green-400 font-bold">
          <span>状态</span>
        </div>
      ),
      key: 'status',
      width: 100,
      render: (_, record) => <StatusTag status={record.status} />
    },
    {
      title: (
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <span>执行计划</span>
        </div>
      ),
      key: 'schedule',
      width: 120,
      render: (_, record) => formatCron(record.schedule)
    },
    {
      title: (
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <span>上次执行</span>
        </div>
      ),
      key: 'lastRun',
      width: 150,
      render: (_, record) => (record.lastRun ? formatTime(record.lastRun) : '-')
    },
    {
      title: (
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <span>下次执行</span>
        </div>
      ),
      key: 'nextRun',
      width: 150,
      render: (_, record) => (record.nextRun ? formatTime(record.nextRun) : '-')
    },
    {
      title: (
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <span>操作</span>
        </div>
      ),
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            className={classNames(
              'px-3 py-1 text-sm rounded-lg flex items-center gap-1 transition-all duration-200 shadow-lg hover:shadow-xl',
              {
                'bg-slate-600 text-slate-400 cursor-not-allowed':
                  record.status === 'running',
                'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600':
                  record.status !== 'running'
              }
            )}
            onClick={() => handleStartTask(record)}
            disabled={record.status === 'running'}
          >
            <PlayCircleOutlined />
            启动
          </button>
          <button
            className={classNames(
              'px-3 py-1 text-sm rounded-lg flex items-center gap-1 transition-all duration-200 shadow-lg hover:shadow-xl',
              {
                'bg-slate-600 text-slate-400 cursor-not-allowed':
                  record.status === 'stopped',
                'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600':
                  record.status !== 'stopped'
              }
            )}
            onClick={() => handleStopTask(record)}
            disabled={record.status === 'stopped'}
          >
            <PauseCircleOutlined />
            停止
          </button>
          <button
            className="px-3 py-1 text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-1"
            onClick={() => handleRestartTask(record)}
          >
            <ReloadOutlined />
            重启
          </button>
        </div>
      )
    }
  ]

  // 启动任务
  const handleStartTask = async (task: TaskInfo) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading(`正在启动任务 ${task.name}...`, 0)
      const result = await taskControlAPI(token, 'start', task.name)
      message.destroy()

      if (result.success && result.data?.success) {
        message.success(`任务 ${task.name} 启动成功`)
        // 重新获取任务状态
        fetchTaskConfig()
      } else {
        message.error(result.message || `任务 ${task.name} 启动失败`)
      }
    } catch (error) {
      message.destroy()
      console.error('启动任务失败:', error)
      message.error('启动任务失败')
    }
  }

  // 停止任务
  const handleStopTask = async (task: TaskInfo) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading(`正在停止任务 ${task.name}...`, 0)
      const result = await taskControlAPI(token, 'stop', task.name)
      message.destroy()

      if (result.success && result.data?.success) {
        message.success(`任务 ${task.name} 停止成功`)
        // 重新获取任务状态
        fetchTaskConfig()
      } else {
        message.error(result.message || `任务 ${task.name} 停止失败`)
      }
    } catch (error) {
      message.destroy()
      console.error('停止任务失败:', error)
      message.error('停止任务失败')
    }
  }

  // 重启单个任务
  const handleRestartTask = async (task: TaskInfo) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading(`正在重启任务 ${task.name}...`, 0)
      const result = await restartTasksAPI(token, task.name)
      message.destroy()

      if (result.success && result.data?.success) {
        message.success(`任务 ${task.name} 重启成功`)
        // 重新获取任务状态
        fetchTaskConfig()
      } else {
        message.error(result.message || `任务 ${task.name} 重启失败`)
      }
    } catch (error) {
      message.destroy()
      console.error('重启任务失败:', error)
      message.error('重启任务失败')
    }
  }

  // 手动执行天地榜计算
  const handleManualRanking = () => {
    message.loading('正在执行天地榜计算...', 0)
    setTimeout(() => {
      message.destroy()
      message.success('天地榜计算完成')
    }, 2000)
  }

  // 打开配置编辑抽屉
  const handleOpenConfig = () => {
    configForm.setFieldsValue(taskConfig)
    setConfigDrawerVisible(true)
  }

  // 保存配置
  const handleSaveConfig = async () => {
    try {
      const values = await configForm.validateFields()
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await updateTaskConfigAPI(token, values)
      if (result.success) {
        message.success('配置保存成功')
        setTaskConfig(values)
        updateTasksFromConfig(values)
        setConfigDrawerVisible(false)
        // 重新获取任务状态
        fetchTaskConfig()
      } else {
        message.error(result.message || '保存失败')
      }
    } catch (error) {
      console.error('保存配置失败:', error)
      message.error('保存配置失败')
    }
  }

  // 启动所有任务
  const handleStartAllTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading('正在启动所有任务...', 0)
      const result = await taskControlAPI(token, 'startAll')
      message.destroy()

      if (result.success && result.data?.success) {
        message.success('所有任务启动成功')
        // 重新获取配置
        fetchTaskConfig()
      } else {
        message.error(result.message || '启动失败')
      }
    } catch (error) {
      message.destroy()
      console.error('启动任务失败:', error)
      message.error('启动任务失败')
    }
  }

  // 停止所有任务
  const handleStopAllTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading('正在停止所有任务...', 0)
      const result = await taskControlAPI(token, 'stopAll')
      message.destroy()

      if (result.success && result.data?.success) {
        message.success('所有任务停止成功')
        // 重新获取配置
        fetchTaskConfig()
      } else {
        message.error(result.message || '停止失败')
      }
    } catch (error) {
      message.destroy()
      console.error('停止任务失败:', error)
      message.error('停止任务失败')
    }
  }

  // 重启所有任务
  const handleRestartTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading('正在重启所有任务...', 0)
      const result = await restartTasksAPI(token)
      message.destroy()

      if (result.success && result.data?.success) {
        message.success('所有任务重启成功')
        // 重新获取配置
        fetchTaskConfig()
      } else {
        message.error(result.message || '重启失败')
      }
    } catch (error) {
      message.destroy()
      console.error('重启任务失败:', error)
      message.error('重启任务失败')
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10  p-2 md:p-6 h-full overflow-y-auto">
        {/* 页面标题和操作按钮 */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-2">
          <div className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ClockCircleOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">定时任务</h1>
              <p className="text-slate-400 text-sm mt-1">系统定时任务和配置</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              {
                lable: '手动执行天地榜计算',
                icon: <ReloadOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: handleManualRanking
              },
              {
                lable: '启动所有任务',
                icon: <PlayCircleOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: handleStartAllTasks
              },
              {
                lable: '停止所有任务',
                icon: <PauseCircleOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: handleStopAllTasks
              },
              {
                lable: '编辑配置',
                icon: <SettingOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: handleOpenConfig
              },
              {
                lable: '重启所有任务',
                icon: <ReloadOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: handleRestartTasks
              },
              {
                lable: '刷新数据',
                icon: <ReloadOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: () => {
                  fetchTaskConfig()
                  message.success('数据已刷新')
                }
              }
            ].map((item, index) => (
              <button
                key={index}
                className={item.className}
                onClick={item.onClick}
              >
                {item.icon}
                {item.lable}
              </button>
            ))}
          </div>
        </div>

        {/* 任务表格 */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ClockCircleOutlined className="text-purple-400" />
              定时任务列表
            </h3>
          </div>
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="name"
            loading={loading}
            pagination={false}
            scroll={{ x: 1200 }}
            rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
            className="bg-transparent xiuxian-table"
          />
        </div>

        {/* 配置编辑抽屉 */}
        <TaskConfig
          configDrawerVisible={configDrawerVisible}
          setConfigDrawerVisible={setConfigDrawerVisible}
          configForm={configForm}
          taskConfig={taskConfig}
          handleSaveConfig={handleSaveConfig}
        />
      </div>
    </div>
  )
}
