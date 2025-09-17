import { getIoRedis } from '@alemonjs/db';
import { getAppConfig, keys } from '@src/model';
import { generateCaptcha, svgToPngBuffer, verifyCaptcha } from '@src/model/captcha';
import { baseKey } from '@src/model/keys';
import { Image, Mention, Text, useMessage } from 'alemonjs';
import dayjs from 'dayjs';
import { selects } from './mw-captcha';
import { captchaTries, MAX_CAPTCHA_TRIES, op, replyCount } from './config';

export const regular = /^[a-zA-Z0-9]{1,9}$/;

export default onResponse(selects, async event => {
  const values = getAppConfig();

  if (values?.close_captcha) {
    return true;
  }
  const userId = event.UserId;
  const redis = getIoRedis();
  // 仅有存档才校验
  const exist = await redis.exists(keys.player(userId));

  if (exist === 0) {
    return true;
  }
  const [message] = useMessage(event);
  const now = dayjs();

  // 1. 检查禁言
  const muteTtl = await redis.ttl(keys.mute(userId));

  if (muteTtl > 0) {
    const unlockTime = dayjs().add(muteTtl, 'second').format('YYYY-MM-DD HH:mm:ss');
    const count = replyCount[userId] || 0;

    if (count < 2) {
      void message.send(format(Text(`你的修仙功能已被禁言，限制将于${unlockTime}解除。`)));
      replyCount[userId] = count + 1;
    }

    return;
  }

  // 2. 校验是否需要输入验证码
  const captchaExists = await redis.exists(keys.captcha(userId));

  if (captchaExists) {
    const text = event.MessageText?.trim();

    // 非验证码消息时，不进行校验（4~8位字母数字，可根据实际生成规则调整正则）
    if (!/^[a-zA-Z0-9]{1,9}$/.test(text)) {
      logger.debug(`用户 ${userId} 输入的消息不符合验证码格式`);

      return;
    }

    const success = await verifyCaptcha(userId, text);

    if (success) {
      void message.send(format(Text('验证码正确！'), Mention(userId)));
      // 清理验证码与禁言数据
      await redis.del(keys.captcha(userId));
      await redis.del(keys.mute(userId));
      captchaTries[userId] = 0;

      // 重置操作计数 6 小时过期
      await redis.setex(op(userId), 60 * 60 * 6, '1');

      // 清理前三小时操作记录，避免连续游玩风控
      for (let i = 1; i <= 3; i++) {
        const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH');
        const pastHourKey = `${baseKey}:op:${userId}:${checkHour}`;

        await redis.del(pastHourKey);
      }

      // 验证码通过豁免 1 小时
      await redis.setex(`${baseKey}:captcha_passed:${userId}`, 60 * 60, '1');

      return true;
    } else {
      captchaTries[userId] = (captchaTries[userId] || 0) + 1;
      if (captchaTries[userId] >= MAX_CAPTCHA_TRIES) {
        void message.send(format(Text('错误次数过多，你已被临时禁言6小时！'), Mention(userId)));
        // 设置禁言，仅用过期，value为'1'
        await redis.setex(keys.mute(userId), 60 * 60 * 6, '1');
        // 清理验证码
        await redis.del(keys.captcha(userId));
        captchaTries[userId] = 0;
      } else {
        const { svg, text } = generateCaptcha();

        await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase());
        const img = await svgToPngBuffer(svg);

        void message.send(format(Image(img), Mention(userId)));
      }
    }
  }

  // 不需要过验证码，但触发验证码批评。进行忽略
});
