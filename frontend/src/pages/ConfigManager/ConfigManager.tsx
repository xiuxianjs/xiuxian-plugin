import { configCategories } from '@/config';
import { useConfigManagerCode } from './ConfigManager.code';
import { Modal, Button, Tabs, Input, InputNumber, Switch, Card, Tag, Space } from 'antd';
import { ReloadOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

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

  // 渲染配置项的输入组件
  const renderConfigInput = (item: any) => {
    const value = getConfigValue(item.key);
    const itemType = item.type === 'json' ? 'array' : item.type;

    return (
      <Card key={item.key} size='small'>
        <div className='flex justify-between items-center mb-2'>
          <label className='font-medium'>{item.name}</label>
          <Tag>{itemType.toUpperCase()}</Tag>
        </div>
        <p className='text-xs mb-3'>{item.description}</p>

        {itemType === 'boolean' ? (
          <div>
            <Switch checked={!!value} onChange={checked => handleConfigChange(item.key, checked)} />
            <span className='ml-2'>{value ? '启用' : '禁用'}</span>
          </div>
        ) : itemType === 'array' ? (
          <TextArea
            value={JSON.stringify(value ?? [], null, 2)}
            onChange={e => {
              try {
                const parsedValue = JSON.parse(e.target.value);

                handleConfigChange(item.key, parsedValue);
              } catch (error) {
                console.error(error);
              }
            }}
            rows={3}
            placeholder='请输入JSON数组格式'
            className='font-mono text-xs'
          />
        ) : itemType === 'number' ? (
          <InputNumber value={value as number} onChange={val => handleConfigChange(item.key, val ?? 0)} className='w-full' placeholder={`请输入${item.name}`} />
        ) : (
          <Input value={String(value ?? '')} onChange={e => handleConfigChange(item.key, e.target.value)} placeholder={`请输入${item.name}`} />
        )}
      </Card>
    );
  };

  // 构建标签页数据
  const tabItems = configCategories.map(category => ({
    key: category.name,
    label: (
      <span>
        {category.icon && <span className='mr-2'>{category.icon}</span>}
        {category.name}
      </span>
    ),
    children: (
      <div>
        <h3 className='mb-4 text-lg font-semibold'>
          {category.icon && <span className='mr-2'>{category.icon}</span>}
          {category.name}
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{category.items.map(item => renderConfigInput(item))}</div>
      </div>
    )
  }));

  return (
    <div className='min-h-screen bg-gray-200 p-4'>
      {/* 页面标题和操作按钮 */}
      <div className='flex justify-between items-center mb-6 flex-wrap gap-4'>
        <div>
          <h1 className='text-2xl font-bold m-0'>配置管理</h1>
          <p className='text-sm mt-2 mb-0'>管理系统配置参数</p>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined spin={loading} />} onClick={() => { void loadConfig(); }} disabled={loading}>
            {loading ? '刷新中...' : '刷新配置'}
          </Button>
          <Button icon={<EditOutlined />} onClick={() => setOpen(true)}>
            JSON编辑
          </Button>
          {activeTab !== 'JSON编辑' && (
            <Button type='primary' icon={<SaveOutlined />} onClick={() => { if (config) { void handleSave(config); } }} disabled={loading || !config}>
              {loading ? '保存中...' : '保存配置'}
            </Button>
          )}
        </Space>
      </div>

      {/* 标签页组 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      <Modal
        title='JSON配置'
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          try {
            const parsed = JSON.parse(jsonConfig);

            void handleSave(parsed);
            setOpen(false);
          } catch (error) {
            console.error(error);
            message.error('JSON格式错误');
          }
        }}
        cancelText='取消'
        okText='确定'
        width={800}
      >
        <TextArea value={jsonConfig} onChange={e => setJsonConfig(e.target.value)} rows={20} placeholder='请输入JSON格式的配置...' className='font-mono' />
      </Modal>
    </div>
  );
}
