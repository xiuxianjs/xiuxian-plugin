import { Mention, Text, useMessage, useSubscribe } from 'alemonjs';
import { addNajieThing, existNajieThing } from '@src/model/najie';
import { readEquipment, writeEquipment } from '@src/model/equipment';
import { writePlayer } from '@src/model';
import { getRandomTalent, playerEfficiency } from '@src/model';
import { getDataList } from '@src/model/DataList';
import { selects } from '@src/response/mw';
import { toNumber, thingType } from './utils';

// 处理轮回阵旗
const handleLunhuiFlag = async (userId: string, player: any, message: any): Promise<void> => {
  player.lunhuiBH = 1;
  await writePlayer(userId, player);
  void message.send(format(Text('已得到"轮回阵旗"的辅助，下次轮回可抵御轮回之苦的十之八九')));
  await addNajieThing(userId, '轮回阵旗', '道具', -1);
};

// 处理仙梦之匙
const handleXianmengKey = async (userId: string, player: any, message: any): Promise<void> => {
  if (!player.仙宠) {
    void message.send(format(Text('你还没有出战仙宠')));

    return;
  }
  player.仙宠.灵魂绑定 = 0;
  await writePlayer(userId, player);
  await addNajieThing(userId, '仙梦之匙', '道具', -1);
  void message.send(format(Text('出战仙宠解绑成功!')));
};

// 处理残卷兑换
const handleCanjuan = async (userId: string, message: any, e: any): Promise<void> => {
  const number = await existNajieThing(userId, '残卷', '道具');

  if (typeof number === 'number' && number > 9) {
    void message.send(format(Text('是否消耗十个卷轴兑换一个八品功法？回复:【兑换*功法名】或者【还是算了】进行选择')));

    const [subscribe] = useSubscribe(e, selects);
    const sub = subscribe.mount(
      async event => {
        const userId = event.UserId;
        const [message] = useMessage(event);
        const choice = event.MessageText;
        const code = choice.split('*');
        const les = code[0];
        const gonfa = code[1];

        clearTimeout(timeout);

        if (les === '还是算了') {
          void message.send(format(Text('取消兑换')));
        } else if (les === '兑换') {
          const bapin = await getDataList('Bapin');
          const ifexist2 = bapin.find((item: any) => item.name === gonfa);

          if (ifexist2) {
            await addNajieThing(userId, '残卷', '道具', -10);
            await addNajieThing(userId, gonfa, '功法', 1);
            void message.send(format(Text(`兑换${gonfa}成功`)));
          } else {
            void message.send(format(Text('残卷无法兑换该功法')));
          }
        }
      },
      ['UserId']
    );

    const timeout = setTimeout(
      () => {
        try {
          subscribe.cancel(sub);
          void message.send(format(Text('已取消操作')));
        } catch (e) {
          console.error('取消订阅失败', e);
        }
      },
      1000 * 60 * 1
    );
  } else {
    void message.send(format(Text('你没有足够的残卷')));
  }
};

// 处理重铸石
const handleChongzhuStone = async (userId: string, message: any): Promise<void> => {
  const equipment = await readEquipment(userId);

  if (!equipment) {
    return;
  }

  const type = ['武器', '护具', '法宝'] as const;
  const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5];

  for (const t of type) {
    const random = Math.trunc(Math.random() * 6);
    const cur = equipment[t];

    if (cur?.pinji === undefined || !z[cur.pinji]) {
      continue;
    }
    cur.atk = (cur.atk / z[cur.pinji]) * z[random];
    cur.def = (cur.def / z[cur.pinji]) * z[random];
    cur.HP = (cur.HP / z[cur.pinji]) * z[random];
    cur.pinji = random;
  }

  await writeEquipment(userId, equipment);
  await addNajieThing(userId, '重铸石', '道具', -1);
  void message.send(format(Text('使用成功,发送#我的装备查看属性')));
};

