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
import { existplayer, Add_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { Read_tiandibang, Write_tiandibang } from '../tian.js';
import { selects } from '../../../index.js';

const regular = /^(#|\/)积分兑换(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let date = new Date();
    let n = date.getDay();
    if (n != 0) {
        Send(Text(`物品筹备中，等到周日再来兑换吧`));
        return false;
    }
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let reg = new RegExp(/积分兑换/);
    let msg = e.MessageText.replace(reg, '');
    msg = msg.replace('#', '');
    let thing_name = msg.replace('积分兑换', '');
    let ifexist = data.tianditang.find(item => item.name == thing_name);
    if (!ifexist) {
        Send(Text(`天地堂还没有这样的东西:${thing_name}`));
        return false;
    }
    let tiandibang;
    tiandibang = await Read_tiandibang();
    let m = tiandibang.length;
    let i;
    for (m = 0; m < tiandibang.length; m++) {
        if (tiandibang[m].qq == usr_qq) {
            break;
        }
    }
    if (m == tiandibang.length) {
        Send(Text('请先报名!'));
        return false;
    }
    for (i = 0; i < data.tianditang.length; i++) {
        if (thing_name == data.tianditang[i].name) {
            break;
        }
    }
    if (tiandibang[m].积分 < data.tianditang[i].积分) {
        Send(Text(`积分不足,还需${data.tianditang[i].积分 - tiandibang[m].积分}积分兑换${thing_name}`));
        return false;
    }
    tiandibang[m].积分 -= data.tianditang[i].积分;
    await Add_najie_thing(usr_qq, thing_name, data.tianditang[i].class, 1);
    await Write_tiandibang(tiandibang);
    Send(Text(`兑换成功!  获得[${thing_name}],剩余[${tiandibang[m].积分}]积分  ` +
        '\n可以在【我的纳戒】中查看'));
});

export { res as default, regular };
