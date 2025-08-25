import React from 'react';
import { Modal, Tag } from 'antd';
import { Association } from '@/types/types';
import { CloseOutlined } from '@ant-design/icons';

const AssociationInfo = ({
  associationDetailVisible,
  setAssociationDetailVisible,
  selectedAssociation,
  getAssociationType,
  getLevelName
}: {
  associationDetailVisible: boolean;
  setAssociationDetailVisible: (visible: boolean) => void;
  selectedAssociation: Association | null;
  getAssociationType: (power: number) => string;
  getLevelName: (levelId: number) => string;
}) => {
  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <span className='text-xl font-bold text-white'>宗门详情</span>
        </div>
      }
      open={associationDetailVisible}
      onCancel={() => setAssociationDetailVisible(false)}
      footer={null}
      closeIcon={<CloseOutlined className='text-white' />}
      width={800}
      className='xiuxian-modal'
    >
      {selectedAssociation && (
        <div className='space-y-6'>
          {/* 基础信息 */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-white flex items-center gap-2'>
              <span className='w-2 h-2 bg-blue-400 rounded-full'></span>
              基础信息
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4'>
                <label className='text-sm text-slate-400'>宗门名称</label>
                <p className='font-medium text-white'>{selectedAssociation.宗门名称}</p>
              </div>
              <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4'>
                <label className='text-sm text-slate-400'>宗门等级</label>
                <p className='font-medium text-white'>{selectedAssociation.宗门等级}</p>
              </div>
              <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4'>
                <label className='text-sm text-slate-400'>宗主</label>
                <p className='font-medium text-white'>{selectedAssociation.宗主}</p>
              </div>
              <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4'>
                <label className='text-sm text-slate-400'>宗门类型</label>
                <Tag
                  color={selectedAssociation.power > 0 ? 'purple' : 'blue'}
                  className='border-0'
                  style={{
                    background:
                      selectedAssociation.power > 0
                        ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                        : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                    color: 'white'
                  }}
                >
                  {getAssociationType(selectedAssociation.power)}
                </Tag>
              </div>
              <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4'>
                <label className='text-sm text-slate-400'>最低加入境界</label>
                <p className='font-medium text-white'>
                  {getLevelName(selectedAssociation.最低加入境界)}
                </p>
              </div>
              <div className='bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4'>
                <label className='text-sm text-slate-400'>创立时间</label>
                <p className='font-medium text-white'>
                  {selectedAssociation.创立时间?.[0] || '未知'}
                </p>
              </div>
            </div>
          </div>

          {/* 成员信息 */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-white flex items-center gap-2'>
              <span className='w-2 h-2 bg-purple-400 rounded-full'></span>
              成员信息
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>总成员数</label>
                <p className='text-xl font-bold text-blue-400'>
                  {selectedAssociation.所有成员?.length || 0}
                </p>
              </div>
              <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>副宗主数</label>
                <p className='text-xl font-bold text-purple-400'>
                  {selectedAssociation.副宗主?.length || 0}
                </p>
              </div>
              <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>长老数</label>
                <p className='text-xl font-bold text-green-400'>
                  {selectedAssociation.长老?.length || 0}
                </p>
              </div>
              <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>内门弟子数</label>
                <p className='text-xl font-bold text-yellow-400'>
                  {selectedAssociation.内门弟子?.length || 0}
                </p>
              </div>
              <div className='bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>外门弟子数</label>
                <p className='text-xl font-bold text-red-400'>
                  {selectedAssociation.外门弟子?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* 资源信息 */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-white flex items-center gap-2'>
              <span className='w-2 h-2 bg-green-400 rounded-full'></span>
              资源信息
            </h3>
            <div className='grid grid-cols-3 gap-4'>
              <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>灵石池</label>
                <p className='text-xl font-bold text-green-400'>
                  {selectedAssociation.灵石池?.toLocaleString() || 0}
                </p>
              </div>
              <div className='bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>大阵血量</label>
                <p className='text-xl font-bold text-red-400'>
                  {selectedAssociation.大阵血量?.toLocaleString() || 0}
                </p>
              </div>
              <div className='bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>宗门驻地</label>
                <p className='text-xl font-bold text-blue-400'>
                  {selectedAssociation.宗门驻地 || '无驻地'}
                </p>
              </div>
              <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>宗门神兽</label>
                <p className='text-xl font-bold text-purple-400'>
                  {selectedAssociation.宗门神兽 || '无'}
                </p>
              </div>
              <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 p-4 rounded-xl shadow-lg'>
                <label className='text-sm text-slate-400'>维护时间</label>
                <p className='text-xl font-bold text-yellow-400'>
                  {selectedAssociation.维护时间
                    ? new Date(selectedAssociation.维护时间).toLocaleString()
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AssociationInfo;
