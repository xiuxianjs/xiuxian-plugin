import { Text, useSend } from 'alemonjs';

import { foundthing } from '@src/model/cultivation';
import { updateBagThing } from '@src/model/najie';
import { existplayer, readNajie } from '@src/model/xiuxian_impl';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?(锁定|解锁).*$/;

interface BagPet {
  name: string;
}
interface BagEquip {
  name: string;
  pinji?: string | number;
}
interface NajieLike {
  仙宠?: BagPet[];
  装备?: BagEquip[];
}

type NajieCategory = Parameters<typeof updateBagThing>[2];

function parseCommand(raw: string) {
  const msg = raw.replace(/^(#|＃|\/)?/, '').trim();
  const action = msg.slice(0, 2);
  const rest = msg.slice(2);

  return { action, rest };
}

const PINJI_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
};

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const { action, rest } = parseCommand(e.MessageText);

  if (!['锁定', '解锁'].includes(action)) {
    return false;
  }

  const parts = rest
    .split('*')
    .map(s => s.trim())
    .filter(Boolean);

  if (!parts[0]) {
    void Send(Text('未指定物品名称或序号'));

    return false;
  }

  let thingName = parts[0];
  let qualityToken = parts[1] || '';

  const najieRaw = await readNajie(userId);
  const najie = najieRaw as NajieLike;

  const index = Number(thingName);

  if (Number.isFinite(index) && index >= 0) {
    if (index > 1000) {
      const pet = najie.仙宠?.[index - 1001];

      if (!pet) {
        void Send(Text('仙宠代号输入有误'));

        return false;
      }
      thingName = pet.name;
    } else if (index > 100) {
      const equip = najie.装备?.[index - 101];

      if (!equip) {
        void Send(Text('装备代号输入有误'));

        return false;
      }
      thingName = equip.name;
      if (equip.pinji !== undefined) {
        qualityToken = String(equip.pinji);
      }
    }
  }

  const thingDef = await foundthing(thingName);

  if (!thingDef) {
    void Send(Text(`不存在的物品: ${thingName}`));

    return false;
  }

  const thingPinji = PINJI_MAP[qualityToken];
  const pinjiNum = typeof thingPinji === 'number' ? thingPinji : 0;

  const category = String(thingDef.class) as NajieCategory;
  const lockFlag = action === '锁定' ? 1 : 0;
  const updated = await updateBagThing(userId, thingName, category, pinjiNum, lockFlag);

  if (updated) {
    void Send(Text(`${category}:${thingName}${action === '锁定' ? '已锁定' : '已解锁'}`));

    return false;
  }
  void Send(Text(`你没有【${thingName}】这样的${category}`));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
