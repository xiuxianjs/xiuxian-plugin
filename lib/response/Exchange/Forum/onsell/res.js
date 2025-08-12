import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import { readForum, writeForum } from '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import { foundthing } from '../../../../model/cultivation.js';
import 'dayjs';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?发布.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const thing = e.MessageText.replace(/^(#|＃|\/)?发布/, '');
    const code = thing.split('*');
    const thing_name = code[0];
    const value = code[1];
    const amount = code[2];
    const thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
        Send(Text(`这方世界没有[${thing_name}]`));
        return false;
    }
    if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
        Send(Text(`暂不支持该类型物品交易`));
        return false;
    }
    const thing_value = await convert2integer(value);
    const thing_amount = await convert2integer(amount);
    let Forum = [];
    try {
        Forum = await readForum();
    }
    catch {
        await writeForum([]);
    }
    const now_time = Date.now();
    const whole = Math.trunc(thing_value * thing_amount);
    let off = Math.trunc(whole * 0.03);
    if (off < 100000)
        off = 100000;
    const player = await readPlayer(usr_qq);
    if (player.灵石 < off + whole) {
        Send(Text(`灵石不足,还需要${off + whole - player.灵石}灵石`));
        return false;
    }
    await addCoin(usr_qq, -(off + whole));
    const wupin = {
        qq: usr_qq,
        name: thing_name,
        price: thing_value,
        class: thing_exist.class,
        aconut: thing_amount,
        whole: whole,
        now_time: now_time
    };
    Forum.push(wupin);
    await writeForum(Forum);
    Send(Text('发布成功！'));
});

export { res as default, regular };
