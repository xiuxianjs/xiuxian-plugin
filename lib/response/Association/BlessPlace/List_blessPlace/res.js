import { useMessage, Text, Image } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { selects } from '../../../index.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import '../../../../model/settions.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import { screenshot } from '../../../../image/index.js';
import 'crypto';

const regular = /^(#|＃|\/)?洞天福地列表$/;
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
function isBlessPlace(v) {
    return (!!v &&
        typeof v === 'object' &&
        'name' in v &&
        'level' in v &&
        'efficiency' in v);
}
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const blessRaw = data.bless_list | undefined;
    const blessList = Array.isArray(blessRaw)
        ? blessRaw.filter(isBlessPlace)
        : [];
    if (!blessList.length) {
        message.send([Text('暂无洞天福地配置')]);
        return false;
    }
    const keys = await redis.keys(`${__PATH.association}:*`);
    const guildNames = keys.map(k => k.replace(`${__PATH.association}:`, ''));
    const assListRaw = await Promise.all(guildNames.map(n => data.getAssociation(n)));
    const locationMap = new Map();
    for (let idx = 0; idx < assListRaw.length; idx++) {
        const a = assListRaw[idx];
        if (a === 'error' || !isExtAss(a))
            continue;
        if (a.宗门驻地 != null && !locationMap.has(a.宗门驻地)) {
            locationMap.set(a.宗门驻地, a.宗门名称);
        }
    }
    const rows = blessList.map(b => ({
        name: b.name,
        level: b.level,
        efficiency: b.efficiency * 100,
        ass: locationMap.get(b.name) || '无'
    }));
    try {
        const image = await screenshot('BlessPlace', e.UserId, {
            didian_list: rows
        });
        if (Buffer.isBuffer(image)) {
            message.send([Image(image)]);
            return;
        }
        message.send([Text('生成洞天福地列表时出错')]);
    }
    catch (_err) {
        message.send([Text('生成洞天福地列表时出错')]);
    }
    return false;
});

export { res as default, regular };
