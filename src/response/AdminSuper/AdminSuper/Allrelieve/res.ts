import { Text, useSend } from 'alemonjs';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { __PATH, delDataByKey, keysAction, keysByPath } from '@src/model/index';
export const regular = /^(#|＃|\/)?解除所有$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return;
  }
  void Send(Text('开始行动！'));
  const playerList = await keysByPath(__PATH.player_path);

  for (const playerId of playerList) {
    void delDataByKey(keysAction.gameAction(playerId));
    void delDataByKey(keysAction.action(playerId));
  }
  void Send(Text('行动结束！'));
});

export default onResponse(selects, [mw.current, res.current]);
