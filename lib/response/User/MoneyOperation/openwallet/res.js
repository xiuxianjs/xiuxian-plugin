import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, exist_najie_thing, Add_najie_thing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|\/)打开钱包$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await data.getData('player', usr_qq);
    let thing_name = '水脚脚的钱包';
    let acount = await exist_najie_thing(usr_qq, thing_name, '装备');
    if (!acount) {
        Send(Text(`你没有[${thing_name}]这样的装备`));
        return false;
    }
    await Add_najie_thing(usr_qq, thing_name, '装备', -1);
    const x = 0.4;
    let random1 = Math.random();
    const y = 0.3;
    let random2 = Math.random();
    const z = 0.2;
    let random3 = Math.random();
    const p = 0.1;
    let random4 = Math.random();
    let m = '';
    let lingshi = 0;
    if (random1 < x) {
        if (random2 < y) {
            if (random3 < z) {
                if (random4 < p) {
                    lingshi = 2000000;
                    m =
                        player.名号 +
                            '打开了[' +
                            thing_name +
                            ']金光一现！' +
                            lingshi +
                            '颗灵石！';
                }
                else {
                    lingshi = 1000000;
                    m =
                        player.名号 +
                            '打开了[' +
                            thing_name +
                            ']金光一现!' +
                            lingshi +
                            '颗灵石！';
                }
            }
            else {
                lingshi = 400000;
                m =
                    player.名号 +
                        '打开了[' +
                        thing_name +
                        ']你很开心的得到了' +
                        lingshi +
                        '颗灵石！';
            }
        }
        else {
            lingshi = 180000;
            m =
                player.名号 +
                    '打开了[' +
                    thing_name +
                    ']你很开心的得到了' +
                    lingshi +
                    '颗灵石！';
        }
    }
    else {
        lingshi = 100000;
        m =
            player.名号 +
                '打开了[' +
                thing_name +
                ']你很开心的得到了' +
                lingshi +
                '颗灵石！';
    }
    await Add___(usr_qq, lingshi);
    Send(Text(m));
    return false;
});

export { res as default, regular };
