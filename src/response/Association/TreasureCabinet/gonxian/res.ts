import { Text, useSend } from 'alemonjs';
import { keys } from '@src/model/index';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?我的贡献$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!isKeys(player['宗门'], ['lingshi_donate'])) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }

  const playerGuild = player['宗门'] as any;

  if (!playerGuild.lingshi_donate) {
    playerGuild.lingshi_donate = 0;
  }

  if (playerGuild.lingshi_donate < 0) {
    playerGuild.lingshi_donate = 0;
  }

  const gonxianzhi = Math.trunc(playerGuild.lingshi_donate / 10000);

  void Send(Text('你为宗门的贡献值为[' + gonxianzhi + '],可以在#宗门藏宝阁 使用贡献值兑换宗门物品,感谢您对宗门做出的贡献'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
