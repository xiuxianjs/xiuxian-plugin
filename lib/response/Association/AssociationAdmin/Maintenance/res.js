import { useSend, Text } from 'alemonjs';
import { getConfig } from '../../../../model/Config.js';
import '@alemonjs/db';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import '../../../../model/xiuxian_impl.js';
import { notUndAndNull, shijianc } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
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
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?(宗门维护|维护宗门)$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(usr_qq));
    if (!player) {
        return;
    }
    if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门)) {
        return false;
    }
    if (player.宗门.职位 !== '宗主' && player.宗门.职位 !== '副宗主') {
        Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
    if (!ass) {
        Send(Text('宗门数据不存在'));
        return;
    }
    const nowTime = Date.now();
    const cfg = await getConfig('xiuxian', 'xiuxian');
    const time = cfg.CD.association;
    const lastMaintain = Number(ass.维护时间 || 0);
    const nextMaintainTs = lastMaintain + 60000 * time;
    if (lastMaintain && lastMaintain > nowTime - 1000 * 60 * 60 * 24 * 7) {
        const nextmt_time = await shijianc(nextMaintainTs);
        Send(Text(`当前无需维护,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`));
        return false;
    }
    const level = Number(ass.宗门等级 || 1);
    const pool = Number(ass.灵石池 || 0);
    const need = level * 50000;
    if (pool < need) {
        Send(Text(`目前宗门维护需要${need}灵石,本宗门灵石池储量不足`));
        return false;
    }
    ass.灵石池 = pool - need;
    ass.维护时间 = nowTime;
    setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    setDataJSONStringifyByKey(keys.player(usr_qq), player);
    const nextmt_time = await shijianc(ass.维护时间 + 60000 * time);
    Send(Text(`宗门维护成功,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
