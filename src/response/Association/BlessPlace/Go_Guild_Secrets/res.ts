import { Text, useSend } from 'alemonjs';
import { getDataList } from '@src/model/DataList';
import { __PATH, keys } from '@src/model/keys';
import { Go, readPlayer, addCoin, getConfig, startAction, setDataJSONStringifyByKey, getDataJSONParseByKey } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?探索宗门秘境.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const flag = await Go(e);

  if (!flag) {
    return false;
  }

  const player = await readPlayer(userId);

  if (!player || !isKeys(player['宗门'], ['宗门名称'])) {
    void Send(Text('请先加入宗门'));

    return false;
  }

  const playerGuild = player['宗门'] as any;

  const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));

  if (!ass || !isKeys(ass, ['宗门名称', '宗门驻地', '灵石池', 'power'])) {
    void Send(Text('宗门数据不存在'));

    return false;
  }

  if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
    void Send(Text('你的宗门还没有驻地，不能探索秘境哦'));

    return false;
  }

  const didian = e.MessageText.replace(/^(#|＃|\/)?探索宗门秘境/, '').trim();

  if (!didian) {
    void Send(Text('请在指令后面补充秘境名称'));

    return false;
  }

  const listRaw = await getDataList('GuildSecrets');
  const weizhi = listRaw?.find(item => item.name === didian);

  if (!weizhi || !isKeys(weizhi, ['name', 'Price'])) {
    void Send(Text('未找到该宗门秘境'));

    return false;
  }

  const playerCoin = Number(player.灵石 ?? 0);
  const price = Number(weizhi.Price ?? 0);

  if (price <= 0) {
    void Send(Text('秘境费用配置异常'));

    return false;
  }

  if (playerCoin < price) {
    void Send(Text(`没有灵石寸步难行, 攒到${price}灵石才够哦~`));

    return false;
  }

  const guildGain = Math.trunc(price * 0.05);

  ass.灵石池 = Math.max(0, Number(ass.灵石池 ?? 0)) + guildGain;

  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);

  await addCoin(userId, -price);

  const cfg = await getConfig('xiuxian', 'xiuxian');
  const minute = cfg?.CD?.secretplace;
  const time = typeof minute === 'number' && minute > 0 ? minute : 10;
  const actionTime = 60000 * time;

  void startAction(userId, '历练', actionTime, {
    shutup: '1',
    working: '1',
    Place_action: '0',
    Place_actionplus: '1',
    power_up: '1',
    group_id: e.ChannelId,
    Place_address: weizhi,
    XF: ass.power
  });

  void Send(Text(`开始探索 ${didian} 宗门秘境，${time} 分钟后归来! (扣除${price}灵石，上缴宗门${guildGain}灵石)`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
