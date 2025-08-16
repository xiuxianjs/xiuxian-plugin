import React, { useState, useEffect } from 'react'
import {
  Table,
  Modal,
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
  InfoCircleOutlined,
  SettingOutlined,
  SaveOutlined
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import {
  getTaskConfigAPI,
  updateTaskConfigAPI,
  restartTasksAPI
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
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<TaskInfo[]>([])
  const [taskConfig, setTaskConfig] = useState<{ [key: string]: string }>({})
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false)
  const [configForm] = Form.useForm()

  // 模拟任务数据
  const mockTasks: TaskInfo[] = [
    {
      name: 'ActionTask',
      description: '检测人物动作是否结束',
      schedule: '0 0/1 * * * ?',
      status: 'running',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 60000).toISOString(),
      type: 'game'
    },
    {
      name: 'ActionPlusTask',
      description: '检测沉迷是否结束',
      schedule: '0 0/5 * * * ?',
      status: 'running',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 300000).toISOString(),
      type: 'game'
    },
    {
      name: 'GamesTask',
      description: '游戏锁定状态检查',
      schedule: '0 */5 * * * ?',
      status: 'running',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 300000).toISOString(),
      type: 'system'
    },
    {
      name: 'SaijiTask',
      description: '赛季结算',
      schedule: '0 0 0 ? * 1',
      status: 'running',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'game'
    },

    {
      name: 'TempTask',
      description: '临时任务处理',
      schedule: '20 0/5 * * * ?',
      status: 'running',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 300000).toISOString(),
      type: 'system'
    },
    {
      name: 'RankingTask',
      description: '排名计算任务',
      schedule: '0 */30 * * * ?',
      status: 'running',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      type: 'game'
    }
  ]

  // 获取任务配置
  const fetchTaskConfig = async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await getTaskConfigAPI(token)
      if (result.success && result.data) {
        setTaskConfig(result.data)
        // 更新任务数据以反映实际配置
        updateTasksFromConfig(result.data)
      }
    } catch (error) {
      console.error('获取任务配置失败:', error)
    }
  }

  // 根据配置更新任务数据
  const updateTasksFromConfig = (config: { [key: string]: string }) => {
    const updatedTasks = mockTasks.map(task => {
      const configSchedule = config[task.name]
      return {
        ...task,
        schedule: configSchedule || task.schedule
      }
    })
    setTasks(updatedTasks)
  }

  useEffect(() => {
    setTasks(mockTasks)
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
      const [second, minute, hour, day, month, weekday] = parts
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
  const handleStartTask = (task: TaskInfo) => {
    message.success(`任务 ${task.name} 已启动`)
    setTasks(prev =>
      prev.map(t =>
        t.name === task.name ? { ...t, status: 'running' as const } : t
      )
    )
  }

  // 停止任务
  const handleStopTask = (task: TaskInfo) => {
    message.warning(`任务 ${task.name} 已停止`)
    setTasks(prev =>
      prev.map(t =>
        t.name === task.name ? { ...t, status: 'stopped' as const } : t
      )
    )
  }

  // 重启任务
  const handleRestartTask = (task: TaskInfo) => {
    message.info(`任务 ${task.name} 正在重启...`)
    setTasks(prev =>
      prev.map(t =>
        t.name === task.name ? { ...t, status: 'running' as const } : t
      )
    )
  }

  // 手动执行排名计算
  const handleManualRanking = () => {
    message.loading('正在执行排名计算...', 0)
    setTimeout(() => {
      message.destroy()
      message.success('排名计算完成')
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
      } else {
        message.error(result.message || '保存失败')
      }
    } catch (error) {
      console.error('保存配置失败:', error)
      message.error('保存配置失败')
    }
  }

  // 重启任务
  const handleRestartTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      message.loading('正在重启任务...', 0)
      const result = await restartTasksAPI(token)
      message.destroy()

      if (result.success) {
        message.success('任务重启成功')
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
            手动执行排名计算
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
            重启任务
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

      {/* 说明信息 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InfoCircleOutlined className="text-blue-500 text-lg mt-0.5 mr-2" />
          <div>
            <h4 className="text-blue-800 font-semibold mb-2">定时任务说明</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>
                • <strong>ActionTask</strong>:
                检测玩家动作状态，自动完成已结束的动作
              </li>
              <li>
                • <strong>ActionPlusTask</strong>:
                检测玩家沉迷状态，自动解除已过期的沉迷
              </li>
              <li>
                • <strong>GamesTask</strong>:
                检查游戏锁定状态，自动解除过期的锁定
              </li>
              <li>
                • <strong>SaijiTask</strong>: 赛季结算，发放奖励并开启新赛季
              </li>
              <li>
                • <strong>TempTask</strong>: 处理临时任务，清理过期数据
              </li>
              <li>
                • <strong>RankingTask</strong>: 计算玩家和宗门排名，更新排行榜
              </li>
            </ul>
          </div>
        </div>
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
