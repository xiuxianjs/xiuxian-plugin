import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { Goweizhi } from '../../../../model/image.js';
import { selects } from '../../../index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?宗门秘境$/;
function isGuildSecret(v) {
    return !!v && typeof v === 'object' && 'name' in v;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const raw = data.guildSecrets_list;
    const list = Array.isArray(raw)
        ? raw.filter(isGuildSecret)
        : [];
    if (!list.length) {
        Send(Text('暂无宗门秘境配置'));
        return false;
    }
    const namedList = list.map(i => ({ name: i.name }));
    await Goweizhi(e, namedList);
    return false;
});

export { res as default, regular };
