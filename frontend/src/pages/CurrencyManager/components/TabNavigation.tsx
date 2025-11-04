import { UserOutlined, HistoryOutlined, BarChartOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';

interface TabNavigationProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  onRecordsTabClick: () => void;
}

export default function TabNavigation({ selectedTab, onTabChange, onRecordsTabClick }: TabNavigationProps) {
  const handleTabChange = (value: string | number) => {
    const tabName = value as string;

    if (tabName === 'records') {
      onRecordsTabClick();
    } else {
      onTabChange(tabName);
    }
  };

  return (
    <div className='mb-6'>
      <Segmented
        value={selectedTab}
        onChange={handleTabChange}
        options={[
          { label: '用户货币', value: 'users', icon: <UserOutlined /> },
          { label: '充值记录', value: 'records', icon: <HistoryOutlined /> },
          { label: '统计分析', value: 'stats', icon: <BarChartOutlined /> }
        ]}
        block
      />
    </div>
  );
}
