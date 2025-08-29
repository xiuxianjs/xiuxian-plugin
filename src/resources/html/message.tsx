import React from 'react';
import HTML from './HTML';

interface MessageProps {
  userId: string;
  stats: {
    total: number;
    unread: number;
    read: number;
  };
  messages: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    status: string;
    createTime: string;
    sender: string;
  }>;
  pagination: {
    current: number;
    total: number;
    totalMessages: number;
  };
}

const Message: React.FC<MessageProps> = ({ stats, messages, pagination }) => {
  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '紧急':
        return 'bg-red-500';
      case '高':
        return 'bg-orange-500';
      case '普通':
        return 'bg-green-500';
      case '低':
        return 'bg-gray-500';
      default:
        return 'bg-green-500';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '未读':
        return 'bg-red-500';
      case '已读':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case '系统消息':
        return '⚙️';
      case '公告':
        return '📢';
      case '奖励通知':
        return '🎁';
      case '活动通知':
        return '🎮';
      case '个人消息':
        return '💬';
      default:
        return '📄';
    }
  };

  return (
    <HTML>
      <div className='min-h-[700px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-8 font-sans text-gray-200 rounded-2xl shadow-2xl relative overflow-hidden border border-white/10'>
        {/* 顶部装饰条 */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-t-2xl' />

        {/* 右上角装饰 */}
        <div className='absolute top-5 right-5 w-16 h-16 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full opacity-60' />

        {/* 标题区域 */}
        <div className='text-center mb-9 p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-xl relative'>
          {/* 标题装饰边框 */}
          <div className='absolute top-3 left-3 right-3 bottom-3 border-2 border-yellow-400/30 rounded-xl opacity-50' />

          <h1 className='text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text drop-shadow-lg tracking-wider mb-3'>
            🏮 修仙界传音符 🏮
          </h1>
          <p className='text-lg opacity-80 drop-shadow-md tracking-wide'>
            ✨ 道友，这里是你的专属传音阁 ✨
          </p>
        </div>

        {/* 统计信息卡片 */}
        <div className='grid grid-cols-3 gap-5 mb-8'>
          {/* 总消息数 */}
          <div className='bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 text-center border border-white/10 shadow-lg'>
            <div className='text-3xl mb-2'>📊</div>
            <div className='text-3xl font-bold text-yellow-400 mb-1'>{stats.total}</div>
            <div className='text-sm opacity-80 tracking-wide'>总消息数</div>
          </div>

          {/* 未读消息 */}
          <div className='bg-gradient-to-br from-red-500/15 to-red-500/5 rounded-xl p-5 text-center border border-red-500/30 shadow-lg'>
            <div className='text-3xl mb-2'>🔴</div>
            <div className='text-3xl font-bold text-red-400 mb-1'>{stats.unread}</div>
            <div className='text-sm opacity-80 tracking-wide'>未读消息</div>
          </div>

          {/* 已读消息 */}
          <div className='bg-gradient-to-br from-green-500/15 to-green-500/5 rounded-xl p-5 text-center border border-green-500/30 shadow-lg'>
            <div className='text-3xl mb-2'>🟢</div>
            <div className='text-3xl font-bold text-green-400 mb-1'>{stats.read}</div>
            <div className='text-sm opacity-80 tracking-wide'>已读消息</div>
          </div>
        </div>

        {/* 消息列表容器 */}
        <div className='bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 mb-6 border border-white/10 shadow-xl min-h-[300px]'>
          {messages.length === 0 ? (
            <div className='text-center py-16 px-5 text-xl opacity-70 bg-white/5 rounded-xl border border-dashed border-white/20'>
              <div className='text-5xl mb-4'>🕊️</div>
              <div>暂无传音消息，静待佳音...</div>
              <div className='text-sm mt-3 opacity-50'>道友可静心修炼，等待机缘</div>
            </div>
          ) : (
            <div className='space-y-5'>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className='bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border-2 border-opacity-40 shadow-lg relative'
                  style={{
                    borderColor:
                      getStatusColor(message.status).replace('bg-', '') === 'red-500'
                        ? '#ef4444'
                        : getStatusColor(message.status).replace('bg-', '') === 'green-500'
                          ? '#22c55e'
                          : '#6b7280'
                  }}
                >
                  {/* 消息状态指示器 */}
                  <div
                    className='absolute top-0 left-0 right-0 h-1 rounded-t-xl'
                    style={{
                      background: `linear-gradient(90deg, ${
                        getStatusColor(message.status).replace('bg-', '') === 'red-500'
                          ? '#ef4444'
                          : getStatusColor(message.status).replace('bg-', '') === 'green-500'
                            ? '#22c55e'
                            : '#6b7280'
                      }, ${
                        getStatusColor(message.status).replace('bg-', '') === 'red-500'
                          ? '#ef444480'
                          : getStatusColor(message.status).replace('bg-', '') === 'green-500'
                            ? '#22c55e80'
                            : '#6b728080'
                      })`
                    }}
                  />

                  {/* 消息头部 */}
                  <div className='flex justify-between items-start mb-4 gap-4'>
                    <div className='flex items-center gap-3 flex-1'>
                      <div className='text-2xl w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg border border-white/20'>
                        {getTypeIcon(message.type)}
                      </div>
                      <div className='flex-1'>
                        <div className='text-lg font-bold text-yellow-400 mb-1 drop-shadow-md'>
                          {message.title}
                        </div>
                        <div className='text-xs opacity-60 tracking-wide'>📤 {message.sender}</div>
                      </div>
                    </div>

                    <div className='flex gap-2 items-center'>
                      <span
                        className={`px-3 py-1.5 rounded-md text-xs font-bold text-white drop-shadow-sm tracking-wide ${getPriorityColor(message.priority)}`}
                      >
                        {message.priority}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-md text-xs font-bold text-white drop-shadow-sm tracking-wide ${getStatusColor(message.status)}`}
                      >
                        {message.status}
                      </span>
                    </div>
                  </div>

                  {/* 消息内容 */}
                  <div className='text-base leading-relaxed mb-4 p-4 bg-black/20 rounded-lg border border-white/5 drop-shadow-sm'>
                    {message.content}
                  </div>

                  {/* 消息底部信息 */}
                  <div className='flex justify-between items-center text-xs opacity-70 pt-3 border-t border-white/10'>
                    <div className='flex gap-5'>
                      <span className='flex items-center gap-1'>
                        <span>📅</span>
                        {message.createTime}
                      </span>
                    </div>
                    <span className='text-yellow-400 font-bold text-sm drop-shadow-sm'>
                      #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分页信息 */}
        <div className='text-center text-base opacity-80 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 shadow-lg flex justify-center gap-8 items-center'>
          <span className='flex items-center gap-2'>
            <span>📄</span>第 {pagination.current} 页，共 {pagination.total} 页
          </span>
          <span className='flex items-center gap-2'>
            <span>📊</span>
            总计 {pagination.totalMessages} 条消息
          </span>
        </div>

        {/* 底部装饰 */}
        <div className='text-center mt-6 pt-5 border-t-2 border-yellow-400/30 text-sm opacity-70 tracking-widest drop-shadow-md'>
          🏮 修仙界传音阁 · 道友专属服务 🏮
        </div>

        {/* 左下角装饰 */}
        <div className='absolute bottom-5 left-5 w-10 h-10 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full opacity-40' />
      </div>
    </HTML>
  );
};

export default Message;
