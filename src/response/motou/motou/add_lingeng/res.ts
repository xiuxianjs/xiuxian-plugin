import { Text, useObserver, useSend } from 'alemonjs';

import { existplayer, readPlayer, existNajieThing, addNajieThing, writePlayer } from '@src/model/index';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?供奉魔石$/;

// 魔功阶段配置（不含初始转世）
interface MagicStage {
  from: string;
  to: string;
  cost: number;
  prob: number; // 成功概率
  eff: number;
  rate: number; // 法球倍率
}
const MAGIC_STAGES: MagicStage[] = [
  {
    from: '一重魔功',
    to: '二重魔功',
    cost: 20,
    prob: 0.9,
    eff: 0.42,
    rate: 0.27
  },
  {
    from: '二重魔功',
    to: '三重魔功',
    cost: 30,
    prob: 0.8,
    eff: 0.48,
    rate: 0.31
  },
  {
    from: '三重魔功',
    to: '四重魔功',
    cost: 30,
    prob: 0.7,
    eff: 0.54,
    rate: 0.36
  },
  {
    from: '四重魔功',
    to: '五重魔功',
    cost: 40,
    prob: 0.6,
    eff: 0.6,
    rate: 0.4
  },
  {
    from: '五重魔功',
    to: '六重魔功',
    cost: 40,
    prob: 0.5,
    eff: 0.66,
    rate: 0.43
  },
  {
    from: '六重魔功',
    to: '七重魔功',
    cost: 40,
    prob: 0.4,
    eff: 0.72,
    rate: 0.47
  },
  {
    from: '七重魔功',
    to: '八重魔功',
    cost: 50,
    prob: 0.3,
    eff: 0.78,
    rate: 0.5
  },
  { from: '八重魔功', to: '九重魔功', cost: 50, prob: 0.2, eff: 1.2, rate: 1.2 }
];

const Res = onResponse(selects, async (e, next) => {
  const Send = useSend(e);
  const userId = e.UserId;
  const player = await readPlayer(userId);
  const choice = e.MessageText;

  if (choice === '放弃魔根') {
    void Send(Text('重拾道心,继续修行'));
  } else if (choice === '转世魔根') {
    const x = await existNajieThing(userId, '魔石', '道具');

    if (!x) {
      void Send(Text('你没有魔石'));

      return;
    }
    if (x < 10) {
      void Send(Text('你魔石不足10个'));

      return;
    }
    await addNajieThing(userId, '魔石', '道具', -10);
    player.灵根 = {
      name: '一重魔功',
      type: '魔头',
      eff: 0.36,
      法球倍率: 0.23
    };
    await writePlayer(userId, player);
    void Send(Text('恭喜你,转世魔头成功!'));
  } else {
    void Send(Text('输入错误,请重新输入'));
    next();
  }
});
const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return;
  }
  const player = await readPlayer(userId);

  if ((player.魔道值 || 0) < 1000) {
    void Send(Text('你不是魔头'));

    return;
  }
  const x = await existNajieThing(userId, '魔石', '道具');

  if (!x) {
    void Send(Text('你没有魔石'));

    return;
  }
  if (player.灵根.type !== '魔头') {
    void Send(Text('一旦转为魔根,将会舍弃当前灵根。回复:【放弃魔根】或者【转世魔根】进行选择'));
    const [Observer] = useObserver(e, 'message.create');

    Observer(Res.current, ['UserId']);

    return;
  }
  // 查找当前阶段
  const stage = MAGIC_STAGES.find(s => s.from === player.灵根.name);

  if (!stage) {
    void Send(Text('当前灵根已达最高或无法突破'));

    return;
  }
  if (x < stage.cost) {
    void Send(Text(`魔石不足${stage.cost}个,当前魔石数量${x}个`));

    return;
  }
  await addNajieThing(userId, '魔石', '道具', -stage.cost);
  const random = Math.random();

  if (random < stage.prob) {
    player.灵根 = {
      name: stage.to,
      type: '魔头',
      eff: stage.eff,
      法球倍率: stage.rate
    };
    await writePlayer(userId, player);
    void Send(Text(`恭喜你,灵根突破成功,当前灵根${stage.to}!`));
  } else {
    void Send(Text('灵根突破失败'));
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
