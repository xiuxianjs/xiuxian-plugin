import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import data from '../../../../model/XiuxianData.js';
import '../../../../model/repository/playerRepository.js';
import '../../../../model/repository/najieRepository.js';
import { notUndAndNull } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/settions.js';
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
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?建设宗门$/;
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
    if (!['宗主', '副宗主', '长老'].includes(player.宗门.职位)) {
        Send(Text('权限不足'));
        return false;
    }
    const assRaw = await data.getAssociation(player.宗门.宗门名称);
    if (assRaw === 'error' || !isExtAss(assRaw)) {
        Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
        Send(Text('你的宗门还没有驻地，无法建设宗门'));
        return false;
    }
    let level = Number(ass.宗门建设等级 || 0);
    if (level < 0)
        level = 0;
    ass.宗门建设等级 = level;
    const pool = Math.max(0, Number(ass.灵石池 || 0));
    ass.灵石池 = pool;
    const cost = Math.trunc(level * 10000);
    if (pool < cost) {
        Send(Text(`宗门灵石池不足，还需[${cost}]灵石`));
        return false;
    }
    ass.灵石池 = pool - cost;
    const add = Math.trunc(Number(player.level_id || 0) / 7) + 1;
    ass.宗门建设等级 = level + add;
    await data.setAssociation(ass.宗门名称, ass);
    await data.setData('player', usr_qq, serializePlayer(player));
    Send(Text(`成功消耗 宗门${cost}灵石 建设宗门，增加了${add}点建设度,当前宗门建设等级为${ass.宗门建设等级}`));
    return false;
});

export { res as default, regular };
