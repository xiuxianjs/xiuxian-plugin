import { redis } from '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { useMessage, Text } from 'alemonjs';
import 'dayjs';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import { isUserMonthCard } from '../../../../model/currency.js';
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
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?领取每周礼包$/;
const baseKey = 'xiuxian@1.3.0:month_card:';
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const user = await readPlayer(e.UserId);
    if (!user) {
        void message.send(format(Text('请先创建角色')));
        return;
    }
    if (!(await isUserMonthCard(e.UserId))) {
        void message.send(format(Text('你没有月卡')));
        return;
    }
    const coolingKey = `${baseKey}weekly_gift:${e.UserId}`;
    const cooling = await redis.get(coolingKey);
    const now = Date.now();
    if (cooling) {
        void message.send(format(Text('本周已领取过！')));
        return;
    }
    await redis.set(coolingKey, now);
    await addNajieThing(e.UserId, '五阶玄元丹', '丹药', 1);
    await addNajieThing(e.UserId, '五阶淬体丹', '丹药', 1);
    await addNajieThing(e.UserId, '仙府通行证', '道具', 1);
    await addNajieThing(e.UserId, '道具盲盒', '道具', 1);
    void message.send(format(Text('周常礼包领取成功！获得 五阶玄元丹、五阶淬体丹、仙府通行证、道具盲盒')));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
