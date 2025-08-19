import '../../../../model/api.js';
import { Goweizhi } from '../../../../model/image.js';
import { selects } from '../../../mw.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?宗门秘境$/;
var res = onResponse(selects, async (e) => {
    const raw = data.guildSecrets_list;
    await Goweizhi(e, raw);
    return false;
});

export { res as default, regular };
