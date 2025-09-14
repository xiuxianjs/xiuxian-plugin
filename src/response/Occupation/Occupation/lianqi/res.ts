import { Text, useSend } from 'alemonjs';
import { existplayer, readPlayer, existNajieThing, addNajieThing, addExp4 } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataList } from '@src/model/DataList';

export const regular = /^(#|＃|\/)?打造.*(\*[0-9]*)?$/;

interface TuzhiMaterial {
  name: string;
  amount: number;
}
interface TuzhiItem {
  name: string;
  rate: number;
  exp: number[];
  materials: TuzhiMaterial[];
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家数据读取失败'));

    return false;
  }
  if (player.occupation !== '炼器师') {
    void Send(Text('铜都不炼你还炼器？'));

    return false;
  }
  const raw = e.MessageText.replace(/^(#|＃|\/)?打造/, '').trim();

  if (!raw) {
    void Send(Text('格式: 打造装备名*数量(可选)'));

    return false;
  }
  const t = raw.split('*');
  const equipment_name = t[0].trim();
  let count = 1;

  if (t[1]) {
    const n = Number(t[1]);

    if (Number.isFinite(n) && n > 1) {
      count = Math.min(Math.trunc(n), 20);
    }
  }

  interface AnyTuzhiLike {
    name?;
    rate?;
    exp?;
    materials?;
  }
  // const tuzhiRaw = data.tuzhi_list
  const data = await getDataList('Tuzhi');
  const tuzhiCandidate = data.find(it => {
    return !!it && typeof it === 'object' && (it as AnyTuzhiLike).name === equipment_name;
  });
  const tuzhi = tuzhiCandidate as Partial<TuzhiItem> | undefined;

  if (!tuzhi || typeof tuzhi.rate !== 'number' || !Array.isArray(tuzhi.exp) || !Array.isArray(tuzhi.materials)) {
    void Send(Text(`世界上没有[${equipment_name}]的图纸或配置不完整`));

    return false;
  }
  if (!Array.isArray(tuzhi.materials)) {
    void Send(Text('图纸材料配置异常'));

    return false;
  }
  if (!Array.isArray(tuzhi.exp) || tuzhi.exp.length === 0) {
    void Send(Text('图纸经验配置缺失'));

    return false;
  }

  let suc_rate = Number(tuzhi.rate) || 0;

  if (suc_rate < 0) {
    suc_rate = 0;
  }
  if (suc_rate > 1) {
    suc_rate = 1;
  }

  let occRate = 0;

  if (player.occupation_level > 0) {
    const dataList = await getDataList('experience');
    const occConf = dataList.find(item => item.id === player.occupation_level);

    if (occConf) {
      // 使用经验表的 experience 做近似比率换算（避免不存在的 rate 字段）
      const base = Number(occConf.experience) || 0;

      occRate = Math.min(base / 10000, 1) * 0.25; // 简单归一化再缩放
    }
  }
  let extraMsg = '';

  if (player.occupation === '炼器师') {
    extraMsg += `你是炼器师，额外增加成功率${Math.floor(occRate * 100)}%(乘算)，`;
    suc_rate *= 1 + occRate;
    if (player.occupation_level >= 24) {
      suc_rate = 0.8;
    }
  }
  if (suc_rate > 0.95) {
    suc_rate = 0.95;
  }

  const expGainPer = tuzhi.exp[0];

  for (const m of tuzhi.materials) {
    const owned = await existNajieThing(userId, m.name, '材料');
    const need = m.amount * count;

    if (typeof owned !== 'number' || owned < need) {
      void Send(Text(`纳戒中拥有${m.name}×${owned || 0}，打造需要${need}份`));

      return false;
    }
  }
  let costMsg = '消耗';

  for (const m of tuzhi.materials) {
    const need = m.amount * count;

    costMsg += `${m.name}×${need}，`;
    await addNajieThing(userId, m.name, '材料', -need);
  }

  const pinjiName = ['劣', '普', '优', '精', '极', '绝', '顶'];
  let success = 0;
  const pinjiStat: Record<string, number> = {};

  for (let i = 0; i < count; i++) {
    const rand = Math.random();

    if (rand <= suc_rate) {
      success++;
      const pinji = Math.trunc(Math.random() * 7);
      const pjName = pinjiName[pinji];

      pinjiStat[pjName] = (pinjiStat[pjName] || 0) + 1;
      await addNajieThing(userId, equipment_name, '装备', 1, pinji);
    }
  }

  if (success === 0) {
    const random = Math.random();

    if (random < 0.5) {
      void Send(Text(`${costMsg}打造装备时不小心锤断了刃芯，打造失败！`));
    } else {
      void Send(Text(`${costMsg}打造装备时没有把控好火候，烧毁了，打造失败！`));
    }

    return false;
  }

  const totalExp = expGainPer * success;

  await addExp4(userId, totalExp);

  let pjSummary = Object.entries(pinjiStat)
    .sort((a, b) => pinjiName.indexOf(b[0]) - pinjiName.indexOf(a[0]))
    .map(([k, v]) => `${k}×${v}`)
    .join('，');

  if (!pjSummary) {
    pjSummary = '无';
  }

  const msg = `${extraMsg}${costMsg}打造成功${success}/${count}件，获得${equipment_name}(${pjSummary})，炼器经验+${totalExp}`;

  void Send(Text(msg));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
