import { getRedisKey, keys } from '@src/model/keys';
import { Text, useSend } from 'alemonjs';
import { redis, config } from '@src/model/api';
import { readPlayer, notUndAndNull, addCoin } from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { openMoneySystem } from '@src/model/money';
import { game } from '../game';
import { setDataJSONStringifyByKey } from '@src/model/DataControl';

export const regular = /^(#|＃|\/)?((大|小)|([1-6]))$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  const gameAction = await redis.get(getRedisKey(userId, 'game_action'));

  if (gameAction && +gameAction !== 1) {
    return false;
  }

  //
  if (isNaN(game.yazhu[userId])) {
    return false;
  }

  //
  if (!game.game_key_user[userId] || !game.yazhu[userId]) {
    void Send(Text('媚娘：公子，你还没投入呢\n>取消请发送【取消梭哈】或【取消投入】'));

    return false;
  }

  const es = e.MessageText.replace(/^(#|＃|\/)?/, '');

  // 判断输入是否合法，只接受“大”或“小”或1-6
  if (es !== '大' && es !== '小' && ![1, 2, 3, 4, 5, 6].includes(parseInt(es))) {
    return false;
  }

  const onClear = async () => {
    // 清理与结束相关逻辑
    await redis.set(getRedisKey(userId, 'last_game_time'), Date.now());
    await redis.del(getRedisKey(userId, 'game_action'));
    game.yazhu[userId] = 0;
    game.game_key_user[userId] = false;
  };

  let isWin = false;
  let touzi = 0;

  // -1 视为全押
  const inputMoney = game.yazhu[userId] === -1 ? player.灵石 - 1 : game.yazhu[userId];

  if (inputMoney >= player.灵石) {
    void onClear();
    void Send(Text('媚娘：你这是要把裤衩都输光吗？'));

    return;
  }

  if (inputMoney < 10000) {
    void onClear();
    void Send(Text('媚娘：你身上已不足1w灵石'));

    return;
  }

  function ensureNumber(v): number {
    return typeof v === 'number' ? v : parseInt(String(v || 0)) || 0;
  }

  if (/(大|小)/.test(es)) {
    // 统一转换为boolean
    const isBig = /大/.test(es);

    // 调用系统核心逻辑 (对象返回结构)
    const { win, dice } = await openMoneySystem(isBig, inputMoney);

    isWin = win;
    touzi = dice;

    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const x = cf.percentage.Moneynumber;

    if (isWin) {
      const outMoney = Math.trunc(inputMoney * x);

      if (notUndAndNull(player.金银坊胜场)) {
        player.金银坊胜场 = ensureNumber(player.金银坊胜场) + 1;
        player.金银坊收入 = ensureNumber(player.金银坊收入) + ensureNumber(outMoney);
      } else {
        player.金银坊胜场 = 1;
        player.金银坊收入 = ensureNumber(outMoney);
      }
      await setDataJSONStringifyByKey(keys.player(userId), player);

      // 5%的概率怀疑出老千
      if (Math.random() < 0.05) {
        // 出老千。赢了反而为扣。1w灵石。

        void addCoin(userId, -9999);

        void Send(Text(`骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。\n现在拥有灵石:${player.灵石 - 9999}`));
      } else {
        void addCoin(userId, outMoney);
        void Send(Text(`骰子最终为 ${touzi} 你猜对了！\n现在拥有灵石:${player.灵石 + outMoney}`));
      }
    } else {
      // 输了
      if (notUndAndNull(player.金银坊败场)) {
        player.金银坊败场 = ensureNumber(player.金银坊败场) + 1;
        player.金银坊支出 = ensureNumber(player.金银坊支出) + inputMoney;
      } else {
        player.金银坊败场 = 1;
        player.金银坊支出 = inputMoney;
      }
      await setDataJSONStringifyByKey(keys.player(userId), player);
      void addCoin(userId, -inputMoney);
      const nowMoney = player.灵石 - inputMoney;

      //
      const msg = [`骰子最终为 ${touzi} 你猜错了！\n现在拥有灵石:${nowMoney}`];

      if (nowMoney <= 1) {
        msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去赚钱吧！');
      }

      void Send(Text(msg.join('')));
    }
  } else {
    // 猜数字直接判断是否相等，猜中3倍收益
    const inputNumber = parseInt(es);

    touzi = Math.floor(Math.random() * 6) + 1;
    isWin = inputNumber === touzi;

    if (isWin) {
      const outMoney = inputMoney * 5;

      if (notUndAndNull(player.金银坊胜场)) {
        player.金银坊胜场 = ensureNumber(player.金银坊胜场) + 1;
        player.金银坊收入 = ensureNumber(player.金银坊收入) + outMoney;
      } else {
        player.金银坊胜场 = 1;
        player.金银坊收入 = outMoney;
      }
      await setDataJSONStringifyByKey(keys.player(userId), player);
      void addCoin(userId, outMoney);
      void Send(Text(`骰子最终为 ${touzi}，你猜中了！获得${outMoney}灵石\n现在拥有灵石:${player.灵石 + outMoney}`));

      //
    } else {
      if (notUndAndNull(player.金银坊败场)) {
        player.金银坊败场 = ensureNumber(player.金银坊败场) + 1;
        player.金银坊支出 = ensureNumber(player.金银坊支出) + inputMoney;
      } else {
        player.金银坊败场 = 1;
        player.金银坊支出 = inputMoney;
      }
      await setDataJSONStringifyByKey(keys.player(userId), player);
      void addCoin(userId, -inputMoney);
      const nowMoney = player.灵石 - inputMoney;
      const msg = [`骰子最终为 ${touzi}，你猜错了！\n现在拥有灵石:${nowMoney}`];

      if (nowMoney <= 1) {
        msg.push('\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去赚钱吧！');
      }

      void Send(Text(msg.join('')));
    }
  }

  void onClear();

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
