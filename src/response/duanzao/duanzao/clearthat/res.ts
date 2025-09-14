import { Text, useSend } from 'alemonjs';

import { existplayer, looktripod, readTripod, writeDuanlu } from '@src/model/index';
import { stopActionWithSuffix } from '@src/model/actionHelper';
import { setValue, userKey } from '@src/model/utils/redisHelper';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?清空锻炉/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }
  const A = await looktripod(userId);

  if (A === 1) {
    const newtripod = await readTripod();

    for (const item of newtripod) {
      if (userId === item.qq) {
        item.材料 = [];
        item.数量 = [];
        item.TIME = 0;
        item.时长 = 30000;
        item.状态 = 0;
        item.预计时长 = 0;
        await writeDuanlu(newtripod);
        await stopActionWithSuffix(userId, 'action10');
        // 显式清空 key（兼容旧逻辑使用 null）
        await setValue(userKey(userId, 'action10'), null);
        void Send(Text('材料成功清除'));

        return false;
      }
    }
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
