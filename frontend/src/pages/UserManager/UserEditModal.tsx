import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Tabs, Row, Col } from 'antd';
import { SaveOutlined, UserOutlined, SafetyOutlined, GoldOutlined, CrownOutlined } from '@ant-design/icons';
import { GameUser } from '@/types/types';
import { levelNames } from '@/config';

const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (user: GameUser) => void;
  user: GameUser | null;
  loading?: boolean;
  getSexDisplay: (sex: string) => string;
  getLinggenColor: (linggen: unknown) => string;
}

export default function UserEditModal({ visible, onCancel, onSave, user, loading = false }: UserEditModalProps) {
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<GameUser | null>(null);

  useEffect(() => {
    if (visible && user) {
      setEditingUser({ ...user });
      form.setFieldsValue({
        id: user.id,
        名号: user.名号,
        sex: user.sex,
        level_id: user.level_id,
        宣言: user.宣言,
        攻击: user.攻击,
        防御: user.防御,
        当前血量: user.当前血量,
        血量上限: user.血量上限,
        暴击率: user.暴击率,
        暴击伤害: user.暴击伤害,
        灵石: user.灵石,
        神石: user.神石,
        轮回点: user.轮回点,
        修为: user.修为,
        血气: user.血气,
        favorability: user.favorability,
        镇妖塔层数: user.镇妖塔层数,
        神魄段数: user.神魄段数,
        魔道值: user.魔道值,
        lunhui: user.lunhui,
        连续签到天数: user.连续签到天数,
        幸运: user.幸运
      });
    }
  }, [visible, user, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        const updatedUser: GameUser = {
          ...editingUser,
          ...values
        };

        onSave(updatedUser);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={(<div className='flex items-center gap-2'><span>编辑用户</span><span>用户ID: {user?.id}</span></div>)}
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          取消
        </Button>,
        <Button
          key='save'
          type='primary'
          icon={<SaveOutlined />}
          onClick={() => {
            void handleSave();
          }}
          loading={loading}
        >
          保存
        </Button>
      ]}
      className=''
    >
      <div className='space-y-6'>
        <Form form={form} layout='vertical'>
          <Tabs
            type='card'
            items={[
              {
                key: 'basic',
                label: (
                  <span className='transition-colors flex items-center gap-2'>
                    <UserOutlined />
                    基础信息
                  </span>
                ),
                children: (
                  <div className='p-4'>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label={'用户ID'} name='id' rules={[{ required: true, message: '请输入用户ID' }]}>
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={'名号'} name='名号' rules={[{ required: true, message: '请输入名号' }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={'性别'} name='sex'>
                          <Select>
                            <Option value='男'>男</Option>
                            <Option value='女'>女</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label={'境界'} name='level_id'>
                          <Select>
                            {Object.entries(levelNames).map(([id, name]) => (
                              <Option key={id} value={parseInt(id)}>
                                {name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item label={'宣言'} name='宣言'>
                          <Input.TextArea rows={2} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              },
              {
                key: 'combat',
                label: (
                  <span className='transition-colors flex items-center gap-2'>
                    <SafetyOutlined />
                    战斗属性
                  </span>
                ),
                children: (
                  <div className='p-4'>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item label={'攻击力'} name='攻击'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'防御力'} name='防御'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'当前血量'} name='当前血量'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'血量上限'} name='血量上限'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'暴击率'} name='暴击率'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            max={1}
                            step={0.01}
                            formatter={(value: number | string | undefined) => `${(Number(value) * 100).toFixed(2)}%`}
                            parser={(value: string | undefined) => (value?.replace('%', '') ? Number(value?.replace('%', '')) / 100 : 0)}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'暴击伤害'} name='暴击伤害'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}%`}
                            parser={(value: string | undefined) => value?.replace('%', '') ?? 0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              },
              {
                key: 'resources',
                label: (
                  <span className='transition-colors flex items-center gap-2'>
                    <GoldOutlined />
                    修仙资源
                  </span>
                ),
                children: (
                  <div className='p-4'>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item label={'灵石'} name='灵石'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'神石'} name='神石'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'轮回点'} name='轮回点'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'修为'} name='修为'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'血气'} name='血气'>
                          <InputNumber
                            className='w-full'
                            min={0}
                            formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'好感度'} name='favorability'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              },
              {
                key: 'achievements',
                label: (
                  <span className='transition-colors flex items-center gap-2'>
                    <CrownOutlined />
                    修仙成就
                  </span>
                ),
                children: (
                  <div className='p-4'>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item label={'镇妖塔层数'} name='镇妖塔层数'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'神魄段数'} name='神魄段数'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'魔道值'} name='魔道值'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'轮回次数'} name='lunhui'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'连续签到天数'} name='连续签到天数'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label={'幸运值'} name='幸运'>
                          <InputNumber
                            className='w-full'
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              }
            ]}
          />
        </Form>
      </div>
    </Modal>
  );
}
