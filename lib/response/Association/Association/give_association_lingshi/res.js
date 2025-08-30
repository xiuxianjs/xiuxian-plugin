import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import { 宗门灵石池上限 as _______ } from '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
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
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石\d+$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    if (!isKeys(player.宗门, ['宗门名称', '职位'])) {
        void Send(Text('宗门信息不完整'));
        return;
    }
    const msg = e.MessageText.replace(/^(#|＃|\/)?宗门(上交|上缴|捐赠)灵石/, '').trim();
    if (!msg) {
        void Send(Text('请输入灵石数量'));
        return;
    }
    const lingshi = Number.parseInt(msg, 10);
    if (!Number.isFinite(lingshi) || lingshi <= 0) {
        void Send(Text('请输入正确的灵石数量'));
        return;
    }
    if (player.灵石 < lingshi) {
        void Send(Text(`你身上只有${player.灵石}灵石,数量不足`));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
    if (!ass) {
        void Send(Text('宗门数据不存在或已损坏'));
        return;
    }
    const guildLevel = Number(ass.宗门等级 ?? 1);
    const pool = Number(ass.灵石池 ?? 0);
    const xf = ass.power === 1 ? 10 : 1;
    const capIndex = Math.max(0, Math.min(_______.length - 1, guildLevel - 1));
    const cap = _______[capIndex] * xf;
    if (pool + lingshi > cap) {
        const remain = cap - pool;
        void Send(Text(`${ass.宗门名称}的灵石池最多还能容纳${remain}灵石,请重新捐赠`));
        return false;
    }
    ass.灵石池 = pool + lingshi;
    player.宗门.lingshi_donate = (player.宗门.lingshi_donate ?? 0) + lingshi;
    player.灵石 -= lingshi;
    await writePlayer(userId, player);
    void setDataJSONStringifyByKey(keys.association(player.宗门.宗门名称), ass);
    void Send(Text(`捐赠成功,你身上还有${player.灵石}灵石,宗门灵石池目前有${ass.灵石池}灵石`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
