import React from 'react'
import { Modal, Form, Input, Select, InputNumber } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd/es/form'
import type { CurrencyUser, RechargeFormValues } from '@/types/CurrencyManager'

const { Option } = Select

interface RechargeModalProps {
  visible: boolean
  user: CurrencyUser | null
  onCancel: () => void
  onOk: (values: RechargeFormValues) => void
  form: FormInstance
}

export default function RechargeModal({
  visible,
  user,
  onCancel,
  onOk,
  form
}: RechargeModalProps) {
  const [rechargeType, setRechargeType] = React.useState('currency')
  const [targetUserId, setTargetUserId] = React.useState('')

  React.useEffect(() => {
    if (visible) {
      form.resetFields()
      setRechargeType('currency')
      setTargetUserId(user?.id || '')
    }
  }, [visible, form, user])

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-purple-400" />
          <span className="text-white">用户充值</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      className="xiuxian-modal"
    >
      <Form form={form} layout="vertical" onFinish={onOk}>
        <Form.Item
          name="userId"
          label={<span className="text-slate-300">用户ID</span>}
          rules={[{ required: true, message: '请输入用户ID' }]}
        >
          <Input
            placeholder="请输入要充值的用户ID"
            value={targetUserId}
            onChange={e => setTargetUserId(e.target.value)}
            className="xiuxian-input"
          />
        </Form.Item>

        <Form.Item
          name="type"
          label={<span className="text-slate-300">充值类型</span>}
          rules={[{ required: true, message: '请选择充值类型' }]}
        >
          <Select onChange={setRechargeType} className="xiuxian-select">
            <Option value="recharge-currency">金币充值</Option>
            <Option value="recharge-small-month-card">小月卡</Option>
            <Option value="recharge-big-month-card">大月卡</Option>
          </Select>
        </Form.Item>

        {rechargeType === 'recharge-currency' && (
          <>
            <Form.Item
              name="tier"
              label={<span className="text-slate-300">充值档位</span>}
              rules={[{ required: true, message: '请选择充值档位' }]}
            >
              <Select className="xiuxian-select">
                <Option value="6元档">6元档</Option>
                <Option value="30元档">30元档</Option>
                <Option value="98元档">98元档</Option>
                <Option value="128元档">128元档</Option>
                <Option value="328元档">328元档</Option>
                <Option value="628元档">628元档</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="amount"
              label={<span className="text-slate-300">充值金额</span>}
              rules={[{ required: true, message: '请输入充值金额' }]}
            >
              <InputNumber
                min={1}
                max={10000}
                style={{ width: '100%' }}
                placeholder="请输入充值金额"
                className="xiuxian-input"
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="remark"
          label={<span className="text-slate-300">备注</span>}
        >
          <Input.TextArea
            rows={3}
            placeholder="可选备注信息"
            className="xiuxian-input"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
