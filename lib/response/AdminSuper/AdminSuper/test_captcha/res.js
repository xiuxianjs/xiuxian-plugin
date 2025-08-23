import { useSend, Image, Text } from 'alemonjs';
import { generateCaptcha, svgToPngBuffer } from '../../../../model/captcha.js';
import mw from '../../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?测试验证码$/;
const res = onResponse(selects, async (event) => {
    if (!event.IsMaster) {
        return;
    }
    const Send = useSend(event);
    const userId = event.UserId;
    try {
        const captcha = await generateCaptcha(userId, 300);
        const img = await svgToPngBuffer(captcha);
        Send(Image(img));
    }
    catch (error) {
        logger.error('测试验证码失败:', error);
        Send(Text('测试验证码失败，请检查日志'));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
