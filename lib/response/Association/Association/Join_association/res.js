import { useSend, Text } from 'alemonjs';
import { getIoRedis } from '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
import { keys } from '../../../../model/keys.js';
import { writePlayer } from '../../../../model/pub.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import { playerEfficiency } from '../../../../model/efficiency.js';
import { notUndAndNull, timestampToTime } from '../../../../model/common.js';
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

const regular = /^(#|＃|\/)?加入宗门.*$/;
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];
function serializePlayer(p) {
    const r = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'function') {
            continue;
        }
        if (v && typeof v === 'object') {
            r[k] = JSON.parse(JSON.stringify(v));
        }
        else {
            r[k] = v;
        }
    }
    return r;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!player) {
        return false;
    }
    if (notUndAndNull(player.宗门)) {
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelEntry = levelList.find((item) => item.level_id == player.level_id);
    if (!levelEntry) {
        Send(Text('境界数据缺失'));
        return false;
    }
    const now_level_id = levelEntry.level_id;
    const association_name = e.MessageText.replace(/^(#|＃|\/)?加入宗门/, '').trim();
    if (!association_name) {
        Send(Text('请输入宗门名称'));
        return false;
    }
    const redis = getIoRedis();
    const ifexistass = await redis.exists(keys.association(association_name));
    if (!ifexistass) {
        Send(Text('这方天地不存在' + association_name));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(association_name));
    if (!ass) {
        void Send(Text('没有这个宗门'));
        return;
    }
    ass.所有成员 = Array.isArray(ass.所有成员) ? ass.所有成员 : [];
    ass.外门弟子 = Array.isArray(ass.外门弟子) ? ass.外门弟子 : [];
    const guildLevel = Number(ass.宗门等级 ?? 1);
    if (now_level_id >= 42 && ass.power == 0) {
        Send(Text('仙人不可下界！'));
        return false;
    }
    if (now_level_id < 42 && ass.power == 1) {
        Send(Text('你在仙界吗？就去仙界宗门'));
        return false;
    }
    if (Number(ass.最低加入境界 || 0) > now_level_id) {
        const levelList = await getDataList('Level1');
        const levelEntry = levelList.find((item) => item.level_id === ass.最低加入境界);
        const level = levelEntry?.level || '未知境界';
        Send(Text(`${association_name}招收弟子的最低加入境界要求为:${level},当前未达到要求`));
        return false;
    }
    const capIndex = Math.max(0, Math.min(宗门人数上限.length - 1, guildLevel - 1));
    const mostmem = 宗门人数上限[capIndex];
    const nowmem = ass.所有成员.length;
    if (mostmem <= nowmem) {
        Send(Text(`${association_name}的弟子人数已经达到目前等级最大,无法加入`));
        return false;
    }
    const nowTime = Date.now();
    const date = timestampToTime(nowTime);
    player.宗门 = {
        宗门名称: association_name,
        职位: '外门弟子',
        time: [date, nowTime]
    };
    ass.所有成员.push(usr_qq);
    ass.外门弟子.push(usr_qq);
    await playerEfficiency(usr_qq);
    await writePlayer(usr_qq, serializePlayer(player));
    await setDataJSONStringifyByKey(keys.association(association_name), ass);
    void Send(Text(`恭喜你成功加入${association_name}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
