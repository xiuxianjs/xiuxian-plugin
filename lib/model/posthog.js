import { getConfigValue } from 'alemonjs';
import { PostHog } from 'posthog-node';
import { pkg } from './settions.js';

let log = null;
const LOG_EVENT_NAME = {
    BOT_RUN: 'bot-run',
    COMMAND: 'command'
};
const postLog = (props) => {
    if (!log) {
        return;
    }
    try {
        log.capture(props);
    }
    catch (error) {
        logger.warn('PostHog 日志发送失败', error);
    }
};
const initPostlog = () => {
    const values = getConfigValue();
    const value = values[pkg.name] || {};
    const postlog = value?.postlog || {};
    const api_key = postlog.api_key || '';
    if (!api_key) {
        return;
    }
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
const COMMAND_NAME = {
    HELP: 'help'
};
const postLogCommand = (props) => {
    if (process.env.NODE_ENV === 'development') {
        return;
    }
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

export { COMMAND_NAME, LOG_EVENT_NAME, initPostlog, postLog, postLogCommand };
