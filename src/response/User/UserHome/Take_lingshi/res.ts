import { Text, useSend } from 'alemonjs';

import {
  existplayer,
  Go,
  readPlayer,
  readNajie,
  convert2integer,
  addBagCoin,
  addCoin
} from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?(存|取)灵石(.*)$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return false;
  }
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  // 检索方法
  const reg = new RegExp(/取|存/);
  const func = reg.exec(e.MessageText)[0];
  let msg = e.MessageText.replace(reg, '');

  msg = msg.replace(/^(#|＃|\/)?/, '');
  // 提取灵石数量（可能是具体数字或“全部”），避免使用 any
  let lingshi: string | number = msg.replace('灵石', '').trim();

  if (func === '存' && lingshi === '全部') {
    const P = await readPlayer(usr_qq);

    lingshi = P.灵石;
  }
  if (func === '取' && lingshi === '全部') {
    const N = await readNajie(usr_qq);

    lingshi = N.灵石;
  }
  if (typeof lingshi !== 'number') {
    lingshi = await convert2integer(lingshi);
  }
  if (func === '存') {
    const player_info = await readPlayer(usr_qq);
    const player_lingshi = player_info.灵石;

    if (player_lingshi < lingshi) {
      void Send(Text(`灵石不足,你目前只有${player_lingshi}灵石`));

      return false;
    }
    const najie = await readNajie(usr_qq);

    if (najie.灵石上限 < najie.灵石 + lingshi) {
      await addBagCoin(usr_qq, najie.灵石上限 - najie.灵石);
      await addCoin(usr_qq, -najie.灵石上限 + najie.灵石);
      void Send(Text(`已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`));

      return false;
    }
    await addBagCoin(usr_qq, lingshi);
    await addCoin(usr_qq, -lingshi);
    void Send(
      Text(`储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${najie.灵石 + lingshi}灵石`)
    );

    return false;
  }
  if (func === '取') {
    const najie = await readNajie(usr_qq);

    if (najie.灵石 < lingshi) {
      void Send(Text(`纳戒灵石不足,你目前最多取出${najie.灵石}灵石`));

      return false;
    }
    // 取出时无需读取玩家灵石（不参与判断与输出），避免未使用变量
    await addBagCoin(usr_qq, -lingshi);
    await addCoin(usr_qq, lingshi);
    void Send(Text(`本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`));

    return false;
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
