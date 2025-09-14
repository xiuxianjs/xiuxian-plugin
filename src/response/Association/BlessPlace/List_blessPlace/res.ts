import { Text, useSend, Image } from 'alemonjs';
import { __PATH, keys, keysByPath } from '@src/model/index';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { screenshot } from '@src/image';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?洞天福地列表$/;

const res = onResponse(selects, async e => {
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
  const locationMap = new Map<string | number, string>();

  for (let idx = 0; idx < assListRaw.length; idx++) {
    const a = assListRaw[idx];

    if (!a || !isKeys(a, ['power', '宗门名称', '宗门驻地'])) {
      continue;
    }

    const assData = a as any;

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
  } catch (_err) {
    void Send(Text('生成洞天福地列表时出错'));
  }

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