// 处理洗髓道具
const handleXisui = async (userId: string, thingName: string, player: any, thingExist: any, message: any): Promise<void> => {
  const numberOwned = await existNajieThing(userId, thingName, '道具');

  if ((player.linggenshow ?? 0) !== 0) {
    void message.send(format(Text('你未开灵根，无法洗髓！')));

    return;
  }

  await addNajieThing(userId, thingName, '道具', -1);
  player.灵根 = await getRandomTalent();
  await writePlayer(userId, player);
  await playerEfficiency(userId);

  void message.send(
    format(
      Mention(userId),
      Text(
        [
          `  服用成功,剩余 ${thingName}数量: ${(typeof numberOwned === 'number' ? numberOwned : 0) - 1}，新的灵根为 "${player.灵根.type}"：${player.灵根.name}`,
          '\n可以在【#我的练气】中查看'
        ].join('')
      )
    )
  );
};

// 处理定灵珠
const handleDinglingZhu = async (userId: string, thingName: string, player: any, message: any): Promise<void> => {
  await addNajieThing(userId, thingName, '道具', -1);
  player.linggenshow = 0;
  await writePlayer(userId, player);
  void message.send(format(Text(`你眼前一亮，看到了自己的灵根,"${player.灵根.type}"：${player.灵根.name}`)));
};

// 处理强化道具
const handleQianghua = async (userId: string, thingName: string, thingExist: any, player: any, quantity: number, message: any): Promise<void> => {
  const data = {
    qianghua: await getDataList('Qianghua')
  };
  const qh = data.qianghua.find((item: any) => item.name === (thingExist as { name?: string }).name);

  if (qh) {
    if (qh.class === '魔头' && (player.魔道值 ?? 0) < 1000) {
      void message.send(format(Text('你还是提升点魔道值再用吧!')));

      return;
    } else if (qh.class === '神人' && ((player.魔道值 ?? 0) > 0 || (player.灵根.type !== '转生' && player.level_id < 42))) {
      void message.send(format(Text('你尝试使用它,但是失败了')));

      return;
    }

    if (typeof player.攻击加成 !== 'number') {
      player.攻击加成 = Number(player.攻击加成) || 0;
    }
    if (typeof player.防御加成 !== 'number') {
      player.防御加成 = Number(player.防御加成) || 0;
    }
    if (typeof player.生命加成 !== 'number') {
      player.生命加成 = Number(player.生命加成) || 0;
    }

    player.攻击加成 += toNumber(qh.攻击) * quantity;
    player.防御加成 += toNumber(qh.防御) * quantity;
    player.生命加成 += toNumber(qh.血量) * quantity;

    await writePlayer(userId, player);
    await addNajieThing(userId, thingName, '道具', -quantity);
    void message.send(format(Text(`${qh.msg || '使用成功'}`)));
  }
};

// 消耗道具处理主函数
export const handleConsume = async (
  userId: string,
  thingName: string,
  thingExist: any,
  player: any,
  quantity: number,
  message: any,
  e: any
): Promise<boolean> => {
  // 特殊道具处理
  switch (thingName) {
    case '轮回阵旗':
      await handleLunhuiFlag(userId, player, message);

      return true;

    case '仙梦之匙':
      await handleXianmengKey(userId, player, message);

      return true;

    case '残卷':
      await handleCanjuan(userId, message, e);

      return true;

    case '重铸石':
      await handleChongzhuStone(userId, message);

      return true;

    case '隐身水':
    case '幸运草':
      void message.send(format(Text('该道具无法在纳戒中消耗')));

      return true;

    case '定灵珠':
      await handleDinglingZhu(userId, thingName, player, message);

      return true;
  }

  // 洗髓道具处理
  if (thingExist && thingType(thingExist) === '洗髓') {
    await handleXisui(userId, thingName, player, thingExist, message);

    return true;
  }

  // 强化道具处理
  await handleQianghua(userId, thingName, thingExist, player, quantity, message);

  return true;
};
