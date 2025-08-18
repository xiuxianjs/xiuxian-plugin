import { useSend, Text } from 'alemonjs';
import { clearCaptchaRecords } from '../../../../scripts/clear-captcha.js';
import { getIoRedis } from '@alemonjs/db';
import { baseKey } from '../../../../model/constants.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?清理验证码(.*)?$/;
var res = onResponse(selects, async (event) => {
    if (!event.IsMaster) {
        return;
    }
    const Send = useSend(event);
    const match = event.MessageText.match(regular);
    const targetUserId = match?.[2]?.trim();
    try {
        if (targetUserId) {
            await clearCaptchaRecords(targetUserId);
            Send(Text(`已清理用户 ${targetUserId} 的验证码记录`));
        }
        else {
            await clearCaptchaRecords();
            Send(Text('已清理所有用户的验证码记录'));
        }
        const redis = getIoRedis();
        const passedKeys = await redis.keys(`${baseKey}:captcha_passed:*`);
        if (passedKeys.length > 0) {
            await redis.del(...passedKeys);
            Send(Text(`额外清理了 ${passedKeys.length} 个验证码通过标记`));
        }
    }
    catch (error) {
        logger.error('清理验证码失败:', error);
        Send(Text('清理验证码失败，请检查日志'));
    }
});

export { res as default, regular, selects };
