import { Text, useSend } from 'alemonjs';

import { existplayer, foundthing, readNajie, addNajieThing, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw';
import type { NajieCategory } from '@src/types/model';
export const regular = /^(#|＃|\/)?回收.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  //固定写法
  const usr_qq = e.UserId;
  const ifexistplay = await existplayer(usr_qq);
  if (!ifexistplay) return false;
  let thing_name = e.MessageText.replace(/^(#|＃|\/)?回收/, '');
  thing_name = thing_name.trim();
  const thing_exist = await foundthing(thing_name);
  if (thing_exist) {
    Send(Text(`${thing_name}可以使用,不需要回收`));
    return false;
  }
  let lingshi = 0;
  const najie = await readNajie(usr_qq);
  if (!najie) return false;
  const type: NajieCategory[] = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
  ];
  for (const cate of type) {
    const list = najie[cate];
    if (!Array.isArray(list)) continue;
    const thing = (
      list as Array<{
        name: string;
        出售价?: number;
        数量?: number;
        class?: string;
        pinji?: number;
      }>
    ).find(item => item.name == thing_name);
    if (!thing) continue;
    const sell = typeof thing.出售价 === 'number' ? thing.出售价 : 0;
    const num = typeof thing.数量 === 'number' ? thing.数量 : 0;
    const cls = (thing.class as NajieCategory) || cate;
    if (cls == '材料' || cls == '草药') {
      lingshi += sell * num;
    } else {
      lingshi += sell * 2 * num;
    }
    if (num !== 0) {
      await addNajieThing(usr_qq, thing.name, cls, -num, thing.pinji);
    }
  }
  await addCoin(usr_qq, lingshi);
  Send(Text(`回收成功,获得${lingshi}灵石`));
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
