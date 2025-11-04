import { Modal, Descriptions, Alert, Card } from 'antd';
import { Najie } from '@/types/types';
import { CloseOutlined } from '@ant-design/icons';

const NajieInfo = ({
  najieDetailVisible,
  setNajieDetailVisible,
  selectedNajie,
  getTotalItems
}: {
  najieDetailVisible: boolean;
  setNajieDetailVisible: (visible: boolean) => void;
  selectedNajie: Najie | null;
  getTotalItems: (najie: Najie) => number;
}) => {
  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <span>{selectedNajie?.数据状态 === 'corrupted' ? '损坏数据详情' : '背包详情'}</span>
        </div>
      }
      open={najieDetailVisible}
      onCancel={() => setNajieDetailVisible(false)}
      footer={null}
      closeIcon={<CloseOutlined className='' />}
      className=''
      width={selectedNajie?.数据状态 === 'corrupted' ? 1200 : 800}
    >
      {selectedNajie && (
        <div className='space-y-6'>
          {/* 如果是损坏数据，显示原始JSON */}
          {selectedNajie.数据状态 === 'corrupted' ? (
            <div>
              <Alert
                message='损坏数据 - 原始JSON内容'
                description={
                  <div>
                    <p className='mb-2'>错误信息: {selectedNajie.错误信息}</p>
                    <pre className='text-xs overflow-auto' style={{ maxHeight: 400 }}>
                      {selectedNajie.原始数据}
                    </pre>
                  </div>
                }
                type='error'
                showIcon
              />
            </div>
          ) : (
            <>
              {/* 基础信息 */}
              <Card title='基础信息' size='small'>
                <Descriptions column={2} size='small'>
                  <Descriptions.Item label='用户ID'>{selectedNajie.userId}</Descriptions.Item>
                  <Descriptions.Item label='背包等级'>{selectedNajie.等级 ?? 1}</Descriptions.Item>
                  <Descriptions.Item label='总物品数'>{getTotalItems(selectedNajie)}</Descriptions.Item>
                  <Descriptions.Item label='当前灵石'>{selectedNajie.灵石?.toLocaleString() ?? 0}</Descriptions.Item>
                </Descriptions>
              </Card>

              {/* 物品统计 */}
              <Card title='物品统计' size='small'>
                <Descriptions column={4} size='small'>
                  <Descriptions.Item label='装备'>{selectedNajie.装备?.length ?? 0}</Descriptions.Item>
                  <Descriptions.Item label='丹药'>{selectedNajie.丹药?.length ?? 0}</Descriptions.Item>
                  <Descriptions.Item label='道具'>{selectedNajie.道具?.length ?? 0}</Descriptions.Item>
                  <Descriptions.Item label='功法'>{selectedNajie.功法?.length ?? 0}</Descriptions.Item>
                </Descriptions>
              </Card>

              {/* 其他物品 */}
              <Card title='其他物品' size='small'>
                <Descriptions column={4} size='small'>
                  <Descriptions.Item label='草药'>{selectedNajie.草药?.length ?? 0}</Descriptions.Item>
                  <Descriptions.Item label='材料'>{selectedNajie.材料?.length ?? 0}</Descriptions.Item>
                  <Descriptions.Item label='仙宠'>{selectedNajie.仙宠?.length ?? 0}</Descriptions.Item>
                  <Descriptions.Item label='灵石上限'>{selectedNajie.灵石上限?.toLocaleString() ?? 0}</Descriptions.Item>
                </Descriptions>
              </Card>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default NajieInfo;
