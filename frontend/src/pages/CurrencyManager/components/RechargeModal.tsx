import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Card, Tag, Divider, Radio } from 'antd';
import { DollarOutlined, GiftOutlined, CrownOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import type { CurrencyUser, RechargeFormValues } from '@/types/CurrencyManager';

// 导入UI组件库
import dayjs from 'dayjs';

const { Option } = Select;

interface RechargeModalProps {
  visible: boolean;
  user: CurrencyUser | null;
  onCancel: () => void;
  onOk: (values: RechargeFormValues) => void;
  form: FormInstance;
  config?: any; // 配置信息
  users?: CurrencyUser[]; // 用户列表
}

export default function RechargeModal({ visible, user, onCancel, onOk, form, config, users = [] }: RechargeModalProps) {
  const [rechargeType, setRechargeType] = useState('currency');
  const [targetUserId, setTargetUserId] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<CurrencyUser | null>(null);
  const [inputMode, setInputMode] = useState<'manual' | 'select'>('select');

  useEffect(() => {
    if (visible) {
  form.resetFields();
  setRechargeType('currency');
  setTargetUserId(user?.id ?? '');
      setSelectedUser(user);
      setSelectedTier('');
      setPreviewData(null);
      setInputMode('select');
    }
  }, [visible, form, user]);

  // 当档位变化时更新预览数据
  useEffect(() => {
    if (selectedTier && config?.rechargeTiers) {
      const tierData = config.rechargeTiers.find((tier: any) => tier.name === selectedTier);

      if (tierData) {
        setPreviewData(tierData);
      }
    } else if (selectedTier && config?.monthCardConfig) {
      if (selectedTier === config.monthCardConfig.SMALL.name) {
        setPreviewData(config.monthCardConfig.SMALL);
      } else if (selectedTier === config.monthCardConfig.BIG.name) {
        setPreviewData(config.monthCardConfig.BIG);
      }
    }
  }, [selectedTier, config]);

  const handleTierChange = (value: string) => {
    setSelectedTier(value);
    form.setFieldsValue({ tier: value });
  };

  const handleRechargeTypeChange = (value: string) => {
    setRechargeType(value);
    setSelectedTier('');
    setPreviewData(null);
    form.setFieldsValue({ tier: undefined });
  };

  const handleUserSelect = (userId: string) => {
    setTargetUserId(userId);
    const user = users.find(u => u.id === userId);

  setSelectedUser(user ?? null);
    form.setFieldsValue({ userId });
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = e.target.value;

    setTargetUserId(userId);
    setSelectedUser(null);
    form.setFieldsValue({ userId });
  };

  const handleInputModeChange = (mode: 'manual' | 'select') => {
    setInputMode(mode);
    setTargetUserId('');
    setSelectedUser(null);
    form.setFieldsValue({ userId: undefined });
  };

  // 用户输入组件
  const UserInput = () => (
  <Form.Item name='userId' label={'用户ID'} rules={[{ required: true, message: '请输入或选择用户ID' }]}>
      <div className='space-y-3'>
        <Radio.Group
          value={inputMode}
          onChange={value => handleInputModeChange(value.target.value)}
          options={[
            { value: 'select', label: '从列表选择' },
            { value: 'manual', label: '手动输入' }
          ]}
          size='small'
          className='mb-3'
        />

        {inputMode === 'select' ? (
          <Select
            showSearch
            placeholder='搜索并选择用户'
            value={targetUserId}
            onChange={handleUserSelect}
            filterOption={(input, option) => {
              const children = option?.children as React.ReactNode;

              if (typeof children === 'string') {
                return children.toLowerCase().includes(input.toLowerCase());
              }

              return false;
            }}
            className=''
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <div className='px-3 py-2'>共 {users.length} 个用户</div>
              </div>
            )}
          >
            {users.map(user => (
              <Option key={user.id} value={user.id}>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono'>{user.id}</span>
                    {user.is_first_recharge && (
                      <Tag color='gold'>
                        <CrownOutlined /> 首充
                      </Tag>
                    )}
                  </div>
                  <div>
                    ¥{user.currency} | {user.total_recharge_count}次
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        ) : (
          <Input placeholder='请输入用户ID' value={targetUserId} onChange={handleManualInput} />
        )}
      </div>
    </Form.Item>
  );

  return (
    <Modal
      title={(<div className='flex items-center gap-2'><DollarOutlined /> <span>用户充值</span></div>)}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={700}
  className=''
    >
      <Form form={form} layout='vertical' onFinish={onOk}>
        {/* 用户输入组件 */}
        <UserInput />

        {/* 选中用户信息 */}
        {selectedUser && (
          <Card className='mb-4' size='small'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div>
                  用户ID: <span className='font-mono'>{selectedUser.id}</span>
                </div>
                <div>
                  金币余额: <span>{selectedUser.currency.toLocaleString()}</span>
                </div>
                <div>
                  总充值: <span>¥{selectedUser.total_recharge_amount}</span>
                </div>
              </div>
              <div>
                <div>
                  充值次数: <span>{selectedUser.total_recharge_count}</span>
                </div>
                <div>
                  小月卡: <span>{dayjs(selectedUser.small_month_card_expire_time).diff(dayjs(), 'day') + 1}天</span>
                </div>
                <div>
                  大月卡: <span>{dayjs(selectedUser.big_month_card_expire_time).diff(dayjs(), 'day') + 1}天</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Form.Item name='type' label={'充值类型'} rules={[{ required: true, message: '请选择充值类型' }]}>
          <Select onChange={handleRechargeTypeChange} className=''>
            <Option value='recharge-currency'>金币充值</Option>
            <Option value='recharge-small-month-card'>小月卡</Option>
            <Option value='recharge-big-month-card'>大月卡</Option>
          </Select>
        </Form.Item>

        {rechargeType === 'recharge-currency' && (
          <Form.Item name='tier' label={'充值档位'} rules={[{ required: true, message: '请选择充值档位' }]}>
            <Select onChange={handleTierChange} className='' placeholder='请选择充值档位'>
              {config?.rechargeTiers?.map((tier: any) => (
                <Option key={tier.key} value={tier.name}>
                  {tier.name} (¥{tier.amount})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* 预览卡片 */}
        {previewData && (
          <Card className='mb-4' size='small'>
            <div className='text-center'>
              <div className='mb-2'>{previewData.name}</div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div>
                    价格: <span>¥{previewData.amount ?? previewData.price}</span>
                  </div>
                  {previewData.currencyGained && (
                    <div>
                      获得金币: <span>{previewData.currencyGained}</span>
                    </div>
                  )}
                  {previewData.days && (
                    <div>
                      月卡天数: <span>{previewData.days}天</span>
                    </div>
                  )}
                </div>
                <div>
                  {previewData.firstRechargeBonus && (
                    <div className='flex items-center gap-1'>
                      <GiftOutlined />
                      首充奖励: <span>{previewData.firstRechargeBonus}金币</span>
                    </div>
                  )}
                  {selectedUser?.is_first_recharge && (
                    <Tag color='gold' className='mt-1'>
                      <CrownOutlined /> 首充用户
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Form.Item name='remark' label={'备注'}>
          <Input.TextArea rows={3} placeholder='可选备注信息' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
