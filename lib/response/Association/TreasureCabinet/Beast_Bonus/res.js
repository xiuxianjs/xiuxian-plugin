import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys, keysAction } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataByKey, getDataByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { shijianc } from '../../../../model/common.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?神兽赐福$/;
function isDateParts(v) {
    return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}
function toNamedList(arr) {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr
        .map(it => {
        if (it && typeof it === 'object') {
            const o = it;
            if (typeof o.name === 'string') {
                return {
                    name: o.name,
                    class: typeof o.class === 'string' ? o.class : undefined
                };
            }
        }
        return undefined;
    })
        .filter(v => v !== undefined);
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    if (!isKeys(player['宗门'], ['宗门名称'])) {
        void Send(Text('你尚未加入宗门'));
        return false;
    }
    const playerGuild = player['宗门'];
    const assRaw = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));
    if (!assRaw || !isKeys(assRaw, ['power', '宗门神兽'])) {
        void Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    if (!ass.宗门神兽 || ass.宗门神兽 === '0' || ass.宗门神兽 === '无') {
        void Send(Text('你的宗门还没有神兽的护佑，快去召唤神兽吧'));
        return false;
    }
    const nowTime = Date.now();
    const Today = shijianc(nowTime);
    const lastsignTime = await getLastsignBonus(userId);
    if (isDateParts(Today) && isDateParts(lastsignTime)) {
        if (Today.Y === lastsignTime.Y && Today.M === lastsignTime.M && Today.D === lastsignTime.D) {
            void Send(Text('今日已经接受过神兽赐福了，明天再来吧'));
            return false;
        }
    }
    await setDataByKey(keysAction.getLastSignBonus(userId), nowTime);
    const random = Math.random();
    if (random <= 0.7) {
        void Send(Text(`${ass.宗门神兽}闭上了眼睛，表示今天不想理你`));
        return false;
    }
    const beast = ass.宗门神兽;
    const qilinData = await getDataList('Qilin');
    const qinlongData = await getDataList('Qinglong');
    const xuanwuData = await getDataList('Xuanwu');
    const danyaoData = await getDataList('Danyao');
    const gongfaData = await getDataList('Gongfa');
    const equipmentData = await getDataList('Equipment');
    const highProbLists = {
        麒麟: toNamedList(qilinData),
        青龙: toNamedList(qinlongData),
        玄武: toNamedList(xuanwuData),
        朱雀: toNamedList(xuanwuData),
        白虎: toNamedList(xuanwuData)
    };
    const normalLists = {
        麒麟: toNamedList(danyaoData),
        青龙: toNamedList(gongfaData),
        玄武: toNamedList(equipmentData),
        朱雀: toNamedList(equipmentData),
        白虎: toNamedList(equipmentData)
    };
    const highList = highProbLists[beast] || [];
    const normalList = normalLists[beast] || [];
    if (!highList.length && !normalList.length) {
        void Send(Text('神兽奖励配置缺失'));
        return false;
    }
    const randomB = Math.random();
    const fromList = randomB > 0.9 && highList.length ? highList : normalList;
    const item = fromList[Math.floor(Math.random() * fromList.length)];
    if (!item) {
        void Send(Text('本次赐福意外失败'));
        return false;
    }
    const category = item.class && typeof item.class === 'string' ? item.class : '道具';
    await addNajieThing(userId, item.name, category, 1);
    if (randomB > 0.9) {
        void Send(Text(`看见你来了, ${beast} 很高兴，仔细挑选了 ${item.name} 给你`));
    }
    else {
        void Send(Text(`${beast} 今天心情不错，随手丢给了你 ${item.name}`));
    }
    return false;
});
async function getLastsignBonus(userId) {
    const time = await getDataByKey(keysAction.getLastSignBonus(userId));
    if (time) {
        const parts = shijianc(Number(time));
        if (isDateParts(parts)) {
            return parts;
        }
    }
    return null;
}
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
