import { Modal, Tag, Typography, Descriptions, Card, Row, Col, Divider, Statistic, Space } from 'antd';
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
      title={<Typography.Text strong>宗门详情</Typography.Text>}
      open={associationDetailVisible}
      onCancel={() => setAssociationDetailVisible(false)}
      footer={null}
      closeIcon={<CloseOutlined />}
      width={800}
    >
      {selectedAssociation && (
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {/* 基础信息 */}
          <Card title={<Typography.Text strong>基础信息</Typography.Text>} bordered>
            <Descriptions column={2} labelStyle={{ width: 120 }}>
              <Descriptions.Item label='宗门名称'>{selectedAssociation.宗门名称}</Descriptions.Item>
              <Descriptions.Item label='宗门等级'>{selectedAssociation.宗门等级}</Descriptions.Item>
              <Descriptions.Item label='宗主'>{selectedAssociation.宗主}</Descriptions.Item>
              <Descriptions.Item label='宗门类型'>
                <Tag color={selectedAssociation.power > 0 ? 'purple' : 'blue'}>{getAssociationType(selectedAssociation.power)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label='最低加入境界'>{getLevelName(selectedAssociation.最低加入境界)}</Descriptions.Item>
              <Descriptions.Item label='创立时间'>{selectedAssociation.创立时间?.[0] ?? '未知'}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 成员信息 */}
          <Card title={<Typography.Text strong>成员信息</Typography.Text>} bordered>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Statistic title='总成员数' value={selectedAssociation.所有成员?.length ?? 0} />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic title='副宗主数' value={selectedAssociation.副宗主?.length ?? 0} />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic title='长老数' value={selectedAssociation.长老?.length ?? 0} />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic title='内门弟子数' value={selectedAssociation.内门弟子?.length ?? 0} />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic title='外门弟子数' value={selectedAssociation.外门弟子?.length ?? 0} />
              </Col>
            </Row>
          </Card>

          {/* 资源信息 */}
          <Card title={<Typography.Text strong>资源信息</Typography.Text>} bordered>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Statistic title='灵石池' value={selectedAssociation.灵石池 ?? 0} />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic title='大阵血量' value={selectedAssociation.大阵血量 ?? 0} />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Descriptions column={2} labelStyle={{ width: 120 }}>
              <Descriptions.Item label='宗门驻地'>{selectedAssociation.宗门驻地 ?? '无驻地'}</Descriptions.Item>
              <Descriptions.Item label='宗门神兽'>{selectedAssociation.宗门神兽 ?? '无'}</Descriptions.Item>
              <Descriptions.Item label='维护时间'>
                {selectedAssociation.维护时间 ? new Date(selectedAssociation.维护时间).toLocaleString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Space>
      )}
    </Modal>
  );
};

export default AssociationInfo;
