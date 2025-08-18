import { useSend, Image, Text } from 'alemonjs';
import { generateCaptcha, svgToPngBuffer } from '../../../../model/captcha.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?测试验证码$/;
var res = onResponse(selects, async (event) => {
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

export { res as default, regular, selects };
