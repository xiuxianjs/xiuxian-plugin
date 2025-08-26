import { Text, useSend } from 'alemonjs';
import { getConfig, keys, notUndAndNull, shijianc } from '@src/model/index';
import mw from '@src/response/mw';
import { selects } from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';

export const regular = /^(#|＃|\/)?(宗门维护|维护宗门)$/;

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;
  const player = await getDataJSONParseByKey(keys.player(usr_qq));

  if (!player) {
    return;
  }
  if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门)) {
    return false;
  }
  if (player.宗门.职位 !== '宗主' && player.宗门.职位 !== '副宗主') {
    Send(Text('只有宗主、副宗主可以操作'));

    return false;
  }
  const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!ass) {
    Send(Text('宗门数据不存在'));

    return;
  }
  const nowTime = Date.now();
  const cfg = await getConfig('xiuxian', 'xiuxian');
  const time = cfg.CD.association;
  const lastMaintain = Number(ass.维护时间 || 0);
  const nextMaintainTs = lastMaintain + 60000 * time;

  if (lastMaintain && lastMaintain > nowTime - 1000 * 60 * 60 * 24 * 7) {
    const nextmt_time = await shijianc(nextMaintainTs);

    Send(
      Text(
        `当前无需维护,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
      )
    );

    return false;
  }
  const level = Number(ass.宗门等级 || 1);
  const pool = Number(ass.灵石池 || 0);
  const need = level * 50000;

  if (pool < need) {
    Send(Text(`目前宗门维护需要${need}灵石,本宗门灵石池储量不足`));

    return false;
  }
  ass.灵石池 = pool - need;
  ass.维护时间 = nowTime;
  setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
  setDataJSONStringifyByKey(keys.player(usr_qq), player);
  const nextmt_time = await shijianc(ass.维护时间 + 60000 * time);

  Send(
    Text(
      `宗门维护成功,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
    )
  );

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
