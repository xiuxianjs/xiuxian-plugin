import { Text, useSend } from 'alemonjs';
import { __PATH, keysByPath, writeDuanlu } from '@src/model/index';
import { stopActionWithSuffix } from '@src/model/actionHelper';
import { setValue, userKey } from '@src/model/utils/redisHelper';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?全体清空锻炉/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return false;
  }
  await writeDuanlu([]);
  const playerList = await keysByPath(__PATH.player_path);

  for (const playerId of playerList) {
    await stopActionWithSuffix(playerId, 'action10');
    await setValue(userKey(playerId, 'action10'), null);
  }
  void Send(Text('清除完成'));
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
