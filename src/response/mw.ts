import { getIoRedis } from '@alemonjs/db';
import { getAppCofig, keys } from '@src/model';
import { generateCaptcha, svgToPngBuffer } from '@src/model/captcha';
import { baseKey } from '@src/model/keys';
import { Image, Mention, Text, useMessage } from 'alemonjs';
import dayjs from 'dayjs';
import { isNight, MAX_COUNT, MIN_COUNT, replyCount } from './config';
import { setIds } from '@src/model/MessageSystem';

export const selects = onSelects(['message.create', 'private.message.create', 'private.interaction.create', 'interaction.create']);

const mw = onResponse(selects, async event => {
  // 机器人记录自己的userId and channelId
  void setIds({ uid: event.userId, cid: event.channelId });

  const values = getAppCofig();

  if (values?.close_captcha) {
    // 系统关闭了过验证码流程。
    // 直接放行。也不匹配下一个指令。
    return true;
  }

  const userId = event.UserId;
  const redis = getIoRedis();

  // 仅有存档才校验
  const exist = await redis.exists(keys.player(userId));

  if (exist === 0) {
    // 没有存档。直接放行。也不匹配下一个指令。
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

    // 结束。即不放行，也不匹配下一个指令。
    return;
  }

  // 2. 校验是否需要输入验证码
  const captchaExists = await redis.exists(keys.captcha(userId));

  if (captchaExists) {
    // 结束。即不放行，也不匹配下一个指令。
    return;
  }

  // 3. 检查近3小时操作数
  let count = 0;

  for (let i = 1; i <= 3; i++) {
    const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH');
    const key = `${baseKey}:op:${userId}:${checkHour}`;
    const c = await redis.get(key);

    if (c && parseInt(c) >= 10) {
      count += parseInt(c);
    }
  }

  const hour = now.hour();
  const countLimit = isNight(hour) ? MIN_COUNT : MAX_COUNT;

  // 连续3小时活跃过多，需风控
  if (count > countLimit) {
    // 检查是否刚通过验证码
    const captchaPassed = await redis.exists(`${baseKey}:captcha_passed:${userId}`);

    if (!captchaPassed) {
      const { svg, text } = generateCaptcha();

      await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase());
      const img = await svgToPngBuffer(svg);

      void message.send(format(Image(img), Mention(userId)));

      // 结束。即不放行，也不跳过指令。
      return;
    }
  }

  // 4. 操作计数自增，首次操作设置4小时过期
  const hourKey = `${baseKey}:op:${userId}:${now.format('YYYYMMDDHH')}`;
  const opCount = await redis.incr(hourKey);

  if (opCount === 1) {
    await redis.expire(hourKey, 60 * 60 * 4);
  }

  logger.debug(`用户 ${userId} 当前操作次数: ${opCount}`);

  // 放行，但不匹配下一个指令。
  return true;
});

/**
 * 验证码局部中间件。不放在全局中。用来收敛数据。玩家日常的消息不进行频繁的验证。
 * 当前中间件。不会检查是否有存在此类操作。也不会放除了用作验证码以外的逻辑。
 */
export default mw;
