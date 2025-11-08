import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Tabs, Card, Row, Col, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Najie, NajieItem } from '@/types/types';

interface NajieEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (najie: Najie) => void;
  najie: Najie | null;
  loading?: boolean;
}

// 物品分类配置
const ITEM_CATEGORIES = [
  { key: '装备', label: '装备' },
  { key: '丹药', label: '丹药' },
  { key: '道具', label: '道具' },
  { key: '功法', label: '功法' },
  { key: '草药', label: '草药' },
  { key: '材料', label: '材料' },
  { key: '仙宠', label: '仙宠' },
  { key: '仙宠口粮', label: '仙宠口粮' }
];

export default function NajieEditModal({ visible, onCancel, onSave, najie, loading = false }: NajieEditModalProps) {
  const [form] = Form.useForm();
  const [editingNajie, setEditingNajie] = useState<Najie | null>(null);

  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (visible && najie) {
      setEditingNajie({ ...najie });
      form.setFieldsValue({
        userId: najie.userId,
        灵石: najie.灵石,
        灵石上限: najie.灵石上限,
        等级: najie.等级
      });
    }
  }, [visible, najie, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingNajie) {
        const updatedNajie: Najie = {
          ...editingNajie,
          userId: values.userId,
          灵石: values.灵石,
          灵石上限: values.灵石上限,
          等级: values.等级
        };

        onSave(updatedNajie);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const addItem = (category: string) => {
    // 如果输入框为空，则不添加
    if (!inputValue) {
      return;
    }

    if (!editingNajie) {
      return;
    }

    if ((editingNajie[category as keyof Najie] as NajieItem[]).some(item => item.name === inputValue)) {
      message.error('已存在该物品');

      return;
    }

    console.log('添加物品到分类:', category);

    const newItem: NajieItem = {
      name: inputValue,
      grade: '',
      pinji: 1,
      数量: 1
    };

    setEditingNajie({
      ...editingNajie,
      [category]: [...((editingNajie[category as keyof Najie] as NajieItem[]) || []), newItem]
    });
  };

  const removeItem = (category: string, index: number) => {
    if (!editingNajie) {
      return;
    }

    const items = (editingNajie[category as keyof Najie] as NajieItem[]) || [];
    const updatedItems = items.filter((_, i) => i !== index);

    setEditingNajie({
      ...editingNajie,
      [category]: updatedItems
    });
  };

  const updateItem = (category: string, index: number, field: keyof NajieItem, value: string | number | undefined | null) => {
    if (!editingNajie) {
      return;
    }

    const items = (editingNajie[category as keyof Najie] as NajieItem[]) || [];
    const updatedItems = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));

    setEditingNajie({
      ...editingNajie,
      [category]: updatedItems
    });
  };

  const renderItemCard = (item: NajieItem, category: string, index: number) => (
    <Card key={index} className='mb-3' size='small'>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Input placeholder='物品名称' value={item.name} onChange={e => updateItem(category, index, 'name', e.target.value)} />
        </Col>
        <Col span={4}>
          <Input placeholder='品质' value={item.grade} onChange={e => updateItem(category, index, 'grade', e.target.value)} />
        </Col>
        <Col span={3}>
          <InputNumber placeholder='品级' value={item.pinji} onChange={value => updateItem(category, index, 'pinji', value)} className='w-full' min={1} />
        </Col>
        <Col span={3}>
          <InputNumber placeholder='数量' value={item.数量} onChange={value => updateItem(category, index, '数量', value)} className='w-full' min={1} />
        </Col>
        <Col span={3}>
          <InputNumber placeholder='攻击' value={item.atk} onChange={value => updateItem(category, index, 'atk', value)} className='w-full' />
        </Col>
        <Col span={3}>
          <Button type='text' danger icon={<DeleteOutlined />} onClick={() => removeItem(category, index)} />
        </Col>
      </Row>
    </Card>
  );

  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <span>编辑背包</span>
          <span>用户ID: {najie?.userId}</span>
        </div>
      }
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
        {/* 基本信息 */}
        <Card>
          <Form form={form} layout='vertical'>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label={'用户ID'} name='userId' rules={[{ required: true, message: '请输入用户ID' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={'灵石'} name='灵石' rules={[{ required: true, message: '请输入灵石数量' }]}>
                  <InputNumber
                    className='w-full'
                    min={0}
                    formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={'灵石上限'} name='灵石上限'>
                  <InputNumber
                    className='w-full'
                    min={0}
                    formatter={(value: number | string | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? ''}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 物品分类编辑 */}
        <Tabs
          type='card'
          tabBarGutter={8}
          items={ITEM_CATEGORIES.map(category => ({
            key: category.key,
            label: (
              <span>
                {category.label} (
                {Array.isArray(editingNajie?.[category.key as keyof Najie]) ? ((editingNajie?.[category.key as keyof Najie] as NajieItem[])?.length ?? 0) : 0})
              </span>
            ),
            children: (
              <div className='p-4'>
                <div className='flex justify-between items-center mb-4'>
                  <span className='font-medium'>{category.label}</span>
                  <div className='flex gap-6'>
                    <Input value={inputValue} onChange={e => setInputValue(e.target.value)} style={{ maxWidth: 160 }} />
                    <Button type='primary' icon={<PlusOutlined />} onClick={() => addItem(category.key)}>
                      添加物品
                    </Button>
                  </div>
                </div>

                <div className='space-y-2'>
                  {((editingNajie?.[category.key as keyof Najie] as NajieItem[]) ?? []).map((item, index) => renderItemCard(item, category.key, index))}
                </div>

                {(() => {
                  const items = editingNajie?.[category.key as keyof Najie];

                  return !items || !Array.isArray(items) || items.length === 0;
                })() && <div className='text-center py-8'>暂无{category.label}，点击上方按钮添加</div>}
              </div>
            )
          }))}
        />
      </div>
    </Modal>
  );
}
