import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { getDataList } from '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
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

const regular = /^(#|＃|\/)?设置门槛.*$/;
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
    const allow = role === '宗主' || role === '副宗主' || role === '长老';
    if (!allow) {
        void Send(Text('只有宗主、副宗主或长老可以操作'));
        return false;
    }
    const jiar = e.MessageText.replace(/^(#|＃|\/)?设置门槛/, '').trim();
    if (!jiar) {
        void Send(Text('请输入境界名称'));
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelInfo = levelList.find(item => item.level === jiar);
    if (!levelInfo) {
        void Send(Text('境界不存在'));
        return false;
    }
    let jrLevelId = levelInfo.level_id;
    const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!ass || !isKeys(ass, ['宗门名称', 'power', '最低加入境界'])) {
        void Send(Text('宗门数据异常'));
        return false;
    }
    if (ass.power === 0 && jrLevelId > 41) {
        jrLevelId = 41;
        void Send(Text('不知哪位大能立下誓言：凡界无仙！'));
    }
    if (ass.power === 1 && jrLevelId < 42) {
        jrLevelId = 42;
        void Send(Text('仅仙人可加入仙宗'));
    }
    ass.最低加入境界 = jrLevelId;
    await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    void Send(Text('已成功设置宗门门槛，当前门槛:' + jiar));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
