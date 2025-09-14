import { addCoin, addNajieThing, isUserMonthCard, readPlayer, writePlayer } from '@src/model';
import mw, { selects } from '@src/response/mw-captcha';
import { NajieCategory } from '@src/types/model';
import { useMessage, Text } from 'alemonjs';
export const regular = /^(#|＃|\/)?新手礼包$/;

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const user = await readPlayer(e.UserId);

  if (!user) {
    await message.send(format(Text('请先创建角色')));

    return;
  }
  if (user.newbie === 1) {
    await message.send(format(Text('新手礼包已领取！')));

    return;
  }
  user.newbie = 1;
  await addCoin(e.UserId, 50000);
  const list = [
    {
      name: '五阶玄元丹',
      class: '丹药',
      account: 1
    },
    {
      name: '五阶淬体丹',
      class: '丹药',
      account: 1
    },
    {
      name: '性转丹',
      class: '丹药',
      account: 1
    },
    {
      name: '寒龙刀',
      class: '装备',
      account: 1
    },
    {
      name: '昊天印',
      class: '装备',
      account: 1
    },
    {
      name: '金光天甲',
      class: '装备',
      account: 1
    },
    {
      name: '更名卡',
      class: '道具',
      account: 1
    }
  ];
  const isMonth = await isUserMonthCard(e.UserId);

  for (const thing of list) {
    await addNajieThing(e.UserId, thing.name, thing.class as NajieCategory, isMonth ? thing.account * 2 : thing.account);
  }
  await writePlayer(e.UserId, user);
  const msg = list.map(thing => {
    return `${thing.name}*${isMonth ? thing.account * 2 : thing.account}`;
  });

  await message.send(format(Text('新手礼包领取成功！获得: ' + msg.join('\n'))));
});

export default onResponse(selects, [mw.current, res.current]);
