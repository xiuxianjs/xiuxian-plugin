import { getRedisKey } from '@src/model/keys';
import { Text, useMention, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import {
  readAction,
  isActionRunning,
  remainingMs,
  formatRemaining
} from '@src/response/actionHelper';
import { existplayer, readQinmidu, writeQinmidu, findQinmidu, readPlayer } from '@src/model/index';
import { found, chaoshi, Daolv } from '../daolv';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?^(断绝姻缘)$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const A = e.UserId;
  const ifexistplay_A = await existplayer(A);

  if (!ifexistplay_A) {
    return false;
  }
  const A_action = await readAction(A);

  if (isActionRunning(A_action)) {
    Send(Text(`正在${A_action?.action}中,剩余时间:${formatRemaining(remainingMs(A_action!))}`));

    return false;
  }
  const last_game_timeA = await redis.get(getRedisKey(A, 'last_game_time'));

  if (+last_game_timeA == 0) {
    Send(Text('猜大小正在进行哦，结束了再来吧!'));

    return false;
  }

  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) { return false; }

  const B = target.UserId;

  if (A == B) {
    Send(Text('精神分裂?'));

    return false;
  }
  const ifexistplay_B = await existplayer(B);

  if (!ifexistplay_B) {
    Send(Text('修仙者不可对凡人出手!'));

    return false;
  }
  const B_action = await readAction(B);

  if (isActionRunning(B_action)) {
    Send(Text(`对方正在${B_action!.action}中,剩余时间:${formatRemaining(remainingMs(B_action!))}`));

    return false;
  }
  const last_game_timeB = await redis.get(getRedisKey(B, 'last_game_time'));

  if (+last_game_timeB == 0) {
    Send(Text('对方猜大小正在进行哦，等他结束再找他吧!'));

    return false;
  }

  let qinmidu = [];

  try {
    qinmidu = await readQinmidu();
  } catch {
    // 没有建立一个
    await writeQinmidu([]);
  }
  const i = await found(A, B);
  const pd = await findQinmidu(A, B);

  if (pd == false) {
    Send(Text('你们还没建立关系，断个锤子'));

    return false;
  } else if (qinmidu[i].婚姻 == 0) {
    Send(Text('你们还没结婚，断个锤子'));

    return false;
  }
  if (Daolv.x == 1 || Daolv.x == 2) {
    Send(Text('有人正在缔结道侣，请稍等'));

    return false;
  }
  Daolv.set_x(2);
  Daolv.set_user_A(A);
  Daolv.set_user_B(B);
  const player_A = await readPlayer(A);
  const msg = ['\n'];

  msg.push(`${player_A.名号}要和你断绝姻缘\n回复【我同意】or【我拒绝】`);
  Send(Text(msg.join('')));
  chaoshi(e);
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
