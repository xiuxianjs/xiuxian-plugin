import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import '../../../../model/api.js';
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
import { notUndAndNull } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?宗门(开启|关闭)审核$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    if (!notUndAndNull(player?.宗门)) {
        void Send(Text('你还没有加入宗门'));
        return;
    }
    if (!isKeys(player.宗门, ['宗门名称', '职位'])) {
        void Send(Text('宗门信息不完整'));
        return;
    }
    const guildInfo = player.宗门;
    if (guildInfo.职位 !== '宗主') {
        void Send(Text('只有宗主才能设置宗门审核'));
        return;
    }
    const ass = await getDataJSONParseByKey(keys.association(guildInfo.宗门名称));
    if (!ass) {
        void Send(Text('宗门数据异常'));
        return;
    }
    const action = e.MessageText.includes('开启') ? 'enable' : 'disable';
    if (action === 'enable') {
        if (ass.需要审核) {
            void Send(Text('宗门审核已经是开启状态'));
            return;
        }
        ass.需要审核 = true;
        await setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
        void Send(Text('已开启宗门审核，新成员加入需要长老及以上审核通过'));
    }
    else {
        if (!ass.需要审核) {
            void Send(Text('宗门审核已经是关闭状态'));
            return;
        }
        ass.需要审核 = false;
        await setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
        void Send(Text('已关闭宗门审核，新成员可以直接加入'));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
