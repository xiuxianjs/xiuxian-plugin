import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
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
import 'dayjs';
import 'buffer';
import '@alemonjs/db';
import { 宗门人数上限 as ______ } from '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?(升级宗门|宗门升级)$/;
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
    const assRaw = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!assRaw || !isKeys(assRaw, ['宗门名称', '宗门等级', '灵石池', 'power'])) {
        void Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    const level = Number(ass.宗门等级 ?? 1);
    const pool = Number(ass.灵石池 ?? 0);
    const topLevel = ______.length;
    if (level >= topLevel) {
        void Send(Text('已经是最高等级宗门'));
        return false;
    }
    const xian = ass.power === 1 ? 10 : 1;
    const need = level * 300000 * xian;
    if (pool < need) {
        void Send(Text(`本宗门目前灵石池中仅有${pool}灵石,当前宗门升级需要${need}灵石,数量不足`));
        return false;
    }
    ass.灵石池 = pool - need;
    ass.宗门等级 = level + 1;
    await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    await setDataJSONStringifyByKey(keys.player(userId), player);
    await playerEfficiency(userId);
    const newCapIndex = Math.max(0, Math.min(______.length - 1, ass.宗门等级 - 1));
    void Send(Text(`宗门升级成功当前宗门等级为${ass.宗门等级},宗门人数上限提高到:${______[newCapIndex]}`));
    return false;
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
