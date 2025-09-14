import { Text, useSend } from 'alemonjs';
import { getDataList } from '@src/model/DataList';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { biwuPlayer } from '../biwu';

export const regular = /^(#|＃|\/)?选择技能.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const jinengName = e.MessageText.replace(/^(#|＃|\/)?选择技能/, '');
  let code = jinengName.split(',');
  const msg: string[] = [];

  const jinengData = await getDataList('Jineng');

  const aQq = biwuPlayer.A_QQ as any[];
  const bQq = biwuPlayer.B_QQ as any[];

  if (aQq.some(item => item.QQ === userId)) {
    for (const j of aQq) {
      if (j.QQ === userId) {
        code = code.slice(0, 3);

        for (const m of code) {
          const skillIndex = +m - 1;
          const skillName = j.技能[skillIndex];
          const skillData = jinengData.find(item => item.name === skillName);

          if (skillData) {
            j.选择技能.push(JSON.parse(JSON.stringify(skillData)));
            msg.push(skillName);
          }
        }
      }
    }

    void Send(Text(`本场战斗支持以下技能\n${msg.join(', ')}`));

    return false;
  } else if (bQq.some(item => item.QQ === userId)) {
    for (const j of bQq) {
      if (j.QQ === userId) {
        code = code.slice(0, 3);

        for (const m of code) {
          const skillIndex = +m - 1;
          const skillName = j.技能[skillIndex];
          const skillData = jinengData.find(item => item.name === skillName);

          if (skillData) {
            j.选择技能.push(JSON.parse(JSON.stringify(skillData)));
            msg.push(skillName);
          }
        }
      }
    }

    void Send(Text(`本场战斗支持以下技能\n${msg.join(', ')}`));

    return false;
  }

  void Send(Text('你不在战斗中'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
