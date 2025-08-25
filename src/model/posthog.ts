import { getConfigValue } from 'alemonjs';
import { EventMessage, PostHog } from 'posthog-node';
import { pkg } from './settions';

let log: typeof PostHog.prototype = null;

export const LOG_EVENT_NAME = {
  // 机器人启动
  BOT_RUN: 'bot-run',
  // 指令
  COMMAND: 'command'
};

/**
 * @returns
 */
export const postLog = (props: EventMessage) => {
  if (!log) {
    return;
  }
  try {
    log.capture(props);
  } catch (error) {
    logger.warn('PostHog 日志发送失败', error);
  }
};

export const initPostlog = () => {
  const values = getConfigValue();
  const value = values[pkg.name] || {};
  const postlog = value?.postlog || {};
  const api_key = postlog.api_key || '';
  if (!api_key) return;
  const options = postlog.options || {};
  const host = postlog.host || 'https://us.i.posthog.com';
  log = new PostHog(postlog.api_key, {
    ...options,
    host
  });
  logger.info('修仙&PostHog 日志系统已初始化');
  log.capture({
    distinctId: pkg.name,
    event: LOG_EVENT_NAME.BOT_RUN
  });
};

export const COMMAND_NAME = {
  HELP: 'help'
};

/**
 * 记录指令日志
 * @param props
 */
export const postLogCommand = (props: {
  // 来源
  id: string;
  // 指令
  value: string;
  // 功能名
  name: (typeof COMMAND_NAME)[keyof typeof COMMAND_NAME];
  // 其他信息
  ext?: {
    [k: string]: unknown;
  };
}) => {
  // 开发模式下不发送
  if (process.env.NODE_ENV === 'development') return;
  const ext = props.ext || {};
  postLog({
    distinctId: props.id,
    event: LOG_EVENT_NAME.COMMAND,
    properties: {
      value: props.value,
      ...ext
    }
  });
};
