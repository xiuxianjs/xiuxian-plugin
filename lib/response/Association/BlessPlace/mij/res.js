import { getDataList } from '../../../../model/DataList.js';
import { goWeizhi } from '../../../../model/image.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?宗门秘境$/;
const res = onResponse(selects, async (e) => {
    const raw = await getDataList('GuildSecrets');
    void goWeizhi(e, raw);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
