import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, Go, readPlayer, readNajie, convert2integer, addBagCoin, addCoin } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(存|取)灵石(.*)$/;
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
    msg = msg.replace(/^(#|＃|\/)?/, '');
    let lingshi = msg.replace('灵石', '');
    if (func == '存' && lingshi == '全部') {
        let P = await readPlayer(usr_qq);
        lingshi = P.灵石;
    }
    if (func == '取' && lingshi == '全部') {
        let N = await readNajie(usr_qq);
        lingshi = N.灵石;
    }
    lingshi = await convert2integer(lingshi);
    if (func == '存') {
        let player_lingshi = await readPlayer(usr_qq);
        player_lingshi = player_lingshi.灵石;
        if (player_lingshi < lingshi) {
            Send(Text(`灵石不足,你目前只有${player_lingshi}灵石`));
            return false;
        }
        let najie = await readNajie(usr_qq);
        if (najie.灵石上限 < najie.灵石 + lingshi) {
            await addBagCoin(usr_qq, najie.灵石上限 - najie.灵石);
            await addCoin(usr_qq, -najie.灵石上限 + najie.灵石);
            Send(Text(`已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`));
            return false;
        }
        await addBagCoin(usr_qq, lingshi);
        await addCoin(usr_qq, -lingshi);
        Send(Text(`储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${najie.灵石 + lingshi}灵石`));
        return false;
    }
    if (func == '取') {
        let najie = await readNajie(usr_qq);
        if (najie.灵石 < lingshi) {
            Send(Text(`纳戒灵石不足,你目前最多取出${najie.灵石}灵石`));
            return false;
        }
        let player_lingshi = await readPlayer(usr_qq);
        player_lingshi = player_lingshi.灵石;
        await addBagCoin(usr_qq, -lingshi);
        await addCoin(usr_qq, lingshi);
        Send(Text(`本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`));
        return false;
    }
});

export { res as default, regular };
