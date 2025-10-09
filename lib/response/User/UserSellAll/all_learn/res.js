import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import { getDataList } from '../../../../model/DataList.js';
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
import { readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { batchAddNajieThings } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { addConsFaByUser } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?一键学习$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const najie = await getDataJSONParseByKey(keys.najie(userId));
    if (!najie || !Array.isArray(najie?.功法)) {
        return;
    }
    const max = player.level_id + player.Physique_id;
    if (player.学习的功法.length >= max) {
        void Send(Text('您当前学习功法数量已达上限，请突破后再来'));
        return;
    }
    const gongfaDataList = await getDataList('Gongfa');
    const timeGongfaList = await getDataList('TimeGongfa');
    const allGongfaData = [...gongfaDataList, ...timeGongfaList];
    const unlearnedGongfa = najie.功法
        .filter(l => !player.学习的功法.find(item => item === l.name))
        .map(l => {
        const gongfaData = allGongfaData.find((g) => g.name === l.name);
        return {
            name: l.name,
            加成: gongfaData?.修炼加成 ?? 0
        };
    })
        .sort((a, b) => b.加成 - a.加成);
    const canLearnCount = max - player.学习的功法.length;
    const names = unlearnedGongfa.slice(0, canLearnCount).map(g => g.name);
    if (!names.length) {
        void Send(Text('无新功法'));
        return;
    }
    void batchAddNajieThings(userId, names.map(n => ({ name: n, count: -1, category: '功法' })));
    void addConsFaByUser(userId, names);
    void Send(Text(`你学会了${names.join('|')},可以在【#我的炼体】中查看`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
