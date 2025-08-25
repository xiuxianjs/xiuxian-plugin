import { Text, useMention, useSend } from 'alemonjs';

import { data } from '@src/model/api';
import { existplayer, addNajieThing } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?一键赠送([\u4e00-\u9fa5]+)?$/;

const ALL_TYPES = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const A_qq = e.UserId;

  if (!(await existplayer(A_qq))) {
    return false;
  }

  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    return false;
  }

  const B_qq = target.UserId;

  if (!(await existplayer(B_qq))) {
    Send(Text('此人尚未踏入仙途'));

    return false;
  }

  // 解析类型参数（支持多个类型，或不填则为全部）
  const typeArg = (e.MessageText.match(/一键赠送([\u4e00-\u9fa5]+)?$/) || [])[1];
  let targetTypes: string[];

  if (!typeArg) {
    targetTypes = ALL_TYPES;
  } else {
    // 分词：每一位汉字视为一个类型
    targetTypes = typeArg
      .split('')
      .filter(t => ALL_TYPES.includes(t) || ALL_TYPES.includes(t + '宠口粮')); // 兼容“仙宠口粮”
    // 检查是否有非法类型
    if (targetTypes.length === 0) {
      Send(Text('物品类型错误，仅支持：' + ALL_TYPES.join('、')));

      return false;
    }
  }

  const A_najie = await data.getData('najie', A_qq);
  const sendTypes: string[] = [];
  const nothingToSend: string[] = [];

  for (const type of targetTypes) {
    const items = A_najie[type];

    if (!Array.isArray(items) || !items.length) {
      nothingToSend.push(type);
      continue;
    }
    let sent = false;

    for (const l of items) {
      if (l && l.islockd == 0 && Number(l.数量) > 0) {
        const quantity = Number(l.数量);

        if (type === '装备' || type === '仙宠') {
          await addNajieThing(B_qq, l, l.class, quantity, l.pinji);
          await addNajieThing(A_qq, l, l.class, -quantity, l.pinji);
        } else {
          await addNajieThing(A_qq, l.name, l.class, -quantity);
          await addNajieThing(B_qq, l.name, l.class, quantity);
        }
        sent = true;
      }
    }
    if (sent) {
      sendTypes.push(type);
    } else {
      nothingToSend.push(type);
    }
  }

  let msg = '';

  if (sendTypes.length) {
    msg += `已赠送：${sendTypes.join('、')}\n`;
  }
  if (nothingToSend.length) {
    msg += `无可赠送：${nothingToSend.join('、')}`;
  }
  Send(Text(msg.trim() || '一键赠送完成'));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
