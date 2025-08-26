import { Goweizhi } from '@src/model/image';
import { selects } from '@src/response/mw';
import { existplayer } from '@src/model/index';
import { getDataList } from '@src/model/DataList';
import type { NamedItem } from '@src/types/model';

export const regular = /^(#|＃|\/)?仙境$/;
const res = onResponse(selects, async e => {
  const usr_qq = e.UserId;

  if (!(await existplayer(usr_qq))) {
    return false;
  }
  const list = (await getDataList('FairyRealm') || []) as NamedItem[];

  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  await Goweizhi(e as import('alemonjs').EventsMessageCreateEnum, list);

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
