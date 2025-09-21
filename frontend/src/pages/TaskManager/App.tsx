import React, { useState, useEffect } from 'react';
import { Table, message, Tag, Form } from 'antd';
import { ClockCircleOutlined, PlayCircleOutlined, PauseCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { getTaskConfigAPI, updateTaskConfigAPI, restartTasksAPI, getTaskStatusAPI, taskControlAPI } from '@/api/auth';
import type { ColumnsType } from 'antd/es/table';
import { TaskInfo } from '@/types/types';
import TaskConfig from './TaskConfig';
import StatusTag from './StatusTag';
import formatCron from './config';

// 导入UI组件库
import { XiuxianPageWrapper, XiuxianPageTitle, XiuxianTableContainer } from '@/components/ui';

// 获取类型标签
const getTypeTag = (type: string) => {
  switch (type) {
    case 'system':
      return <Tag color='blue'>系统</Tag>;
    case 'game':
      return <Tag color='green'>游戏</Tag>;
    case 'maintenance':
      return <Tag color='purple'>维护</Tag>;
    default:
      return <Tag color='default'>其他</Tag>;
  }
};

const taskNames: {
  [key: string]: string;
} = {
  ShopTask: '商店刷新',
  ExchangeTask: '冲水堂清理',
  AuctionofficialTask: '拍卖任务',
  ForumTask: '论坛任务',
  ActionsTask: '玩家行动任务',
  MsgTask: '消息任务',
  ShopGradetask: '商店等级任务',
  TiandibangTask: '天地榜任务'
};

export default function TaskManager() {
  const { user } = useAuth();
  const [loading] = useState(false);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [taskConfig, setTaskConfig] = useState<{ [key: string]: string }>({});
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
  const [configForm] = Form.useForm();

  // 根据实际配置生成任务数据
  const generateTasksFromConfig = (
    config: { [key: string]: string },
    taskStatus?: {
      [key: string]: { running: boolean; nextInvocation?: string };
    }
  ): TaskInfo[] => {
    const taskDescriptions: {
      [key: string]: {
        description: string;
        type: 'system' | 'game' | 'maintenance';
      };
    } = {
      ActionsTask: {
        description: '处理玩家行动：魔界、职业、秘境、洗劫、神界、逃跑等任务',
        type: 'game'
      },
      ShopTask: {
        description: '商店商品刷新',
        type: 'system'
      },
      ExchangeTask: {
        description: '清理过期数据',
        type: 'maintenance'
      },
      AuctionofficialTask: {
        description: '拍卖行相关任务',
        type: 'system'
      },
      ForumTask: {
        description: '论坛数据清理',
        type: 'maintenance'
      },
      MsgTask: {
        description: '消息推送任务',
        type: 'system'
      },
      ShopGradetask: {
        description: '商店等级更新',
        type: 'system'
      },
      TiandibangTask: {
        description: '天地榜排名更新',
        type: 'game'
      }
    };

    return Object.entries(config).map(([name, schedule]) => {
      const taskInfo = taskDescriptions[name] || {
        description: name,
        type: 'system' as const
      };
      const status = taskStatus?.[name];

      return {
        name,
        description: taskInfo.description,
        schedule,
        status: status?.running ? 'running' : 'stopped',
        lastRun: new Date().toISOString(),
        nextRun: status?.nextInvocation || new Date(Date.now() + 60000).toISOString(),
        type: taskInfo.type
      };
    });
  };

  // 表格列定义
  const columns: ColumnsType<TaskInfo> = [
    {
      title: (
        <div className='flex items-center gap-2 text-purple-400 font-bold'>
          <span>任务名称</span>
        </div>
      ),
      key: 'name',
      width: 200,
      render: (_, record) => (
        <div>
          <div className='font-bold text-white'>{taskNames[record.name] || record.name}</div>
          <div className='text-xs text-slate-400'>{record.description}</div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-blue-400 font-bold'>
          <span>任务类型</span>
        </div>
      ),
      key: 'type',
      width: 120,
      render: (_, record) => getTypeTag(record.type)
    },
    {
      title: (
        <div className='flex items-center gap-2 text-green-400 font-bold'>
          <span>执行计划</span>
        </div>
      ),
      key: 'schedule',
      width: 200,
      render: (_, record) => (
        <div>
          <div className='text-sm font-medium text-white'>{formatCron(record.schedule)}</div>
          <div className='text-xs text-slate-400'>{record.schedule}</div>
        </div>
      )
    },
    {
      title: (
        <div className='flex items-center gap-2 text-yellow-400 font-bold'>
          <span>运行状态</span>
        </div>
      ),
      key: 'status',
      width: 120,
      render: (_, record) => <StatusTag status={record.status} />
    },
    {
      title: (
        <div className='flex items-center gap-2 text-cyan-400 font-bold'>
          <span>上次执行</span>
        </div>
      ),
      key: 'lastRun',
      width: 180,
      render: (_, record) => <div className='text-sm text-slate-300'>{record.lastRun ? new Date(record.lastRun).toLocaleString('zh-CN') : '未执行'}</div>
    },
    {
      title: (
        <div className='flex items-center gap-2 text-orange-400 font-bold'>
          <span>下次执行</span>
        </div>
      ),
      key: 'nextRun',
      width: 180,
      render: (_, record) => <div className='text-sm text-slate-300'>{record.nextRun ? new Date(record.nextRun).toLocaleString('zh-CN') : '未计划'}</div>
    }
  ];

  // 获取任务配置
  const fetchTaskConfig = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      const result = await getTaskConfigAPI();

      if (result.success && result.data) {
        setTaskConfig(result.data);
        setTasks(generateTasksFromConfig(result.data));
      } else {
        message.error(result.message || '获取配置失败');
      }
    } catch (error) {
      console.error('获取任务配置失败:', error);
      message.error('获取任务配置失败');
    }
  };

  // 获取任务状态
  const fetchTaskStatus = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return;
      }

      const result = await getTaskStatusAPI();

      if (result.success && result.data) {
        setTasks(prevTasks =>
          prevTasks.map(task => ({
            ...task,
            status: result.data![task.name]?.running ? 'running' : 'stopped',
            nextRun: result.data![task.name]?.nextInvocation || new Date(Date.now() + 60000).toISOString()
          }))
        );
      }
    } catch (error) {
      console.error('获取任务状态失败:', error);
    }
  };

  useEffect(() => {
    fetchTaskConfig();
    fetchTaskStatus(); // 启动时也获取一次状态
  }, [user]);

  // 启动所有任务
  const handleStartAllTasks = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      message.loading('正在启动所有任务...', 0);
      const result = await taskControlAPI('startAll');

      message.destroy();

      if (result.success && result.data?.success) {
        message.success('所有任务启动成功');
        // 重新获取配置
        fetchTaskConfig();
      } else {
        message.error(result.message || '启动失败');
      }
    } catch (error) {
      message.destroy();
      console.error('启动任务失败:', error);
      message.error('启动任务失败');
    }
  };

  // 停止所有任务
  const handleStopAllTasks = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      message.loading('正在停止所有任务...', 0);
      const result = await taskControlAPI('stopAll');

      message.destroy();

      if (result.success && result.data?.success) {
        message.success('所有任务停止成功');
        // 重新获取配置
        void fetchTaskConfig();
      } else {
        message.error(result.message || '停止失败');
      }
    } catch (error) {
      message.destroy();
      console.error('停止任务失败:', error);
      message.error('停止任务失败');
    }
  };

  // 重启所有任务
  const handleRestartTasks = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      message.loading('正在重启所有任务...', 0);
      const result = await restartTasksAPI();

      message.destroy();

      if (result.success && result.data?.success) {
        message.success('所有任务重启成功');
        // 重新获取配置
        void fetchTaskConfig();
      } else {
        message.error(result.message || '重启失败');
      }
    } catch (error) {
      message.destroy();
      console.error('重启任务失败:', error);
      message.error('重启任务失败');
    }
  };

  // 打开配置编辑
  const handleOpenConfig = () => {
    setConfigDrawerVisible(true);
  };

  // 保存配置
  const handleSaveConfig = async (values: { [key: string]: string }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');

        return;
      }

      message.loading('正在保存配置...', 0);
      const result = await updateTaskConfigAPI(values);

      message.destroy();

      if (result.success) {
        message.success('配置保存成功');
        setConfigDrawerVisible(false);
        void fetchTaskConfig();
      } else {
        message.error(result.message || '保存失败');
      }
    } catch (error) {
      message.destroy();
      console.error('保存配置失败:', error);
      message.error('保存配置失败');
    }
  };

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon={<ClockCircleOutlined />}
        title='定时任务'
        subtitle='系统定时任务和配置'
        actions={
          <div className='flex flex-wrap gap-2'>
            {[
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
                icon: <ClockCircleOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: handleRestartTasks
              },
              {
                lable: '刷新数据',
                icon: <ClockCircleOutlined />,
                className:
                  'px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2',
                onClick: () => {
                  fetchTaskConfig();
                  message.success('数据已刷新');
                }
              }
            ].map((item, index) => (
              <button key={index} className={item.className} onClick={item.onClick}>
                {item.icon}
                {item.lable}
              </button>
            ))}
          </div>
        }
      />

      {/* 任务表格 */}
      <XiuxianTableContainer title='定时任务列表' icon={<ClockCircleOutlined />}>
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey='name'
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
          rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
          className='bg-transparent xiuxian-table'
        />
      </XiuxianTableContainer>

      {/* 配置编辑抽屉 */}
      <TaskConfig
        configDrawerVisible={configDrawerVisible}
        setConfigDrawerVisible={setConfigDrawerVisible}
        configForm={configForm}
        taskConfig={taskConfig}
        handleSaveConfig={handleSaveConfig}
      />
    </XiuxianPageWrapper>
  );
}
