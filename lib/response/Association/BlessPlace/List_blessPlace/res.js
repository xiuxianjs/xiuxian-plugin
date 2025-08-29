import { useMessage, Text, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { keysByPath, __PATH, keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/api.js';
import '@alemonjs/db';
import 'dayjs';
import { getDataList } from '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import { screenshot } from '../../../../image/index.js';
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?洞天福地列表$/;
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
function isBlessPlace(v) {
    return !!v && typeof v === 'object' && 'name' in v && 'level' in v && 'efficiency' in v;
}
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const blessRaw = await getDataList('Bless');
    const blessList = Array.isArray(blessRaw) ? blessRaw.filter(isBlessPlace) : [];
    if (!blessList.length) {
        void message.send([Text('暂无洞天福地配置')]);
        return false;
    }
    const guildNames = await keysByPath(__PATH.association);
    const datas = await Promise.all(guildNames.map(n => getDataJSONParseByKey(keys.association(n))));
    const assListRaw = datas.filter(Boolean);
    const locationMap = new Map();
    for (let idx = 0; idx < assListRaw.length; idx++) {
        const a = assListRaw[idx];
        if (a === 'error' || !isExtAss(a)) {
            continue;
        }
        if (a.宗门驻地 !== null && !locationMap.has(a.宗门驻地)) {
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
            void message.send([Image(image)]);
            return;
        }
        void message.send([Text('生成洞天福地列表时出错')]);
    }
    catch (_err) {
        void message.send([Text('生成洞天福地列表时出错')]);
    }
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
