import React from 'react';
import { Tooltip } from 'antd';

// 格式化Cron表达式
const formatCron = (cron: string) => {
  const parts = cron.split(' ');
  if (parts.length === 6) {
    const [, minute, hour, , , weekday] = parts;
    let description = '';

    if (minute === '0/1') description = '每分钟';
    else if (minute === '0/5') description = '每5分钟';
    else if (minute === '*/5') description = '每5分钟';
    else if (minute === '0' && hour === '0') description = '每天0点';
    else if (minute === '0' && hour === '4') description = '每天4点';
    else if (minute === '0' && hour === '20') description = '每天20点';
    else if (minute === '0' && hour === '21') description = '每天21点';
    else if (minute === '59' && hour === '20') description = '每天20点59分';
    else if (weekday === '1') description = '每周一';
    else if (weekday === '1,5') description = '每周一、五';
    else description = cron;

    return (
      <Tooltip title={cron}>
        <span>{description}</span>
      </Tooltip>
    );
  }
  return cron;
};

export default formatCron;
