import { Drawer, Form, Input, FormInstance } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

export const TaskConfig = ({
  configDrawerVisible,
  setConfigDrawerVisible,
  configForm,
  taskConfig,
  handleSaveConfig
}: {
  configDrawerVisible: boolean;
  setConfigDrawerVisible: (visible: boolean) => void;
  configForm: FormInstance<Record<string, string>>;
  taskConfig: Record<string, string>;
  handleSaveConfig: (values: { [key: string]: string }) => void;
}) => {
  const saveConfig = async () => {
    try {
      const values = await configForm.validateFields();

      handleSaveConfig(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Drawer
      title={
        <div className='flex items-center gap-2'>
          <span className=' text-lg font-bold'>编辑定时任务配置</span>
        </div>
      }
      placement='right'
      width={600}
      open={configDrawerVisible}
      onClose={() => setConfigDrawerVisible(false)}
      className='custom-drawer'
      styles={{
        body: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          color: 'white'
        },
        header: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }}
      extra={
        <button
          className='px-4 py-2  from-purple-500 to-pink-500  rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200   flex items-center gap-2'
          onClick={() => void saveConfig()}
        >
          <SaveOutlined />
          保存配置
        </button>
      }
    >
      <Form form={configForm} layout='vertical' className='custom-form'>
        {Object.keys(taskConfig).map(taskName => (
          <Form.Item
            key={taskName}
            label={<span className=' font-medium'>{taskName}</span>}
            name={taskName}
            rules={[{ required: true, message: '请输入Cron表达式' }]}
            className='custom-form-item'
          >
            <Input placeholder='请输入Cron表达式，如: 0 0/1 * * * ?' className='xiuxian-input' />
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
};

export default TaskConfig;
