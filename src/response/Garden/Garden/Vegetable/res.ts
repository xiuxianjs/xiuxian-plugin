import { Text, useSend } from 'alemonjs';
import { redis } from '@src/model/api';
import type { Player, ZongMen } from '@src/types';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { keys } from '@src/model';
import { GardenCrop, GardenData } from '@src/types/yaoyuan';

export const regular = /^(#|＃|\/)?药园$/;

function cap(n: number, max: number) {
  return n > max ? max : n;
}
function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}
function fmtRemain(ms: number) {
  if (ms <= 0) {
    return '0天0小时0分钟';
  }
  const d = Math.trunc(ms / 86400000);
  const h = Math.trunc((ms % 86400000) / 3600000);
  const m = Math.trunc((ms % 3600000) / 60000);

  return `${d}天${h}小时${m}分钟`;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const player: Player | null = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return;
  }

  if (!player?.宗门) {
    return;
  }

  const guildName = player?.宗门?.宗门名称;

  const ass: ZongMen | null = await getDataJSONParseByKey(keys.association(guildName));

  if (!ass) {
    return;
  }

  const garden = ass.药园;
  const guildLevel = toInt(ass.宗门等级, 1);

  // 检查药园是否存在或药园等级是否与宗门等级匹配
  if (garden?.药园等级 !== guildLevel) {
    ass.药园 = await createGarden(ass, guildName, userId, guildLevel);
    void setDataJSONStringifyByKey(keys.association(guildName), ass);
    void Send(Text('新建药园，种下了一棵草'));
  }

  const finalGarden = ass.药园 ?? { 药园等级: 1, 作物: [] };
  const capacity = cap(guildLevel, 6);
  const msg: string[] = [`宗门名称: ${ass.宗门名称}`, `药园可栽种: ${capacity} 棵药草`, '药园药草如下:'];
  const now = Date.now();

  for (const crop of finalGarden.作物 || []) {
    if (!crop?.name) {
      continue;
    }
    if (['天灵花', '皇草', '创世花'].includes(crop.name)) {
      continue;
    }
    const matureKey = `xiuxian:${guildName}${crop.name}`;
    const matureAtRaw = await redis.get(matureKey);
    const matureAt = toInt(matureAtRaw, now);
    const remain = matureAt - now;
    const remainStr = fmtRemain(remain);

    msg.push(`作物: ${crop.name}\n描述: ${crop.desc || ''}\n成长时间:${remainStr}`);
  }

  void Send(Text(msg.join('\n')));
});

async function createGarden(ass: ZongMen, associationName: string, userId: string, level: number) {
  const now = Date.now();
  const cropTemplates: GardenCrop[] = [
    { name: '凝血草', ts: 1, desc: '汲取了地脉灵气形成的草' },
    {
      name: '掣电树',
      ts: 2,
      desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
    },
    { name: '小吉祥草', ts: 3, desc: '小吉祥草的护佑，拥有抵御雷劫的力量' },
    { name: '大吉祥草', ts: 7, desc: '大吉祥草的护佑' },
    { name: '仙草', ts: 7, desc: '仙草' },
    { name: '龙火', ts: 7, desc: '龙火，不详' }
  ];
  const levelMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 6,
    8: 6,
    9: 6
  };
  const count = levelMap[level] || 1;
  const crops = cropTemplates.slice(0, count).map(c => ({ ...c, start_time: now, who_plant: userId }));
  const garden: GardenData = { 药园等级: level, 作物: crops };

  // 初始化成熟时间戳
  for (const c of crops) {
    const matureAt = now + 24 * 60 * 60 * 1000 * toInt(c.ts, 1);

    await redis.set(`xiuxian:${associationName}${c.name}`, matureAt);
  }

  return garden;
}
export default onResponse(selects, [mw.current, res.current]);
