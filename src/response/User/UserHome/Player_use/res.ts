import { Text, useMessage } from 'alemonjs';
import { readPlayer, readNajie } from '@src/model';
import { selects } from '@src/response/mw-captcha';
import { parseCommand, validateThing } from './utils';
import { handleEquipment } from './equipment';
import { handleConsume } from './consume';
import { handleDanyao } from './danyao';
import { handleStudy } from './study';
import type { CommandType } from './types';

export const regular = /^(#|＃|\/)?(装备|消耗|服用|学习)\s*\S+/;

const res = onResponse(selects, async e => {
  const userId = e.UserId;
  const [message] = useMessage(e);

  // 获取玩家信息
  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  // 获取纳戒信息
  const najie = await readNajie(userId);

  if (!najie) {
    return;
  }

  // 解析指令类型
  const startCode = /装备|消耗|服用|学习/.exec(e.MessageText)?.[0] as CommandType;

  if (!startCode) {
    return;
  }

  // 提取消息内容
  const msg = e.MessageText.replace(/^(#|＃|\/)?(装备|消耗|服用|学习)/, '').trim();

  if (!msg) {
    return;
  }

  // 解析命令参数
  const parseResult = await parseCommand(msg, startCode, najie);

  if (!parseResult) {
    void message.send(format(Text('装备代号输入有误!')));

    return;
  }

  const { thingName, quantity, pinji, thingExist, thingClass } = parseResult;

  // 验证物品存在性
  const isValid = await validateThing(userId, thingName, thingClass, pinji, quantity, startCode);

  if (!isValid) {
    void message.send(format(Text(`你没有【${thingName}】这样的【${thingClass}】`)));

    return;
  }

  // 根据指令类型分发处理
  switch (startCode) {
    case '装备': {
      const success = await handleEquipment(userId, thingName, pinji, najie, e);

      if (!success) {
        void message.send(format(Text(`找不到可装备的 ${thingName}`)));
      }
      break;
    }

    case '服用': {
      if (thingClass !== '丹药') {
        return;
      }

      await handleDanyao(userId, thingName, thingExist, player, quantity, message);
      break;
    }

    case '消耗': {
      await handleConsume(userId, thingName, thingExist, player, quantity, message, e);
      break;
    }

    case '学习': {
      await handleStudy(userId, thingName, message);
      break;
    }

    default: {
      void message.send(format(Text('未知指令类型')));
      break;
    }
  }
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
