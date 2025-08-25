import { Text, useMessage, Image } from 'alemonjs';

import { selects } from '@src/response/mw';
import { __PATH, keys, keysByPath } from '@src/model/index';
import { getDataList } from '@src/model/DataList';
import { screenshot } from '@src/image';
import type { AssociationDetailData } from '@src/types';

export const regular = /^(#|＃|\/)?洞天福地列表$/;

interface ExtAss extends AssociationDetailData {
  宗门驻地?: string | number;
  宗门名称: string;
}
function isExtAss (v): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
interface BlessPlace {
  name: string;
  level: number;
  efficiency: number;
}
function isBlessPlace (v): v is BlessPlace {
  return !!v && typeof v === 'object' && 'name' in v && 'level' in v && 'efficiency' in v;
}

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const blessRaw = await getDataList('Bless');
  const blessList: BlessPlace[] = Array.isArray(blessRaw) ? blessRaw.filter(isBlessPlace) : [];
  if (!blessList.length) {
    message.send([Text('暂无洞天福地配置')]);
    return false;
  }
  const guildNames = await keysByPath(__PATH.association);
  const datas = await Promise.all(guildNames.map(n => getDataJSONParseByKey(keys.association(n))));
  const assListRaw = datas.filter(Boolean);
  const locationMap = new Map<string | number, string>();
  for (let idx = 0; idx < assListRaw.length; idx++) {
    const a = assListRaw[idx];
    if (a === 'error' || !isExtAss(a)) continue;
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
  } catch (_err) {
    message.send([Text('生成洞天福地列表时出错')]);
  }
  return false;
});
import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
