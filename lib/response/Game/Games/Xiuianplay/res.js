import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import config from '../../../../model/Config.js';
import { notUndAndNull, Go } from '../../../../model/common.js';
import { existplayer, readPlayer } from '../../../../model/xiuxiandata.js';
import { addExp, addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?怡红院$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const switchgame = cf.sw.play;
    if (switchgame !== true) {
        return false;
    }
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据读取失败'));
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        void Send(Text('请先#同步信息'));
        return false;
    }
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelObj = levelList.find(item => item.level_id === player.level_id);
    if (!levelObj) {
        void Send(Text('境界数据缺失'));
        return false;
    }
    const now_level_id = levelObj.level_id;
    const money = now_level_id * 1000;
    const playerCoin = Number(player.灵石) || 0;
    let addlevel;
    if (now_level_id < 10) {
        addlevel = money;
    }
    else {
        addlevel = (9 / now_level_id) * money;
    }
    const rand = Math.random();
    let ql1 = "门口的大汉粗鲁的将你赶出来:'哪来的野小子,没钱还敢来学人家公子爷寻欢作乐?' 被人看出你囊中羞涩,攒到";
    let ql2 = '灵石再来吧！';
    if (playerCoin < money) {
        void Send(Text(ql1 + money + ql2));
        return false;
    }
    if (rand < 0.5) {
        const randexp = 90 + Math.floor(Math.random() * 20);
        void Send(Text('花费了' + money + '灵石,你好好放肆了一番,奇怪的修为增加了' + randexp + '!在鱼水之欢中你顿悟了,修为增加了' + addlevel + '!'));
        await addExp(userId, addlevel);
        await addCoin(userId, -money);
        return false;
    }
    else if (rand > 0.7) {
        await addCoin(userId, -money);
        ql1 = '花了';
        ql2 = '灵石,本想好好放肆一番,却赶上了扫黄,无奈在衙门被教育了一晚上,最终大彻大悟,下次还来！';
        void Send(Text(ql1 + money + ql2));
        return false;
    }
    else {
        await addCoin(userId, -money);
        ql1 = '这一次，你进了一个奇怪的小巷子，那里衣衫褴褛的漂亮姐姐说要找你玩点有刺激的，你想都没想就进屋了。\n';
        ql2 = '没想到进屋后不多时遍昏睡过去。醒来发现自己被脱光扔在郊外,浑身上下只剩一条裤衩子了。仰天长啸：也不过是从头再来！';
        void Send(Text(ql1 + ql2));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
