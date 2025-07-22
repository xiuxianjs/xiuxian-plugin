import { useSend, Text } from 'alemonjs';
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
import '../../../../model/XiuxianData.js';
import { existplayer, Go, Read_player, Read_najie, convert2integer, Add_najie_灵石 as Add_najie___, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)(存|取)灵石(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let flag = await Go(e);
    if (!flag)
        return false;
    let reg = new RegExp(/取|存/);
    let func = reg.exec(e.MessageText)[0];
    let msg = e.MessageText.replace(reg, '');
    msg = msg.replace('#', '');
    let lingshi = msg.replace('灵石', '');
    if (func == '存' && lingshi == '全部') {
        let P = await Read_player(usr_qq);
        lingshi = P.灵石;
    }
    if (func == '取' && lingshi == '全部') {
        let N = await Read_najie(usr_qq);
        lingshi = N.灵石;
    }
    lingshi = await convert2integer(lingshi);
    if (func == '存') {
        let player_lingshi = await Read_player(usr_qq);
        player_lingshi = player_lingshi.灵石;
        if (player_lingshi < lingshi) {
            Send(Text(`灵石不足,你目前只有${player_lingshi}灵石`));
            return false;
        }
        let najie = await Read_najie(usr_qq);
        if (najie.灵石上限 < najie.灵石 + lingshi) {
            await Add_najie___(usr_qq, najie.灵石上限 - najie.灵石);
            await Add___(usr_qq, -najie.灵石上限 + najie.灵石);
            Send(Text(`已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`));
            return false;
        }
        await Add_najie___(usr_qq, lingshi);
        await Add___(usr_qq, -lingshi);
        Send(Text(`储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${najie.灵石 + lingshi}灵石`));
        return false;
    }
    if (func == '取') {
        let najie = await Read_najie(usr_qq);
        if (najie.灵石 < lingshi) {
            Send(Text(`纳戒灵石不足,你目前最多取出${najie.灵石}灵石`));
            return false;
        }
        let player_lingshi = await Read_player(usr_qq);
        player_lingshi = player_lingshi.灵石;
        await Add_najie___(usr_qq, -lingshi);
        await Add___(usr_qq, lingshi);
        Send(Text(`本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`));
        return false;
    }
});

export { res as default, regular, selects };
