import { Image, Text, useSend } from 'alemonjs';
import { existplayer, __PATH, sortBy, sleep, readPlayer, keysByPath, keys } from '@src/model/index';
import { selects } from '@src/response/mw';
import { getRankingMoneyImage } from '@src/model/image';

export const regular = /^(#|＃|\/)?灵榜$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const ifexistplay = await existplayer(usr_qq);

  if (!ifexistplay) { return false; }
  // 计算排名
  const playerList = await keysByPath(__PATH.player_path);
  const temp = [];

  for (let i = 0; i < playerList.length; i++) {
    const player = await readPlayer(playerList[i]);

    if (!player) { continue; }
    temp.push(player);
  }
  let File_length = temp.length;

  temp.sort(sortBy('灵石'));
  const Data = [];
  const usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1;

  if (File_length > 10) {
    File_length = 10;
  } // 最多显示前十
  for (let i = 0; i < File_length; i++) {
    temp[i].名次 = i + 1;
    Data[i] = temp[i];
  }
  await sleep(500);
  const player = await getDataJSONParseByKey(keys.player(usr_qq));
  const thisnajie = await getDataJSONParseByKey(keys.najie(usr_qq));
  const img = await getRankingMoneyImage(e, Data, usr_paiming, player, thisnajie);

  if (Buffer.isBuffer(img)) {
    Send(Image(img));

    return;
  }
  Send(Text('图片生成错误'));
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
