import React from 'react';
import { configCategories } from '@/config';
import classNames from 'classnames';
import { useConfigManagerCode } from './ConfigManager.code';
import { Modal } from 'antd';

// 导入UI组件库
import { XiuxianPageWrapper, XiuxianPageTitle, XiuxianTabGroup, XiuxianConfigItem } from '@/components/ui';

export default function ConfigManager() {
  const {
    config,
    loading,
    activeTab,
    setActiveTab,
    jsonConfig,
    setJsonConfig,
    message,
    loadConfig,
    handleSave,
    handleConfigChange,
    getConfigValue,
    open,
    setOpen
  } = useConfigManagerCode();

  // 构建标签页数据
  const tabs = configCategories.map(category => ({
    name: category.name,
    icon: category.icon,
    content: (
      <div className='space-y-4'>
        <h3 className='text-white text-xl font-semibold flex items-center'>
          <span className='mr-2'>{category.icon}</span>
          {category.name}
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {category.items.map(item => (
            <XiuxianConfigItem
              key={item.key}
              name={item.name}
              description={item.description}
              type={item.type === 'json' ? 'array' : (item.type as 'string' | 'number' | 'boolean' | 'array')}
              value={getConfigValue(item.key)}
              onChange={value => handleConfigChange(item.key, value)}
            />
          ))}
        </div>
      </div>
    )
  }));

  return (
    <XiuxianPageWrapper>
      {/* 页面标题和操作按钮 */}
      <XiuxianPageTitle
        icon='⚙️'
        title='配置管理'
        subtitle='管理系统配置参数'
        actions={
          <div className='flex space-x-3'>
            <button
              onClick={loadConfig}
              disabled={loading}
              className='px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50'
            >
              <span className='mr-2'>🔄</span>
              {loading ? '刷新中...' : '刷新配置'}
            </button>
            <button
              onClick={() => setOpen(true)}
              className='px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50'
            >
              <span className='mr-2'>🔄</span>
              JSON编辑
            </button>
            {activeTab !== 'JSON编辑' && (
              <button
                onClick={() => config && handleSave(config)}
                disabled={loading || !config}
                className='px-2 py-1 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='mr-2'>💾</span>
                {loading ? '保存中...' : '保存配置'}
              </button>
            )}
          </div>
        }
      />

      {/* 标签页组 */}
      <XiuxianTabGroup tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <Modal
        className='xiuxian-modal'
        title='JSON配置'
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          try {
            const parsed = JSON.parse(jsonConfig);
            handleSave(parsed);
            setOpen(false);
          } catch (error) {
            console.error(error);
            message.error('JSON格式错误');
          }
        }}
        cancelText='取消'
        okText='确定'
      >
        <div>
          <div className='mb-4'>
            <textarea
              value={jsonConfig}
              onChange={e => setJsonConfig(e.target.value)}
              className='w-full h-96 p-4 xiuxian-input rounded-xl font-mono text-sm'
              placeholder='请输入JSON格式的配置...'
            />
          </div>
        </div>
      </Modal>
    </XiuxianPageWrapper>
  );
}
