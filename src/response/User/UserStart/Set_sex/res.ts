import { Text, useSend } from 'alemonjs';

import { data } from '@src/model/api';
import { existplayer, readPlayer } from '@src/model/index';
import type { Player, JSONValue } from '@src/types';

import mw, { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?设置性别.*$/;

type Gender = '男' | '女';
function normalizeGender(input: string): Gender | null {
  const v = input.trim();

  if (v === '男' || v === '女') {
    return v;
  }

  return null;
}
function serializePlayer(p: Player): Record<string, JSONValue> {
  const r: Record<string, JSONValue> = {};

  for (const [k, v] of Object.entries(p)) {
    if (typeof v === 'function') {
      continue;
    }
    if (v && typeof v === 'object') {
      r[k] = JSON.parse(JSON.stringify(v));
    } else {
      r[k] = v as JSONValue;
    }
  }

  return r;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  if (!(await existplayer(usr_qq))) {
    return false;
  }
  const player = await readPlayer(usr_qq);

  if (player.sex && player.sex !== '0') {
    Send(Text('每个存档仅可设置一次性别！'));

    return false;
  }
  const raw = e.MessageText.replace(/^(#|＃|\/)?设置性别/, '');
  const gender = normalizeGender(raw);

  if (!gender) {
    Send(Text('用法: #设置性别男 或 #设置性别女'));

    return false;
  }
  // 约定: sex 2=男 1=女 0=未设置
  player.sex = gender === '男' ? '2' : '1';
  await data.setData('player', usr_qq, serializePlayer(player));
  Send(Text(`${player.名号}的性别已成功设置为 ${gender}。`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
