import '../../../../api/api.js';
import { Goweizhi } from '../../../../model/image.js';
import { selects } from '../../../index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?仙境$/;
var res = onResponse(selects, async (e) => {
    let weizhi = data.Fairyrealm_list;
    await Goweizhi(e, weizhi);
});

export { res as default, regular };
