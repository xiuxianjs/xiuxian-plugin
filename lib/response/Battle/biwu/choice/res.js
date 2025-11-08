import { useSend, Text } from 'alemonjs';
import { getDataList } from '../../../../model/DataList.js';
import mw, { selects } from '../../../mw-captcha.js';
import { biwuPlayer } from '../biwu.js';

const regular = /^(#|＃|\/)?选择技能.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const jinengName = e.MessageText.replace(/^(#|＃|\/)?选择技能/, '');
    let code = jinengName.split(',');
    const msg = [];
    const jinengData = await getDataList('Jineng');
    const aQq = biwuPlayer.A_QQ;
    const bQq = biwuPlayer.B_QQ;
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
    }
    else if (bQq.some(item => item.QQ === userId)) {
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
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
