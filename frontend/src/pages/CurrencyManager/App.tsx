import { useEffect } from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { useCurrencyManager } from './hooks/useCurrencyManager';
import StatsCards from './components/StatsCards';
import TabNavigation from './components/TabNavigation';
import UserCurrencyTab from './components/UserCurrencyTab';
import RechargeRecordsTab from './components/RechargeRecordsTab';
import StatsTab from './components/StatsTab';
import RechargeModal from './components/RechargeModal';

export default function CurrencyManager() {
  const {
    loading,
    users,
    records,
    stats,
    config,
    selectedTab,
    rechargeModalVisible,
    selectedUser,
    rechargeForm,
    setSelectedTab,
    setRechargeModalVisible,
    setSelectedUser,
    fetchUsers,
    fetchRecords,
    fetchStats,
    fetchConfig,
    handleRechargeOk
  } = useCurrencyManager();

  useEffect(() => {
    void fetchUsers();
    void fetchStats();
  }, []);

  const handleRefresh = () => {
    void fetchUsers();
    void fetchRecords();
    void fetchStats();
    void fetchConfig();
  };

  return (
    <div className='p-4 bg-slate-200'>
      {/* 页面标题和操作按钮 */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>货币管理系统</Typography.Title>
          <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>管理用户金币、月卡和充值记录</Typography.Paragraph>
        </div>
        <Space>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedUser(null);
              setRechargeModalVisible(true);
            }}
          >
            充值
          </Button>
          <Button icon={<ReloadOutlined spin={loading} />} loading={loading} onClick={handleRefresh}>
            刷新数据
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      {stats && <StatsCards stats={stats} />}

      {/* 标签页导航 */}
      <TabNavigation
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onRecordsTabClick={() => {
          setSelectedTab('records');
          void fetchRecords();
        }}
      />

      {/* 内容区域 */}
      <Card
        title={
          (selectedTab === 'users' && '用户货币管理') || (selectedTab === 'records' && '充值记录管理') || (selectedTab === 'stats' && '统计分析') || '货币管理'
        }
      >
        {/* 用户货币管理 */}
        {selectedTab === 'users' && <UserCurrencyTab users={users} loading={loading} onRefresh={fetchUsers} onStatsRefresh={fetchStats} />}

        {/* 充值记录管理 */}
        {selectedTab === 'records' && <RechargeRecordsTab records={records} loading={loading} config={config} />}

        {/* 统计分析 */}
        {selectedTab === 'stats' && <StatsTab stats={stats} />}
      </Card>

      {/* 充值弹窗 */}
      <RechargeModal
        visible={rechargeModalVisible}
        user={selectedUser}
        config={config}
        users={users}
        onCancel={() => {
          setRechargeModalVisible(false);
          setSelectedUser(null);
          rechargeForm.resetFields();
        }}
        onOk={(values) => { void handleRechargeOk(values); }}
        form={rechargeForm}
      />
    </div>
  );
}
