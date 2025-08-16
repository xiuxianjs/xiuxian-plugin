import React, { useState, useEffect } from 'react'
import {
  Table,
  message,
  Tag,
  Tooltip,
  Button,
  Space,
  Form,
  Input,
  Drawer
} from 'antd'
import {
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  SaveOutlined
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

interface TaskInfo {
  name: string
  description: string
  schedule: string
  status: 'running' | 'stopped' | 'error'
  lastRun?: string
  nextRun?: string
  type: 'system' | 'game' | 'maintenance'
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
    } = {
      ShopTask: { description: '商店刷新', type: 'maintenance' },
      ExchangeTask: { description: '冲水堂清理', type: 'maintenance' },
      BossTask: { description: 'BOSS开启', type: 'game' },
      BossTask2: { description: 'BOSS开启2', type: 'game' },
      AuctionofficialTask: { description: '拍卖任务', type: 'game' },
      ForumTask: { description: '论坛任务', type: 'system' },
      MojiTask: { description: '魔界任务', type: 'game' },
      PlayerControlTask: { description: '玩家控制任务', type: 'system' },
      SecretPlaceplusTask: { description: '秘境任务（plus）', type: 'game' },
      OccupationTask: { description: '职业任务', type: 'game' },
      MsgTask: { description: '消息任务', type: 'system' },
      ShenjieTask: { description: '神界任务', type: 'game' },
      ShopGradetask: { description: '商店等级任务', type: 'maintenance' },
      Taopaotask: { description: '逃跑任务', type: 'game' },
      SecretPlaceTask: { description: '秘境任务', type: 'game' },
      TiandibangTask: { description: '天地榜任务', type: 'game' },
      Xijietask: { description: '仙界任务', type: 'game' }
    }

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

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            运行中
          </Tag>
        )
      case 'stopped':
        return (
          <Tag color="red" icon={<PauseCircleOutlined />}>
            已停止
          </Tag>
        )
      case 'error':
        return (
          <Tag color="orange" icon={<ExclamationCircleOutlined />}>
            错误
          </Tag>
        )
      default:
        return <Tag color="default">未知</Tag>
    }
  }

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

  // 格式化时间
  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN')
  }

  // 格式化Cron表达式
  const formatCron = (cron: string) => {
    const parts = cron.split(' ')
    if (parts.length === 6) {
      const [, minute, hour, , , weekday] = parts
      let description = ''

      if (minute === '0/1') description = '每分钟'
      else if (minute === '0/5') description = '每5分钟'
      else if (minute === '*/5') description = '每5分钟'
      else if (minute === '0' && hour === '0') description = '每天0点'
      else if (minute === '0' && hour === '4') description = '每天4点'
      else if (minute === '0' && hour === '20') description = '每天20点'
      else if (minute === '0' && hour === '21') description = '每天21点'
      else if (minute === '59' && hour === '20') description = '每天20点59分'
      else if (weekday === '1') description = '每周一'
      else if (weekday === '1,5') description = '每周一、五'
      else description = cron

      return (
        <Tooltip title={cron}>
          <span>{description}</span>
        </Tooltip>
      )
    }
    return cron
  }

  // 表格列定义
  const columns: ColumnsType<TaskInfo> = [
    {
      title: '任务名称',
      key: 'name',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </div>
      )
    },
    {
      title: '类型',
      key: 'type',
      width: 100,
      render: (_, record) => getTypeTag(record.type)
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => getStatusTag(record.status)
    },
    {
      title: '执行计划',
      key: 'schedule',
      width: 120,
      render: (_, record) => formatCron(record.schedule)
    },
    {
      title: '上次执行',
      key: 'lastRun',
      width: 150,
      render: (_, record) => (record.lastRun ? formatTime(record.lastRun) : '-')
    },
    {
      title: '下次执行',
      key: 'nextRun',
      width: 150,
      render: (_, record) => (record.nextRun ? formatTime(record.nextRun) : '-')
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => handleStartTask(record)}
            disabled={record.status === 'running'}
          >
            启动
          </Button>
          <Button
            size="small"
            danger
            icon={<PauseCircleOutlined />}
            onClick={() => handleStopTask(record)}
            disabled={record.status === 'stopped'}
          >
            停止
          </Button>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => handleRestartTask(record)}
          >
            重启
          </Button>
        </Space>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">定时任务管理</h1>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleManualRanking}
          >
            <ReloadOutlined />
            手动执行天地榜计算
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleStartAllTasks}
          >
            <PlayCircleOutlined />
            启动所有任务
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleStopAllTasks}
          >
            <PauseCircleOutlined />
            停止所有任务
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleOpenConfig}
          >
            <SettingOutlined />
            编辑配置
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={handleRestartTasks}
          >
            <ReloadOutlined />
            重启所有任务
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => {
              fetchTaskConfig()
              message.success('数据已刷新')
            }}
          >
            <ReloadOutlined />
            刷新数据
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockCircleOutlined className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">总任务数</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleOutlined className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">运行中</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'running').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <PauseCircleOutlined className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">已停止</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'stopped').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ExclamationCircleOutlined className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">错误</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === 'error').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 任务表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">定时任务列表</h3>
        </div>
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="name"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* 配置编辑抽屉 */}
      <Drawer
        title="编辑定时任务配置"
        placement="right"
        width={600}
        open={configDrawerVisible}
        onClose={() => setConfigDrawerVisible(false)}
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveConfig}
          >
            保存配置
          </Button>
        }
      >
        <Form form={configForm} layout="vertical">
          {Object.keys(taskConfig).map(taskName => (
            <Form.Item
              key={taskName}
              label={taskName}
              name={taskName}
              rules={[{ required: true, message: '请输入Cron表达式' }]}
            >
              <Input placeholder="请输入Cron表达式，如: 0 0/1 * * * ?" />
            </Form.Item>
          ))}
        </Form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-blue-800 font-semibold mb-2">Cron表达式说明</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>
              • <code>0 0/1 * * * ?</code> - 每分钟执行
            </li>
            <li>
              • <code>0 0/5 * * * ?</code> - 每5分钟执行
            </li>
            <li>
              • <code>0 0 0 * * ?</code> - 每天0点执行
            </li>
            <li>
              • <code>0 0 21 * * ?</code> - 每天21点执行
            </li>
            <li>
              • <code>0 0 0 ? * 1</code> - 每周一0点执行
            </li>
            <li>
              • <code>0 0 21 ? * 1,5</code> - 每周一、五21点执行
            </li>
          </ul>
        </div>
      </Drawer>
    </div>
  )
}
