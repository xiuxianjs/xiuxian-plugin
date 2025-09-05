import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import '../../../../model/DataList.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?建设宗门$/;
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
    if (!['宗主', '副宗主', '长老'].includes(role)) {
        void Send(Text('权限不足'));
        return false;
    }
    const assRaw = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!assRaw || !isKeys(assRaw, ['宗门名称', '宗门驻地', '宗门建设等级', '灵石池'])) {
        void Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    if (!ass.宗门驻地 || ass.宗门驻地 === 0) {
        void Send(Text('你的宗门还没有驻地，无法建设宗门'));
        return false;
    }
    let level = Number(ass.宗门建设等级 ?? 0);
    if (level < 0) {
        level = 0;
    }
    ass.宗门建设等级 = level;
    const pool = Math.max(0, Number(ass.灵石池 ?? 0));
    ass.灵石池 = pool;
    const cost = Math.trunc(level * 10000);
    if (pool < cost) {
        void Send(Text(`宗门灵石池不足，还需[${cost}]灵石`));
        return false;
    }
    ass.灵石池 = pool - cost;
    const add = Math.trunc(Number(player.level_id ?? 0) / 7) + 1;
    ass.宗门建设等级 = level + add;
    await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    await setDataJSONStringifyByKey(keys.player(userId), player);
    void Send(Text(`成功消耗 宗门${cost}灵石 建设宗门，增加了${add}点建设度,当前宗门建设等级为${ass.宗门建设等级}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
