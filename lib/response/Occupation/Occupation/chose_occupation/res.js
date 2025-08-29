import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
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
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?转职.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    if (!(await existplayer(userId))) {
        return false;
    }
    const occupation = e.MessageText.replace(/^(#|＃|\/)?转职/, '').trim();
    if (!occupation) {
        void Send(Text('格式: 转职职业名'));
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据读取失败'));
        return false;
    }
    const player_occupation = String(player.occupation || '');
    const occupation_list = (await getDataList('Occupation'));
    const targetOcc = occupation_list.find(o => o.name === occupation);
    if (!notUndAndNull(targetOcc)) {
        void Send(Text(`没有[${occupation}]这项职业`));
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelRow = levelList.find(item => item.level_id === player.level_id);
    const now_level_id = levelRow ? levelRow.level_id : 0;
    if (now_level_id < 17 && occupation === '采矿师') {
        void Send(Text('包工头:就你这小身板还来挖矿？再去修炼几年吧'));
        return false;
    }
    const thingName = occupation + '转职凭证';
    const thingClass = '道具';
    const thing_quantity = await existNajieThing(userId, thingName, thingClass);
    if (!thing_quantity || thing_quantity <= 0) {
        void Send(Text(`你没有【${thingName}】`));
        return false;
    }
    if (player_occupation === occupation) {
        void Send(Text(`你已经是[${player_occupation}]了，可使用[职业转化凭证]重新转职`));
        return false;
    }
    await addNajieThing(userId, thingName, thingClass, -1);
    if (!player_occupation || player_occupation.length === 0) {
        player.occupation = occupation;
        player.occupation_level = 1;
        player.occupation_exp = 0;
        await writePlayer(userId, player);
        void Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
        return false;
    }
    const fuzhi = {
        职业名: player_occupation,
        职业经验: Number(player.occupation_exp) || 0,
        职业等级: Number(player.occupation_level) || 1
    };
    await setDataJSONStringifyByKey(keys.fuzhi(userId), fuzhi);
    player.occupation = occupation;
    player.occupation_level = 1;
    player.occupation_exp = 0;
    await writePlayer(userId, player);
    void Send(Text(`恭喜${player.名号}转职为[${occupation}], 你的副职为${fuzhi.职业名}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
