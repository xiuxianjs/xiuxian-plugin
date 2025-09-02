import { Text, useMention, useSend } from 'alemonjs';
import { existplayer, readPlayer, writePlayer } from '@src/model';
import { getDataByKey, setDataByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';
import { keysAction } from '@src/model/keys';
import { config } from '@src/model/api';
import { zdBattle } from '@src/model/battle';
import { addHP, addExp2, addCoin } from '@src/model/economy';
import { existNajieThing } from '@src/model/najie';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { ActionRecord } from '@src/types';

export const regular = /^(#|＃|\/)?比武$/;

function toInt(v: any, d = 0): number {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

function parseJson<T>(raw: any, fallback: T): T {
  if (typeof raw !== 'string' || raw === '') {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function formatRemain(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  return `${m}分${s}秒`;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    void Send(Text('你还未开始修仙'));

    return false;
  }

  // 猜大小占用检查
  const lastGameTimeA = await getDataByKey(keysAction.lastGameTime(userId));

  if (toInt(lastGameTimeA) === 0) {
    void Send(Text('猜大小正在进行哦!'));

    return false;
  }

  // 目标 @
  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    void Send(Text('请@要比武的修仙者'));

    return false;
  }

  const targetUserId = target.UserId;

  if (userId === targetUserId) {
    void Send(Text('咋的，自娱自乐？'));

    return false;
  }

  if (!(await existplayer(targetUserId))) {
    void Send(Text('不可对凡人出手!'));

    return false;
  }

  // 读取双方玩家
  const playerA = await readPlayer(userId);
  const playerB = await readPlayer(targetUserId);

  if (!playerA || !playerB) {
    void Send(Text('玩家数据异常'));

    return false;
  }

  // 境界校验
  if (!playerA.level_id || !playerB.level_id) {
    void Send(Text('请先#同步信息 / 对方为错误存档'));

    return false;
  }

  // 忙碌状态检查
  const aAction = parseJson<ActionRecord | null>(await getDataByKey(keysAction.action(userId)), null);

  if (aAction?.end_time && Date.now() <= aAction.end_time) {
    void Send(Text(`正在${aAction.action}中,剩余时间:${formatRemain(aAction.end_time - Date.now())}`));

    return false;
  }

  const bAction = parseJson<ActionRecord | null>(await getDataByKey(keysAction.action(targetUserId)), null);

  if (bAction?.end_time && Date.now() <= bAction.end_time) {
    const hasHide = await existNajieThing(userId, '剑xx', '道具');

    if (!hasHide) {
      void Send(Text(`对方正在${bAction.action}中,剩余时间:${formatRemain(bAction.end_time - Date.now())}`));

      return false;
    }
  }

  // 猜大小状态检查 (对方)
  const lastGameTimeB = await getDataByKey(keysAction.lastGameTime(targetUserId));

  if (toInt(lastGameTimeB) === 0) {
    void Send(Text('对方猜大小正在进行哦，等他结束再来比武吧!'));

    return false;
  }

  const cf = await config.getConfig('xiuxian', 'xiuxian');
  const biwuCdMs = Math.floor(60000 * toInt(cf?.CD?.biwu, 5));
  const now = Date.now();
  const lastBiwuA = toInt(await getDataByKey(keysAction.lastBiwuTime(userId)));

  if (now < lastBiwuA + biwuCdMs) {
    void Send(Text(`比武正在CD中，剩余cd:  ${formatRemain(lastBiwuA + biwuCdMs - now)}`));

    return false;
  }

  // 双修冷却(复用 couple 配置)
  const coupleMs = Math.floor(60000 * toInt(cf?.CD?.couple, 0));

  if (coupleMs > 0) {
    const lastA = lastBiwuA; // 与比武 CD 存同 key

    if (now < lastA + coupleMs) {
      void Send(Text(`比武冷却:  ${formatRemain(lastA + coupleMs - now)}`));

      return false;
    }

    const lastB = toInt(await getDataByKey(keysAction.lastBiwuTime(targetUserId)));

    if (now < lastB + coupleMs) {
      void Send(Text(`对方比武冷却:  ${formatRemain(lastB + coupleMs - now)}`));

      return false;
    }
  }

  // 血量必须接近满 (使用 5/6 ≈ 83%)
  const hpThreshold = 5 / 6;

  if (playerB.当前血量 <= playerB.血量上限 * hpThreshold) {
    void Send(Text(`${playerB.名号} 血量未满，不能趁人之危哦`));

    return false;
  }

  if (playerA.当前血量 <= playerA.血量上限 * hpThreshold) {
    void Send(Text('你血量未满，对方不想趁人之危'));

    return false;
  }

  // 记录开始时间
  await setDataByKey(keysAction.lastBiwuTime(userId), String(now));
  await setDataByKey(keysAction.lastBiwuTime(targetUserId), String(now));

  const finalMsg: string[] = [];

  finalMsg.push(`${playerA.名号}向${playerB.名号}发起了比武！`);

  playerA.法球倍率 = Number(playerA.灵根?.法球倍率) || 0;
  playerB.法球倍率 = Number(playerB.灵根?.法球倍率) || 0;

  const dataBattle = await zdBattle(playerA, playerB);
  const msg = dataBattle.msg;

  if (msg.length <= 35) {
    void Send(Text(msg.join('\n')));
  }

  await addHP(userId, dataBattle.A_xue);
  await addHP(targetUserId, dataBattle.B_xue);

  const winA = `${playerA.名号}击败了${playerB.名号}`;
  const winB = `${playerB.名号}击败了${playerA.名号}`;
  const aWin = msg.includes(winA);
  const bWin = msg.includes(winB);

  if (!aWin && !bWin) {
    void Send(Text('战斗过程出错'));

    return false;
  }

  const levelList = await getDataList('Level1');
  const levelA = levelList.find(l => l.level_id === playerA.level_id)?.level_id ?? 1;
  const levelB = levelList.find(l => l.level_id === playerB.level_id)?.level_id ?? 1;

  if (aWin) {
    const qixueA = Math.trunc(1000 * levelB);
    const qixueB = Math.trunc(500 * levelA);
    const coin = Math.trunc(10 * levelA);

    await addExp2(userId, qixueA);
    await addExp2(targetUserId, qixueB);
    await addCoin(userId, coin);
    await addCoin(targetUserId, coin);

    const pA = await readPlayer(userId);

    if (pA) {
      pA.魔道值 = (Number(pA.魔道值) || 0) + 1;
      void writePlayer(userId, pA);
    }

    finalMsg.push(` 经过一番大战,${winA}获得了胜利,${playerA.名号}获得${qixueA}气血，${playerB.名号}获得${qixueB}气血，双方都获得了${coin}的灵石。`);
  } else if (bWin) {
    const qixueA = Math.trunc(500 * levelB);
    const qixueB = Math.trunc(1000 * levelA);
    const coin = Math.trunc(10 * levelA);

    await addExp2(userId, qixueA);
    await addExp2(targetUserId, qixueB);
    await addCoin(userId, coin);
    await addCoin(targetUserId, coin);

    const pB = await readPlayer(targetUserId);

    if (pB) {
      pB.魔道值 = (Number(pB.魔道值) || 0) + 1;
      void writePlayer(targetUserId, pB);
    }

    finalMsg.push(`经过一番大战,${winB}获得了胜利,${playerB.名号}获得${qixueB}气血，${playerA.名号}获得${qixueA}气血，双方都获得了${coin}的灵石。`);
  }

  void Send(Text(finalMsg.join('')));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
