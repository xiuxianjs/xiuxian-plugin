import { Text, useSend } from 'alemonjs';

import { existplayer, keys, readPlayer } from '@src/model/index';

import mw, { selects } from '@src/response/mw-captcha';
import { setDataJSONStringifyByKey } from '@src/model/DataControl';
export const regular = /^(#|＃|\/)?设置性别.*$/;

type Gender = '男' | '女';
function normalizeGender(input: string): Gender | null {
  const v = input.trim();

  if (v === '男' || v === '女') {
    return v;
  }

  return null;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  const player = await readPlayer(userId);

  if (player.sex && player.sex !== '0') {
    void Send(Text('每个存档仅可设置一次性别！'));

    return false;
  }
  const raw = e.MessageText.replace(/^(#|＃|\/)?设置性别/, '');
  const gender = normalizeGender(raw);

  if (!gender) {
    void Send(Text('用法: #设置性别男 或 #设置性别女'));

    return false;
  }
  // 约定: sex 2=男 1=女 0=未设置
  player.sex = gender === '男' ? '2' : '1';
  void setDataJSONStringifyByKey(keys.player(userId), player);
  void Send(Text(`${player.名号}的性别已成功设置为 ${gender}。`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
