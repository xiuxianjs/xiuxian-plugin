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
import data from '../../../../model/XiuxianData.js';
import '../../../../api/api.js';
import { existplayer, Go, convert2integer, readPlayer, addNajieThing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?购买((.*)|(.*)*(.*))$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let thing = e.MessageText.replace(/^(#|＃|\/)?购买/, '');
    let code = thing.split('*');
    let thing_name = code[0];
    let ifexist = data.commodities_list.find(item => item.name == thing_name);
    if (!ifexist) {
        Send(Text(`柠檬堂还没有这样的东西:${thing_name}`));
        return false;
    }
    let quantity = await convert2integer(code[1]);
    let player = await readPlayer(usr_qq);
    let lingshi = player.灵石;
    if (lingshi <= 0) {
        Send(Text(`掌柜：就你这穷酸样，也想来柠檬堂？走走走！`));
        return false;
    }
    let commodities_price = ifexist.出售价 * 1.2 * quantity;
    commodities_price = Math.trunc(commodities_price);
    if (lingshi < commodities_price) {
        Send(Text(`口袋里的灵石不足以支付${thing_name},还需要${commodities_price - lingshi}灵石`));
        return false;
    }
    await addNajieThing(usr_qq, thing_name, ifexist.class, quantity);
    await Add___(usr_qq, -commodities_price);
    Send(Text([
        `购买成功!  获得[${thing_name}]*${quantity},花[${commodities_price}]灵石,剩余[${lingshi - commodities_price}]灵石  `,
        '\n可以在【我的纳戒】中查看'
    ].join('')));
});

export { res as default, regular };
