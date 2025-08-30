import { goWeizhi } from '@src/model/image';
import { selects } from '@src/response/mw';
import { existplayer } from '@src/model/index';

export const regular = /^(#|＃|\/)?秘境$/;
const res = onResponse(selects, async e => {
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  const didian = await getDataList('Didian');

  if (!Array.isArray(didian) || didian.length === 0) {
    return false;
  }

  await goWeizhi(e, didian);

  return false;
});

import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
export default onResponse(selects, [mw.current, res.current]);
