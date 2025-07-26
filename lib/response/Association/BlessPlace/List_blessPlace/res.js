import { useSend, Text } from 'alemonjs';
import fs from 'node:fs';
import '../../../../api/api.js';
import { selects } from '../../../index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?洞天福地列表$/;
var res = onResponse(selects, async (e) => {
    let addres = '洞天福地';
    let weizhi = data.bless_list;
    GoBlessPlace(e, weizhi, addres);
});
async function GoBlessPlace(e, weizhi, addres) {
    const Send = useSend(e);
    let dir = data.association;
    let File = fs.readdirSync(dir).filter(file => file.endsWith('.json'));
    let adr = addres;
    let msg = ['***' + adr + '***'];
    for (let i = 0; i < weizhi.length; i++) {
        let ass = '无';
        for (let j of File) {
            let this_name = j.replace('.json', '');
            let this_ass = await data.getAssociation(this_name);
            if (this_ass.宗门驻地 == weizhi[i].name) {
                ass = this_ass.宗门名称;
                break;
            }
        }
        msg.push(weizhi[i].name +
            '\n' +
            '等级：' +
            weizhi[i].level +
            '\n' +
            '修炼效率：' +
            weizhi[i].efficiency * 100 +
            '%\n' +
            '入驻宗门：' +
            ass);
    }
    Send(Text(msg.join('')));
}

export { res as default, regular };
