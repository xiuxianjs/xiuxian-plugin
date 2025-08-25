import { Image, Text, useSend } from 'alemonjs';
import { generateCaptcha, svgToPngBuffer } from '@src/model/captcha';
import mw from '@src/response/mw';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?测试验证码$/;

const res = onResponse(selects, async event => {
  if (!event.IsMaster) {
    return;
  }

  const Send = useSend(event);
  const userId = event.UserId;

  try {
    // 生成测试验证码
    const captcha = await generateCaptcha(userId, 300); // 5分钟过期
    const img = await svgToPngBuffer(captcha);
    Send(Image(img));
  } catch (error) {
    logger.error('测试验证码失败:', error);
    Send(Text('测试验证码失败，请检查日志'));
  }
});

export default onResponse(selects, [mw.current, res.current]);
