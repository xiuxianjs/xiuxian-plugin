import { Text, useMention, useSend } from 'alemonjs';

import { keys, notUndAndNull } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?^任命.*/;
const 副宗主人数上限 = [1, 1, 1, 1, 2, 2, 3, 3];
const 长老人数上限 = [1, 2, 3, 4, 5, 7, 8, 9];
const 内门弟子上限 = [2, 3, 4, 5, 6, 8, 10, 12];

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
  lingshi_donate?: number;
}
function isPlayerGuildRef (v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}

const VALID_APPOINT = ['副宗主', '长老', '内门弟子', '外门弟子'] as const;

type Appointment = (typeof VALID_APPOINT)[number];
function isAppointment (v: string): v is Appointment {
  return (VALID_APPOINT as readonly string[]).includes(v);
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;
  if (!target || res.code !== 2000) return false;
  const player = await getDataJSONParseByKey(keys.player(usr_qq));
  if (!player) return false;
  if (!notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门)) {
    Send(Text('你尚未加入宗门'));
    return false;
  }
  if (player.宗门.职位 !== '宗主' && player.宗门.职位 !== '副宗主') {
    Send(Text('只有宗主、副宗主可以操作'));
    return false;
  }
  const member_qq = target.UserId;
  if (usr_qq === member_qq) {
    Send(Text('不能对自己任命'));
    return false;
  }
  const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
  if (!ass) {
    Send(Text('宗门数据不存在'));
    return;
  }
  ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
  if (!ass.所有成员.includes(member_qq)) {
    Send(Text('只能设置宗门内弟子的职位'));
    return false;
  }
  const member = await getDataJSONParseByKey(keys.player(member_qq));
  if (!member) {
    Send(Text('目标玩家数据不存在'));
    return false;
  }
  if (!notUndAndNull(member.宗门) || !isPlayerGuildRef(member.宗门)) {
    return false;
  }
  const now_apmt = member.宗门.职位;
  if (player.宗门.职位 === '副宗主' && now_apmt === '宗主') {
    Send(Text('你想造反吗！？'));
    return false;
  }
  if (player.宗门.职位 === '副宗主' && (now_apmt === '副宗主' || now_apmt === '长老')) {
    Send(Text(`宗门${now_apmt}任免请上报宗主！`));
    return false;
  }
  // 解析新职位
  const match = /(副宗主|长老|外门弟子|内门弟子)/.exec(e.MessageText);
  if (!match) {
    Send(Text('请输入正确的职位'));
    return false;
  }
  const appointment = match[0];
  if (!isAppointment(appointment)) {
    Send(Text('无效职位'));
    return false;
  }
  if (appointment === now_apmt) {
    Send(Text(`此人已经是本宗门的${appointment}`));
    return false;
  }
  const level = Number(ass.宗门等级 || 1);
  const idx = Math.max(0, Math.min(副宗主人数上限.length - 1, level - 1));
  const limitMap: Record<Appointment, number> = {
    副宗主: 副宗主人数上限[idx],
    长老: 长老人数上限[idx],
    内门弟子: 内门弟子上限[idx],
    外门弟子: Infinity
  };
  const listMap = (role: Appointment): string[] => {
    const raw = ass[role];
    return Array.isArray(raw) ? (raw as string[]) : [];
  };
  const targetList = listMap(appointment);
  if (targetList.length >= limitMap[appointment]) {
    Send(Text(`本宗门的${appointment}人数已经达到上限`));
    return false;
  }
  // 更新旧职位表
  const oldList = listMap(now_apmt as Appointment);
  ass[now_apmt] = oldList.filter(q => q !== member_qq);
  // 添加新职位
  targetList.push(member_qq);
  ass[appointment] = targetList;
  member.宗门.职位 = appointment;
  await setDataJSONStringifyByKey(keys.player(member_qq), member);
  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
  Send(Text(`${ass.宗门名称} ${player.宗门.职位} 已经成功将${member.名号}任命为${appointment}!`));
  return false;
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
