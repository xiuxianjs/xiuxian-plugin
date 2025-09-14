import { getDataList } from '@src/model/DataList';
import { goWeizhi } from '@src/model/image';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';

export const regular = /^(#|＃|\/)?宗门秘境$/;

const res = onResponse(selects, async e => {
  const raw = await getDataList('GuildSecrets');

  void goWeizhi(e, raw);
});

export default onResponse(selects, [mw.current, res.current]);
