import '../../../../model/api.js';
import { Goweizhi } from '../../../../model/image.js';
import mw, { selects } from '../../../mw.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?宗门秘境$/;
const res = onResponse(selects, async (e) => {
    const raw = data.guildSecrets_list;
    await Goweizhi(e, raw);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
