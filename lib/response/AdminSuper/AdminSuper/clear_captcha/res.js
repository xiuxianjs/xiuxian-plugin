import { useSend, Text } from 'alemonjs';
import { clearCaptchaRecords } from '../../../../model/clear-captcha.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?清理验证码(.*)?$/;
const res = onResponse(selects, async (event) => {
    if (!event.IsMaster) {
        return;
    }
    const Send = useSend(event);
    const match = event.MessageText.match(regular);
    const targetUserId = match?.[2]?.trim();
    try {
        if (targetUserId) {
            await clearCaptchaRecords(targetUserId);
            void Send(Text(`已清理用户 ${targetUserId} 的验证码记录`));
        }
        else {
            await clearCaptchaRecords();
            void Send(Text('已清理所有用户的验证码记录'));
        }
    }
    catch (error) {
        logger.error('清理验证码失败:', error);
        void Send(Text('清理验证码失败，请检查日志'));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
