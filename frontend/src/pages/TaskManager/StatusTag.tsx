import React from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

/**
 *
 * @param param0
 * @returns
 */
const StatusTag = ({ status }: { status: string }) => {
  const map: {
    [key: string]: React.ReactNode;
  } = {
    running: (
      <Tag color='green' icon={<CheckCircleOutlined />}>
        运行中
      </Tag>
    ),
    stopped: (
      <Tag color='red' icon={<PauseCircleOutlined />}>
        已停止
      </Tag>
    ),
    error: (
      <Tag color='orange' icon={<ExclamationCircleOutlined />}>
        错误
      </Tag>
    ),
    default: <Tag color='default'>未知</Tag>
  };

  return map[status] ?? map.default;
};

export default StatusTag;
