import { useSend, Text } from 'alemonjs';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { readTiandibang, writeTiandibang } from '../../../../model/tian.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?积分兑换(.*)$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const now = new Date();
    if (now.getDay() !== 0) {
        void Send(Text('物品筹备中，等到周日再来兑换吧'));
        return false;
    }
    const thingName = e.MessageText.replace(/^(#|＃|\/)?积分兑换/, '').trim();
    if (!thingName) {
        void Send(Text('请输入要兑换的物品名'));
        return false;
    }
    const table = ((await getDataList('Tianditang')) || []);
    const item = table.find(it => it.name === thingName);
    if (!item) {
        void Send(Text(`天地堂还没有这样的东西: ${thingName}`));
        return false;
    }
    const needPoint = Number(item.积分) || 0;
    if (needPoint <= 0) {
        void Send(Text('该物品不可兑换'));
        return false;
    }
    const rank = (await readTiandibang());
    if (!Array.isArray(rank) || rank.length === 0) {
        void Send(Text('请先报名!'));
        return false;
    }
    const row = rank.find(r => String(r.qq) === String(userId));
    if (!row) {
        void Send(Text('请先报名!'));
        return false;
    }
    if (row.积分 < needPoint) {
        void Send(Text(`积分不足, 还需 ${needPoint - row.积分} 积分兑换 ${thingName}`));
        return false;
    }
    row.积分 -= needPoint;
    await addNajieThing(userId, thingName, item.class, 1);
    await writeTiandibang(rank);
    void Send(Text(`兑换成功! 获得[${thingName}], 剩余[${row.积分}]积分\n可以在【我的纳戒】中查看`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
