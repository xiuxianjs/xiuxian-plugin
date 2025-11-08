import { Modal, Tag, Typography, Row, Col, Card, Descriptions, Statistic, Alert } from 'antd';
import { GameUser } from '@/types/types';
import { CloseOutlined } from '@ant-design/icons';

// 导入UI组件库

const UserInfo = ({
  userDetailVisible,
  setUserDetailVisible,
  selectedUser,
  getSexDisplay,
  getLevelName,
  getLinggenColor
}: {
  userDetailVisible: boolean;
  setUserDetailVisible: (visible: boolean) => void;
  selectedUser: GameUser | null;
  getSexDisplay: (sex: string) => string;
  getLevelName: (levelId: number) => string;
  getLinggenColor: (linggen: unknown) => string;
}) => {
  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {selectedUser?.数据状态 === 'corrupted' ? '损坏数据详情' : '用户详情'}
          </Typography.Title>
        </div>
      }
      open={userDetailVisible}
      onCancel={() => setUserDetailVisible(false)}
      footer={null}
      className=''
      closeIcon={<CloseOutlined className='' />}
      width={selectedUser?.数据状态 === 'corrupted' ? 1200 : 800}
    >
      {selectedUser && (
        <div className='space-y-6'>
          {/* 如果是损坏数据，显示原始JSON */}
          {selectedUser.数据状态 === 'corrupted' ? (
            <Card>
              <Typography.Title level={5} style={{ marginBottom: 16 }}>
                损坏数据 - 原始JSON内容
              </Typography.Title>
              {selectedUser.错误信息 ? <Alert type='error' showIcon message={selectedUser.错误信息} style={{ marginBottom: 12 }} /> : null}
              <Card size='small' style={{ maxHeight: 384, overflow: 'auto' }}>
                <Typography.Paragraph code style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {selectedUser.原始数据}
                </Typography.Paragraph>
              </Card>
            </Card>
          ) : (
            <>
              {/* 基础信息 */}
              <Card>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>
                  基础信息
                </Typography.Title>
                <Descriptions column={2} bordered size='middle'>
                  <Descriptions.Item label='用户ID'>{selectedUser.id}</Descriptions.Item>
                  <Descriptions.Item label='名号'>{selectedUser.名号}</Descriptions.Item>
                  <Descriptions.Item label='性别'>{getSexDisplay(selectedUser.sex)}</Descriptions.Item>
                  <Descriptions.Item label='境界'>{getLevelName(selectedUser.level_id)}</Descriptions.Item>
                  <Descriptions.Item label='灵根' span={2}>
                    <Tag color={getLinggenColor(selectedUser.灵根)}>{selectedUser.灵根?.name ?? '未知'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='修炼效率'>{`${((selectedUser.修炼效率提升 ?? 0) * 100).toFixed(2)}%`}</Descriptions.Item>
                  <Descriptions.Item label='宣言'>{selectedUser.宣言 ?? '这个人很懒还没有写'}</Descriptions.Item>
                </Descriptions>
              </Card>

              {/* 战斗属性 */}
              <Card>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>
                  战斗属性
                </Typography.Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='攻击力' value={selectedUser.攻击 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='防御力' value={selectedUser.防御 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='当前血量' value={selectedUser.当前血量 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='血量上限' value={selectedUser.血量上限 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='暴击率' value={Number(((selectedUser.暴击率 ?? 0) * 100).toFixed(2))} suffix='%' />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='暴击伤害' value={selectedUser.暴击伤害 ?? 0} suffix='%' />
                    </Card>
                  </Col>
                </Row>
              </Card>

              {/* 资源信息 */}
              <Card>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>
                  资源信息
                </Typography.Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='灵石' value={selectedUser.灵石 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='神石' value={selectedUser.神石 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='轮回点' value={selectedUser.轮回点 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='修为' value={selectedUser.修为 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='血气' value={selectedUser.血气 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='好感度' value={selectedUser.favorability ?? 0} />
                    </Card>
                  </Col>
                </Row>
              </Card>

              {/* 成就信息 */}
              <Card>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>
                  成就信息
                </Typography.Title>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='镇妖塔层数' value={selectedUser.镇妖塔层数 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='神魄段数' value={selectedUser.神魄段数 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='魔道值' value={selectedUser.魔道值 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='轮回次数' value={selectedUser.lunhui ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='连续签到' value={selectedUser.连续签到天数 ?? 0} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size='small'>
                      <Statistic title='幸运值' value={selectedUser.幸运 ?? 0} />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default UserInfo;
