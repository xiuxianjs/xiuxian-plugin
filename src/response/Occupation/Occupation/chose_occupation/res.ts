import { Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import {
  Go,
  existplayer,
  readPlayer,
  notUndAndNull,
  existNajieThing,
  addNajieThing,
  writePlayer,
  keys
} from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?转职.*$/;

interface OccupationItem {
  name: string;
}
interface FuzhiData {
  职业名: string;
  职业经验: number;
  职业等级: number;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const flag = await Go(e);

  if (!flag) {
    return false;
  }
  if (!(await existplayer(usr_qq))) {
    return false;
  }

  const occupation = e.MessageText.replace(/^(#|＃|\/)?转职/, '').trim();

  if (!occupation) {
    Send(Text('格式: 转职职业名'));

    return false;
  }
  const player = await readPlayer(usr_qq);

  if (!player) {
    Send(Text('玩家数据读取失败'));

    return false;
  }
  const player_occupation = String(player.occupation || '');
  const occupation_list = (await getDataList('Occupation')) as OccupationItem[];
  const targetOcc = occupation_list.find(o => o.name === occupation);

  if (!notUndAndNull(targetOcc)) {
    Send(Text(`没有[${occupation}]这项职业`));

    return false;
  }
  const levelList = await getDataList('Level1');
  const levelRow = levelList.find(item => item.level_id == player.level_id);
  const now_level_id = levelRow ? levelRow.level_id : 0;

  if (now_level_id < 17 && occupation === '采矿师') {
    Send(Text('包工头:就你这小身板还来挖矿？再去修炼几年吧'));

    return false;
  }
  const thing_name = occupation + '转职凭证';
  const thing_class = '道具';
  const thing_quantity = await existNajieThing(usr_qq, thing_name, thing_class);

  if (!thing_quantity || thing_quantity <= 0) {
    Send(Text(`你没有【${thing_name}】`));

    return false;
  }
  if (player_occupation === occupation) {
    Send(Text(`你已经是[${player_occupation}]了，可使用[职业转化凭证]重新转职`));

    return false;
  }
  await addNajieThing(usr_qq, thing_name, thing_class, -1);

  // 如果当前没有主职业
  if (!player_occupation || player_occupation.length === 0) {
    player.occupation = occupation;
    player.occupation_level = 1;
    player.occupation_exp = 0;
    await writePlayer(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${occupation}]`));

    return false;
  }

  // 存储原主职业为副职（覆盖逻辑简化：只保留最近一次）
  const fuzhi: FuzhiData = {
    职业名: player_occupation,
    职业经验: Number(player.occupation_exp) || 0,
    职业等级: Number(player.occupation_level) || 1
  };

  await setDataJSONStringifyByKey(keys.fuzhi(usr_qq), fuzhi);
  player.occupation = occupation;
  player.occupation_level = 1;
  player.occupation_exp = 0;
  await writePlayer(usr_qq, player);
  void Send(Text(`恭喜${player.名号}转职为[${occupation}], 你的副职为${fuzhi.职业名}`));

  return false;
});

import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
import { setDataJSONStringifyByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
