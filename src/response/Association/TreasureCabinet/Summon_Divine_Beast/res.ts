import { Text, useSend } from 'alemonjs';
import { keys } from '@src/model/index';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { isKeys } from '@src/model/utils/isKeys';
import { ZongMen } from '@src/types';

export const regular = /^(#|＃|\/)?召唤神兽$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!isKeys(player['宗门'], ['宗门名称', '职位'])) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }

  const playerGuild = player['宗门'] as any;
  const role = playerGuild.职位;

  if (role !== '宗主') {
    void Send(Text('只有宗主可以操作'));

    return false;
  }

  const assRaw: ZongMen | null = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));

  if (!assRaw || !isKeys(assRaw, ['宗门名称', '宗门等级', '宗门建设等级', '宗门驻地', '灵石池', '宗门神兽'])) {
    void Send(Text('宗门数据不存在'));

    return false;
  }

  const ass = assRaw;
  const level = Math.max(0, Number(ass.宗门等级 ?? 0));
  const buildLevel = Math.max(0, Number(ass.宗门建设等级 ?? 0));
  const site = ass.宗门驻地;
  const pool = Math.max(0, Number(ass.灵石池 ?? 0));
  const beast = ass.宗门神兽;

  const cost = 2_000_000;

  if (level < 8) {
    void Send(Text('宗门等级不足，尚不具备召唤神兽的资格'));

    return false;
  }

  if (buildLevel < 50) {
    void Send(Text('宗门建设等级不足, 先提升建设度再来吧'));

    return false;
  }

  if (!site || site === 0) {
    void Send(Text('驻地都没有，让神兽跟你流浪啊？'));

    return false;
  }

  if (pool < cost) {
    void Send(Text('宗门就这点钱，还想神兽跟着你干活？'));

    return false;
  }

  if (beast && beast !== 0 && beast !== '0' && beast !== '无') {
    void Send(Text('你的宗门已经有神兽了'));

    return false;
  }

  const r = Math.random();
  let newBeast: string;

  if (r > 0.8) {
    newBeast = '麒麟';
  } else if (r > 0.6) {
    newBeast = '青龙';
  } else if (r > 0.4) {
    newBeast = '玄武';
  } else if (r > 0.2) {
    newBeast = '朱雀';
  } else {
    newBeast = '白虎';
  }

  ass.宗门神兽 = newBeast;
  ass.灵石池 = pool - cost;

  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);

  void Send(Text(`召唤成功，神兽 ${newBeast} 投下一道分身，开始守护你的宗门，绑定神兽后不可更换哦`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
