import { useProfileCode } from './Profile.code';
import { Card, Tabs, Row, Col, Descriptions, Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Profile() {
  const { activeTab, setActiveTab, loading, passwordForm, handlePasswordChange, handleInputChange, user } = useProfileCode();

  const tabItems = [
    {
      key: 'profile',
      label: '个人信息',
      children: (
        <div className='space-y-6'>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title='用户信息'>
                <div className='text-center mb-4'>
                  <UserOutlined className='text-5xl mb-4' />
                  <h3 className='text-xl font-semibold mb-2'>{user?.username ?? '管理员'}</h3>
                  <p className='text-sm'>系统管理员</p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title='基本信息'>
                <Descriptions column={1}>
                  <Descriptions.Item label='用户名'>{user?.username ?? 'admin'}</Descriptions.Item>
                  <Descriptions.Item label='角色'>超级管理员</Descriptions.Item>
                  <Descriptions.Item label='登录时间'>{new Date().toLocaleString('zh-CN')}</Descriptions.Item>
                  <Descriptions.Item label='账户状态'>正常</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'password',
      label: '修改密码',
      children: (
        <Card title='修改密码'>
          <Form layout='vertical' onFinish={() => { void handlePasswordChange(); }}>
            <Form.Item label='当前密码' required>
              <Input.Password
                name='currentPassword'
                value={passwordForm.currentPassword}
                onChange={handleInputChange('currentPassword')}
                placeholder='请输入当前密码'
              />
            </Form.Item>
            <Form.Item label='新密码' required>
              <Input.Password name='newPassword' value={passwordForm.newPassword} onChange={handleInputChange('newPassword')} placeholder='请输入新密码' />
            </Form.Item>
            <Form.Item label='确认新密码' required>
              <Input.Password
                name='confirmPassword'
                value={passwordForm.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder='请再次输入新密码'
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading} block>
                {loading ? '修改中...' : '修改密码'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    }
  ];

  return (
    <div className='min-h-screen bg-gray-200 p-4'>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </div>
  );
}
