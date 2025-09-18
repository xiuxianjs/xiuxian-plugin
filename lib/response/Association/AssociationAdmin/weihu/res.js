import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?维护护宗大阵.*$/;
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
        void Send(Text('只有宗主、副宗主或长老可以操作'));
        return false;
    }
    const msg = e.MessageText.replace(/^#维护护宗大阵/, '');
    const lingshi = convert2integer(msg);
    const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!ass || !isKeys(ass, ['宗门名称', '灵石池', '大阵血量', 'power'])) {
        void Send(Text('宗门数据异常'));
        return false;
    }
    const assData = ass;
    if (assData.灵石池 < lingshi) {
        void Send(Text(`宗门灵石池只有${assData.灵石池}灵石,数量不足`));
        return false;
    }
    let xian = 5;
    if (assData.power === 1) {
        xian = 2;
    }
    assData.大阵血量 = (assData.大阵血量 ?? 0) + lingshi * xian;
    assData.灵石池 = (assData.灵石池 ?? 0) - lingshi;
    await setDataJSONStringifyByKey(keys.association(assData.宗门名称), assData);
    void Send(Text(`维护成功,宗门还有${assData.灵石池}灵石,护宗大阵增加了${lingshi * xian}血量`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
