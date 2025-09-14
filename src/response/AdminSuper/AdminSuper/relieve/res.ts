import { Text, useMention, useSend } from 'alemonjs';

import { delDataByKey, existplayer, keysAction } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?解封.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return;
  }

  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    return;
  }
  // 对方qq
  const qq = target.UserId;
  // 检查存档
  const ifexistplay = await existplayer(qq);

  if (!ifexistplay) {
    return;
  }

  void delDataByKey(keysAction.gameAction(qq));

  void delDataByKey(keysAction.action(qq));

  void Send(Text('已强制解除'));
});

export default onResponse(selects, [mw.current, res.current]);
