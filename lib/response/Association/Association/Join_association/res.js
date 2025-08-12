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
import { notUndAndNull, timestampToTime } from '../../../../model/common.js';
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

const regular = /^(#|＃|\/)?加入宗门.*$/;
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];
function isGuildInfo(v) {
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
    const ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player)
        return false;
    if (notUndAndNull(player.宗门))
        return false;
    if (!notUndAndNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    const levelEntry = data.Level_list.find(item => item.level_id == player.level_id);
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
    const ifexistass = await data.existData('association', association_name);
    if (!ifexistass) {
        Send(Text('这方天地不存在' + association_name));
        return false;
    }
    const assRaw = await data.getAssociation(association_name);
    if (assRaw === 'error') {
        Send(Text('没有这个宗门'));
        return false;
    }
    if (!isGuildInfo(assRaw)) {
        Send(Text('宗门数据格式错误'));
        return false;
    }
    const ass = assRaw;
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
        const level = data.Level_list.find(item => item.level_id === ass.最低加入境界)?.level ||
            '未知境界';
        Send(Text(`${association_name}招收弟子的最低境界要求为:${level},当前未达到要求`));
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
    await data.setData('player', usr_qq, serializePlayer(player));
    await data.setAssociation(association_name, ass);
    Send(Text(`恭喜你成功加入${association_name}`));
});

export { res as default, regular };
