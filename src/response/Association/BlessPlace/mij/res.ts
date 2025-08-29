import { getDataList } from '@src/model/DataList';
import { Goweizhi } from '@src/model/image';
import { selects } from '@src/response/mw';

export const regular = /^(#|＃|\/)?宗门秘境$/;

const res = onResponse(selects, async e => {
  const raw = await getDataList('GuildSecrets');

  await Goweizhi(e, raw);

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
