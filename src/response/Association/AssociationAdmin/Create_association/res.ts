import { Text, useMessage, useSubscribe } from 'alemonjs';

import { keys, notUndAndNull, setFileValue, timestampToTime } from '@src/model/index';
import { getDataList } from '@src/model/DataList';
import { readPlayer, existplayer, writePlayer } from '@src/model/index';

import mw, { selects } from '@src/response/mw';
import { existDataByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
export const regular = /^(#|＃|\/)?开宗立派$/;

const res = onResponse(selects, async e => {
  const usr_qq = e.UserId;
  const [message] = useMessage(e);
  // 使用existplayer检查玩家是否存在
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) {
    return;
  }
  const player = await readPlayer(usr_qq);

  if (!player) {
    return false;
  }
  const levelList = await getDataList('Level1');
  const now_level_id = levelList.find(item => item.level_id == player.level_id).level_id;

  if (now_level_id < 22) {
    message.send(format(Text('修为达到化神再来吧')));

    return false;
  }
  if (notUndAndNull(player.宗门)) {
    message.send(format(Text('已经有宗门了')));

    return false;
  }
  if (player.灵石 < 10000) {
    message.send(format(Text('开宗立派是需要本钱的,攒到一万灵石再来吧')));

    return false;
  }
  /** 回复 */
  message.send(format(Text('请发送宗门名字,一旦设立,无法再改,请慎重取名,(宗门名字最多6个中文字符)\n想改变主意请回复:【取消】')));
  /** 设置上下文 */
  const [subscribe] = useSubscribe(e, selects);

  const sub = subscribe.mount(
    async(event, next) => {
      const association_name = event.MessageText;

      if (/^(#|＃|\/)?取消$/.test(association_name)) {
        message.send(format(Text('已取消创建宗门')));
        clearTimeout(timeout);

        return;
      }
      // res为true表示存在汉字以外的字符
      if (!/^[\u4e00-\u9fa5]+$/.test(association_name)) {
        message.send(format(Text('宗门名字只能使用中文,请重新输入:\n想改变主意请回复:【取消】')));
        next();

        return;
      }
      if (association_name.length > 6) {
        message.send(format(Text('宗门名字最多只能设置6个字符,请重新输入:\n想改变主意请回复:【取消】')));
        next();

        return;
      }
      const ifexistass = await existDataByKey(keys.association(association_name));

      if (ifexistass) {
        message.send(format(Text('该宗门已经存在,请重新输入:\n想改变主意请回复:【取消】')));
        next();

        return;
      }
      clearTimeout(timeout);

      const now = new Date();
      const nowTime = now.getTime(); // 获取当前时间戳
      const date = timestampToTime(nowTime);
      const player = await readPlayer(usr_qq);

      player.宗门 = {
        宗门名称: association_name,
        职位: '宗主',
        time: [date, nowTime]
      };
      await writePlayer(usr_qq, player);
      await new_Association(association_name, usr_qq, e);
      await setFileValue(usr_qq, -10000, '灵石');
      message.send(format(Text('宗门创建成功')));
    },
    ['UserId']
  );
  const timeout = setTimeout(
    () => {
      try {
        // 不能在回调中执行
        subscribe.cancel(sub);
        message.send(format(Text('创建宗门超时,已取消')));
      } catch (e) {
        logger.error('取消订阅失败', e);
      }
    },
    1000 * 60 * 1
  ); // 60秒超时
});

async function new_Association(name, holder_qq, e) {
  const usr_qq = e.UserId;
  const player = await readPlayer(usr_qq);
  const levelList = await getDataList('Level1');
  const now_level_id = levelList.find(item => item.level_id == player.level_id).level_id;
  const isHigh = now_level_id > 41;
  const x = isHigh ? 1 : 0;
  const xian = isHigh ? 10 : 1;
  const dj = isHigh ? 42 : 1;
  const now = new Date();
  const nowTime = now.getTime(); // 获取当前时间戳
  const date = timestampToTime(nowTime);
  const Association = {
    宗门名称: name,
    宗门等级: 1,
    创立时间: [date, nowTime],
    灵石池: 0,
    宗门驻地: 0,
    宗门建设等级: 0,
    宗门神兽: 0,
    宗主: holder_qq,
    副宗主: [],
    长老: [],
    内门弟子: [],
    外门弟子: [],
    所有成员: [holder_qq],
    药园: {
      药园等级: 1,
      作物: [{ name: '凝血草', start_time: nowTime, who_plant: holder_qq }]
    },
    维护时间: nowTime,
    大阵血量: 114514 * xian,
    最低加入境界: dj,
    power: x
  };

  await setDataJSONStringifyByKey(keys.association(name), Association);
}

export default onResponse(selects, [mw.current, res.current]);
