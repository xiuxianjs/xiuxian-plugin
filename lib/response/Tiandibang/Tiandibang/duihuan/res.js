import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
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
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { readTiandibang, Write_tiandibang } from '../tian.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?积分兑换(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const now = new Date();
    if (now.getDay() !== 0) {
        Send(Text('物品筹备中，等到周日再来兑换吧'));
        return false;
    }
    const usr_qq = e.UserId;
    const thingName = e.MessageText.replace(/^(#|＃|\/)?积分兑换/, '').trim();
    if (!thingName) {
        Send(Text('请输入要兑换的物品名'));
        return false;
    }
    const table = (data.tianditang || []);
    const item = table.find(it => it.name === thingName);
    if (!item) {
        Send(Text(`天地堂还没有这样的东西: ${thingName}`));
        return false;
    }
    const needPoint = Number(item.积分) || 0;
    if (needPoint <= 0) {
        Send(Text('该物品不可兑换'));
        return false;
    }
    const rank = (await readTiandibang());
    if (!Array.isArray(rank) || rank.length === 0) {
        Send(Text('请先报名!'));
        return false;
    }
    const row = rank.find(r => String(r.qq) === String(usr_qq));
    if (!row) {
        Send(Text('请先报名!'));
        return false;
    }
    if (row.积分 < needPoint) {
        Send(Text(`积分不足, 还需 ${needPoint - row.积分} 积分兑换 ${thingName}`));
        return false;
    }
    row.积分 -= needPoint;
    await addNajieThing(usr_qq, thingName, item.class, 1);
    await Write_tiandibang(rank);
    Send(Text(`兑换成功! 获得[${thingName}], 剩余[${row.积分}]积分\n可以在【我的纳戒】中查看`));
    return false;
});

export { res as default, regular };
