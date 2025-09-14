import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { getConfig } from '../../../../model/Config.js';
import { shijianc } from '../../../../model/common.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?(宗门维护|维护宗门)$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    if (!isKeys(player['宗门'], ['宗门名称', '职位'])) {
        void Send(Text('你尚未加入宗门'));
        return false;
    }
    const playerGuild = player['宗门'];
    const role = playerGuild.职位;
    if (role !== '宗主' && role !== '副宗主') {
        void Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!ass || !isKeys(ass, ['宗门名称', '维护时间', '宗门等级', '灵石池'])) {
        void Send(Text('宗门数据不存在'));
        return false;
    }
    const assData = ass;
    const nowTime = Date.now();
    const cfg = await getConfig('xiuxian', 'xiuxian');
    const time = cfg.CD.association;
    const lastMaintain = Number(assData.维护时间 ?? 0);
    const nextMaintainTs = lastMaintain + 60000 * time;
    if (lastMaintain && lastMaintain > nowTime - 1000 * 60 * 60 * 24 * 7) {
        const nextmtTime = shijianc(nextMaintainTs);
        void Send(Text(`当前无需维护,下次维护时间:${nextmtTime.Y}年${nextmtTime.M}月${nextmtTime.D}日${nextmtTime.h}时${nextmtTime.m}分${nextmtTime.s}秒`));
        return false;
    }
    const level = Number(assData.宗门等级 ?? 1);
    const pool = Number(assData.灵石池 ?? 0);
    const need = level * 50000;
    if (pool < need) {
        void Send(Text(`目前宗门维护需要${need}灵石,本宗门灵石池储量不足`));
        return false;
    }
    assData.灵石池 = pool - need;
    assData.维护时间 = nowTime;
    await setDataJSONStringifyByKey(keys.association(assData.宗门名称), assData);
    await setDataJSONStringifyByKey(keys.player(userId), player);
    const nextmtTime = shijianc(assData.维护时间 + 60000 * time);
    void Send(Text(`宗门维护成功,下次维护时间:${nextmtTime.Y}年${nextmtTime.M}月${nextmtTime.D}日${nextmtTime.h}时${nextmtTime.m}分${nextmtTime.s}秒`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
