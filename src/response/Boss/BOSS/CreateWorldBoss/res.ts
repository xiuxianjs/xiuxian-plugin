import { InitWorldBoss } from '../../../../model/boss';

export const selects = onSelects(['message.create']);
export const regular = /^(#|＃|\/)?开启妖王$/;

const res = onResponse(selects, async e => {
  if (!e || e.IsMaster) {
    await InitWorldBoss();

    return false;
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
