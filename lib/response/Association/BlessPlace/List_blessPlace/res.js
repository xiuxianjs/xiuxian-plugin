import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import { keysByPath, __PATH, keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { getDataList } from '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';
import { isKeys } from '../../../../model/utils/isKeys.js';

const regular = /^(#|＃|\/)?洞天福地列表$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const blessRaw = await getDataList('Bless');
    const blessList = Array.isArray(blessRaw) ? blessRaw.filter(item => isKeys(item, ['name', 'level', 'efficiency'])) : [];
    if (!blessList.length) {
        void Send(Text('暂无洞天福地配置'));
        return false;
    }
    const guildNames = await keysByPath(__PATH.association);
    const datas = await Promise.all(guildNames.map(n => getDataJSONParseByKey(keys.association(n))));
    const assListRaw = datas.filter(Boolean);
    const locationMap = new Map();
    for (let idx = 0; idx < assListRaw.length; idx++) {
        const a = assListRaw[idx];
        if (!a || !isKeys(a, ['power', '宗门名称', '宗门驻地'])) {
            continue;
        }
        const assData = a;
        if (assData.宗门驻地 !== null && !locationMap.has(assData.宗门驻地)) {
            locationMap.set(assData.宗门驻地, assData.宗门名称);
        }
    }
    const rows = blessList.map(b => ({
        name: b.name,
        level: b.level,
        efficiency: b.efficiency * 100,
        ass: locationMap.get(b.name) ?? '无'
    }));
    try {
        const image = await screenshot('BlessPlace', e.UserId, {
            didian_list: rows
        });
        if (Buffer.isBuffer(image)) {
            void Send(Image(image));
            return false;
        }
        void Send(Text('生成洞天福地列表时出错'));
    }
    catch (_err) {
        void Send(Text('生成洞天福地列表时出错'));
    }
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
