import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { getDataListAPI } from '@/api/auth';
import { pageSize } from '@/config';

// 数据类型映射
const DATA_TYPE_MAP = {
  Talent: '灵根列表',
  Monster: '怪物列表',
  Commodity: '商品列表',
  Level1: '练气境界',
  ScoreShop: '积分商城',
  Level2: '炼体境界',
  Equipment: '装备列表',
  Danyao: '丹药列表',
  NewDanyao: '炼丹师丹药',
  Daoju: '道具列表',
  Gongfa: '功法列表',
  Caoyao: '草药列表',
  Didian: '地点列表',
  Bless: '洞天福地',
  GuildSecrets: '宗门秘境',
  ForbiddenArea: '禁地列表',
  FairyRealm: '仙境列表',
  TimePlace: '限定仙府',
  TimeGongfa: '限定功法',
  TimeEquipment: '限定装备',
  TimeDanyao: '限定丹药',
  Occupation: '职业列表',
  experience: '经验配置',
  Danfang: '炼丹配方',
  Tuzhi: '装备图纸',
  Bapin: '八品',
  Xingge: '星阁拍卖行',
  Tianditang: '天地堂',
  Changzhuxianchon: '常驻仙宠',
  Xianchon: '仙宠列表',
  Xianchonkouliang: '仙宠口粮',
  NPC: 'NPC列表',
  Shop: '商店列表',
  Qinglong: '青龙',
  Qilin: '麒麟',
  Xuanwu: '玄武朱雀白虎',
  Mojie: '魔界列表',
  ExchangeItem: '兑换列表',
  Shenjie: '神界列表',
  Jineng1: '技能列表1',
  Jineng2: '技能列表2',
  Qianghua: '强化列表',
  Duanzhaocailiao: '锻造材料',
  Duanzhaowuqi: '锻造武器',
  Duanzhaohuju: '锻造护具',
  Duanzhaobaowu: '锻造宝物',
  Yincang: '隐藏灵根',
  Zalei: '锻造杂类',
  Jineng: '技能列表',
  UpdateRecord: '更新记录'
};

// 定义数据项类型
interface DataItem {
  [key: string]: string | number | boolean | object;
}

export const useDataQueryCode = () => {
  const { user } = useAuth();
  const [dataTypes] = useState(Object.keys(DATA_TYPE_MAP));
  const [selectedDataType, setSelectedDataType] = useState<string>('');
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [originalData, setOriginalData] = useState<DataItem[]>([]);

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSize,
    total: 0
  });

  // 获取数据类型显示名称
  const getDataTypeDisplayName = (type: string) => {
  return DATA_TYPE_MAP[type as keyof typeof DATA_TYPE_MAP] ?? type;
  };

  // 获取数据列表
  const fetchDataList = async (dataType: string, page = 1, pSize = pageSize) => {
    if (!dataType || !user) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('未找到登录令牌');
        setDataList([]);

        return;
      }

      const result = await getDataListAPI(dataType, {
        page,
        pageSize: pSize,
        search: searchText
      });

      if (result.success && result.data) {
        setDataList(result.data.list ?? []);
        setPagination({
          current: result.data.pagination.current,
          pageSize: result.data.pagination.pageSize,
          total: result.data.pagination.total
        });
      } else {
        message.error(result.message ?? '获取数据失败');
        setDataList([]);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理数据类型变化
  const handleDataTypeChange = (value: string) => {
    setSelectedDataType(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    if (value) {
      void fetchDataList(value, 1, pagination.pageSize);
    } else {
      setDataList([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    }
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (selectedDataType) {
      void fetchDataList(selectedDataType, 1, pagination.pageSize);
    }
  };

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
    if (selectedDataType) {
      void fetchDataList(selectedDataType, page, pageSize);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    if (selectedDataType) {
      void fetchDataList(selectedDataType, pagination.current, pagination.pageSize);
    }
  };

  // 查看详情
  const handleViewDetail = (record: { key: string; value: unknown }) => {
    console.log('查看详情:', record);
    // 这里可以添加查看详情的逻辑，比如打开弹窗显示详细信息
  };

  // 处理编辑按钮点击
  const handleEdit = () => {
    if (!selectedDataType) {
      message.warning('请先选择数据类型');

      return;
    }
    if (!dataList || dataList.length === 0) {
      message.warning('当前没有可编辑的数据');

      return;
    }
    setOriginalData(dataList);
    setEditModalVisible(true);
  };

  // 处理编辑成功
  const handleEditSuccess = () => {
    // 重新获取数据
    if (selectedDataType) {
      void fetchDataList(selectedDataType, pagination.current, pagination.pageSize);
    }
  };

  // 处理编辑取消
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setOriginalData([]);
  };

  // 动态生成表格列
  const columns = useMemo(() => {
    if (!dataList?.length) {
      return [];
    }

    const sampleItem = dataList[0];
    const keys = Object.keys(sampleItem);

    return keys.map(key => ({
      title: key,
      dataIndex: key,
      key: key,
      width: 150,
      ellipsis: true,
      render: (value: unknown) => {
        if (typeof value === 'object') {
          return (
            <span className='text-blue-400 cursor-pointer' onClick={() => handleViewDetail({ key, value })}>
              {JSON.stringify(value).substring(0, 50)}...
            </span>
          );
        }
        if (typeof value === 'boolean') {
          return (
            <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {value ? '是' : '否'}
            </span>
          );
        }
        if (typeof value === 'number') {
          return <span className='text-green-400'>{value.toLocaleString()}</span>;
        }

        return <span className=''>{String(value)}</span>;
      }
    }));
  }, [dataList]);

  // 初始化时加载第一个数据类型
  useEffect(() => {
    if (dataTypes.length > 0 && !selectedDataType) {
      handleDataTypeChange(dataTypes[0]);
    }
  }, [dataTypes]);

  return {
    dataTypes,
    selectedDataType,
    dataList,
    loading,
    searchText,
    pagination,
    columns,
    editModalVisible,
    originalData,
    handleDataTypeChange,
    handleSearch,
    handleTableChange,
    handleRefresh,
    handleViewDetail,
    handleEdit,
    handleEditSuccess,
    handleEditCancel,
    getDataTypeDisplayName
  };
};
