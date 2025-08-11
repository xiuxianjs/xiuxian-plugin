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
import 'fs';
import 'path';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

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
