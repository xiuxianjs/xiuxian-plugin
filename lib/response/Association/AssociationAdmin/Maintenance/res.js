import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { notUndAndNull, shijianc } from '../../../../model/common.js';
import 'lodash-es';
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
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/valuables.scss.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(宗门维护|维护宗门)$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v;
}
function serializePlayer(p) {
    const r = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'function')
            continue;
        if (v && typeof v === 'object')
            r[k] = JSON.parse(JSON.stringify(v));
        else
            r[k] = v;
    }
    return r;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await data.existData('player', usr_qq)))
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player || !notUndAndNull(player.宗门) || !isPlayerGuildRef(player.宗门))
        return false;
    if (player.宗门.职位 !== '宗主' && player.宗门.职位 !== '副宗主') {
        Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    const assRaw = await data.getAssociation(player.宗门.宗门名称);
    if (assRaw === 'error' || !isExtAss(assRaw)) {
        Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    const nowTime = Date.now();
    const cfg = config.getConfig('xiuxian', 'xiuxian');
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
    await data.setAssociation(ass.宗门名称, ass);
    await data.setData('player', usr_qq, serializePlayer(player));
    const nextmt_time = await shijianc(ass.维护时间 + 60000 * time);
    Send(Text(`宗门维护成功,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`));
    return false;
});

export { res as default, regular };
