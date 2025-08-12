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
import { playerEfficiency } from '../../../../model/efficiency.js';
import '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
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
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(升级宗门|宗门升级)$/;
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];
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
    if (!player ||
        !notUndAndNull(player.宗门) ||
        !isPlayerGuildRef(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
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
    const level = Number(ass.宗门等级 ?? 1);
    const pool = Number(ass.灵石池 ?? 0);
    const topLevel = 宗门人数上限.length;
    if (level >= topLevel) {
        Send(Text('已经是最高等级宗门'));
        return false;
    }
    const xian = ass.power === 1 ? 10 : 1;
    const need = level * 300000 * xian;
    if (pool < need) {
        Send(Text(`本宗门目前灵石池中仅有${pool}灵石,当前宗门升级需要${need}灵石,数量不足`));
        return false;
    }
    ass.灵石池 = pool - need;
    ass.宗门等级 = level + 1;
    await data.setAssociation(ass.宗门名称, ass);
    await data.setData('player', usr_qq, serializePlayer(player));
    await playerEfficiency(usr_qq);
    const newCapIndex = Math.max(0, Math.min(宗门人数上限.length - 1, ass.宗门等级 - 1));
    Send(Text(`宗门升级成功当前宗门等级为${ass.宗门等级},宗门人数上限提高到:${宗门人数上限[newCapIndex]}`));
    return false;
});

export { res as default, regular };
