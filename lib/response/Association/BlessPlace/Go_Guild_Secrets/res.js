import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getDataList } from '../../../../model/DataList.js';
import { __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { startAction } from '../../../../model/actionHelper.js';
import { getConfig } from '../../../../model/Config.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?探索宗门秘境.*$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player?.宗门 || !isPlayerGuildRef(player.宗门)) {
        void Send(Text('请先加入宗门'));
        return false;
    }
    const assData = await redis.get(`${__PATH.association}:${player.宗门.宗门名称}`);
    if (!assData) {
        void Send(Text('宗门数据异常'));
        return;
    }
    const assRaw = JSON.parse(assData);
    if (assRaw === 'error' || !isExtAss(assRaw)) {
        void Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
        void Send(Text('你的宗门还没有驻地，不能探索秘境哦'));
        return false;
    }
    const didian = e.MessageText.replace(/^(#|＃|\/)?探索宗门秘境/, '').trim();
    if (!didian) {
        void Send(Text('请在指令后面补充秘境名称'));
        return false;
    }
    const listRaw = await getDataList('GuildSecrets');
    const weizhi = listRaw?.find(item => item.name === didian);
    if (!notUndAndNull(weizhi)) {
        void Send(Text('未找到该宗门秘境'));
        return false;
    }
    const playerCoin = Number(player.灵石 || 0);
    const price = Number(weizhi.Price || 0);
    if (price <= 0) {
        void Send(Text('秘境费用配置异常'));
        return false;
    }
    if (playerCoin < price) {
        void Send(Text(`没有灵石寸步难行, 攒到${price}灵石才够哦~`));
        return false;
    }
    const guildGain = Math.trunc(price * 0.05);
    ass.灵石池 = Math.max(0, Number(ass.灵石池 || 0)) + guildGain;
    await redis.set(`${__PATH.association}:${ass.宗门名称}`, JSON.stringify(ass));
    await addCoin(userId, -price);
    const cfg = (await getConfig('xiuxian', 'xiuxian'));
    const minute = cfg?.CD?.secretplace;
    const time = typeof minute === 'number' && minute > 0 ? minute : 10;
    const action_time = 60000 * time;
    void startAction(userId, '历练', action_time, {
        shutup: '1',
        working: '1',
        Place_action: '0',
        Place_actionplus: '1',
        power_up: '1',
        group_id: e.ChannelId,
        Place_address: weizhi,
        XF: ass.power
    });
    void Send(Text(`开始探索 ${didian} 宗门秘境，${time} 分钟后归来! (扣除${price}灵石，上缴宗门${guildGain}灵石)`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
