import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys, keysAction } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { shijianc } from '../../../../model/common.js';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
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
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { isNotMaintenance, getLastsignAsso } from '../../../../model/ass.js';
import mw, { selects } from '../../../mw.js';
import { isKeys } from '../../../../model/utils/isKeys.js';

const regular = /^(#|＃|\/)?宗门俸禄$/;
function isDateParts(v) {
    return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    if (!isKeys(player['宗门'], ['宗门名称', '职位'])) {
        void Send(Text('宗门信息不完整'));
        return false;
    }
    const playerGuild = player['宗门'];
    const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!ass) {
        void Send(Text('宗门数据异常'));
        return false;
    }
    const ismt = isNotMaintenance(ass);
    if (ismt) {
        void Send(Text('宗门尚未维护，快找宗主维护宗门'));
        return false;
    }
    const nowTime = Date.now();
    const Today = shijianc(nowTime);
    const lastsignTime = await getLastsignAsso(userId);
    if (isDateParts(Today) && isDateParts(lastsignTime)) {
        if (Today.Y === lastsignTime.Y && Today.M === lastsignTime.M && Today.D === lastsignTime.D) {
            void Send(Text('今日已经领取过了'));
            return false;
        }
    }
    const role = playerGuild.职位;
    if (role === '外门弟子' || role === '内门弟子') {
        void Send(Text('没有资格领取俸禄'));
        return false;
    }
    let n = 1;
    if (role === '长老') {
        n = 3;
    }
    else if (role === '副宗主') {
        n = 4;
    }
    else if (role === '宗主') {
        n = 5;
    }
    const exAss = ass;
    const buildLevel = Number(exAss.宗门建设等级 ?? 0);
    const guildLevel = Number(exAss.宗门等级 ?? 0);
    const fuli = Math.trunc(buildLevel * 2000);
    let giftLingshi = Math.trunc(guildLevel * 1200 * n + fuli);
    giftLingshi = Math.trunc(giftLingshi / 2);
    const pool = Number(ass.灵石池 ?? 0);
    if (pool - giftLingshi < 0) {
        void Send(Text('宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧'));
        return false;
    }
    ass.灵石池 = pool - giftLingshi;
    player.灵石 += giftLingshi;
    await setDataByKey(keysAction.lastSignAssoTime(userId), nowTime);
    await writePlayer(userId, player);
    await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    void Send(Text(`宗门俸禄领取成功,获得了${giftLingshi}灵石`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
