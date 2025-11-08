import { useSend, Text } from 'alemonjs';
import { getDataList } from '../../../../model/DataList.js';
import { Go } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import { startAction } from '../../../../model/actionHelper.js';
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
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?沉迷宗门秘境.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player || !isKeys(player['宗门'], ['宗门名称'])) {
        void Send(Text('请先加入宗门'));
        return false;
    }
    const playerGuild = player['宗门'];
    const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!ass || !isKeys(ass, ['宗门名称', '宗门驻地', '灵石池', 'power'])) {
        void Send(Text('宗门数据不存在'));
        return false;
    }
    const assData = ass;
    if (!assData.宗门驻地 || assData.宗门驻地 === 0) {
        void Send(Text('你的宗门还没有驻地，不能探索秘境哦'));
        return false;
    }
    const tail = e.MessageText.replace(/^(#|＃|\/)?沉迷宗门秘境/, '').trim();
    if (!tail) {
        void Send(Text('格式: 沉迷宗门秘境秘境名*次数 (1-12)'));
        return false;
    }
    const [didianRaw, timesRaw] = tail.split('*');
    const didian = (didianRaw || '').trim();
    const i = convert2integer(timesRaw);
    if (!didian) {
        void Send(Text('请提供秘境名称'));
        return false;
    }
    if (!Number.isFinite(i) || i <= 0 || i > 12) {
        void Send(Text('次数需在 1-12 之间'));
        return false;
    }
    const listRaw = await getDataList('GuildSecrets');
    const weizhi = listRaw?.find(item => item.name === didian);
    if (!weizhi || !isKeys(weizhi, ['name', 'Price'])) {
        void Send(Text('未找到该宗门秘境'));
        return false;
    }
    const keyNum = await existNajieThing(userId, '秘境之匙', '道具');
    if (!keyNum || keyNum < i) {
        void Send(Text('你没有足够数量的秘境之匙'));
        return false;
    }
    const priceSingle = Math.max(0, Number(weizhi.Price ?? 0));
    if (priceSingle <= 0) {
        void Send(Text('秘境费用配置异常'));
        return false;
    }
    const Price = priceSingle * i * 10;
    const playerCoin = Number(player.灵石 ?? 0);
    if (playerCoin < Price) {
        void Send(Text(`没有灵石寸步难行, 需要${Price}灵石`));
        return false;
    }
    await addNajieThing(userId, '秘境之匙', '道具', -i);
    const guildGain = Math.trunc(Price * 0.05);
    assData.灵石池 = Math.max(0, Number(assData.灵石池 ?? 0)) + guildGain;
    await setDataJSONStringifyByKey(keys.association(assData.宗门名称), assData);
    await addCoin(userId, -Price);
    const time = i * 10 * 5 + 10;
    const actionTime = 60000 * time;
    const arr = {
        action: '历练',
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '0',
        power_up: '1',
        cishu: 10 * i,
        Place_address: weizhi,
        XF: assData.power,
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    };
    void startAction(userId, '历练', actionTime, arr);
    void Send(Text(`开始沉迷探索 ${didian} 宗门秘境 * ${i} 次，共耗时 ${time} 分钟 (消耗${Price}灵石，上缴宗门${guildGain}灵石)`));
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
