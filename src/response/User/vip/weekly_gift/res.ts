import { addNajieThing, readPlayer, redis } from '@src/model';
import mw, { selects } from '@src/response/mw';
import { useMessage, Text } from 'alemonjs';

export const regular = /^(#|＃|\/)?领取每周礼包$/;
const baseKey = 'xiuxian@1.3.0:Vip:';

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const user = await readPlayer(e.UserId);

  if (!user) {
    void message.send(format(Text('请先创建角色')));

    return;
  }
  if (!user.vip_type || user.vip_type === 0) {
    void message.send(format(Text('请先成为会员')));

    return;
  }
  const coolingKey = `${baseKey}weeklyGift:${e.UserId}`;
  const cooling = await redis.get(coolingKey);
  const now = Date.now();

  if (cooling) {
    void message.send(format(Text('本周已领取过！')));

    return;
  }

  await redis.set(coolingKey, now);
  await addNajieThing(e.UserId, '五阶玄元丹', '丹药', 1);
  await addNajieThing(e.UserId, '五阶淬体丹', '丹药', 1);
  await addNajieThing(e.UserId, '仙府通行证', '道具', 1);
  await addNajieThing(e.UserId, '道具盲盒', '道具', 1);

  void message.send(format(Text('周常礼包领取成功！获得 五阶玄元丹、五阶淬体丹、仙府通行证、道具盲盒')));
});

export default onResponse(selects, [mw.current, res.current]);
