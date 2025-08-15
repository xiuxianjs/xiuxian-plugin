import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { notUndAndNull, shijianc } from '../../../../model/common.js';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?神兽赐福$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v;
}
function isDateParts(v) {
    return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}
function toNamedList(arr) {
    if (!Array.isArray(arr))
        return [];
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
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await data.existData('player', usr_qq)))
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player ||
        !notUndAndNull(player.宗门) ||
        !isPlayerGuildRef(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    const assRaw = await data.getAssociation(player.宗门.宗门名称);
    if (assRaw === 'error' || !isExtAss(assRaw)) {
        Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    if (!ass.宗门神兽 || ass.宗门神兽 === '0' || ass.宗门神兽 === '无') {
        Send(Text('你的宗门还没有神兽的护佑，快去召唤神兽吧'));
        return false;
    }
    const nowTime = Date.now();
    const Today = await shijianc(nowTime);
    const lastsign_time = await getLastsign_Bonus(usr_qq);
    if (isDateParts(Today) && isDateParts(lastsign_time)) {
        if (Today.Y === lastsign_time.Y &&
            Today.M === lastsign_time.M &&
            Today.D === lastsign_time.D) {
            Send(Text('今日已经接受过神兽赐福了，明天再来吧'));
            return false;
        }
    }
    await redis.set(`xiuxian@1.3.0:${usr_qq}:getLastsign_Bonus`, String(nowTime));
    const random = Math.random();
    if (random <= 0.7) {
        Send(Text(`${ass.宗门神兽}闭上了眼睛，表示今天不想理你`));
        return false;
    }
    const beast = ass.宗门神兽;
    const highProbLists = {
        麒麟: toNamedList(data.qilin),
        青龙: toNamedList(data.qinlong),
        玄武: toNamedList(data.xuanwu),
        朱雀: toNamedList(data.xuanwu),
        白虎: toNamedList(data.xuanwu)
    };
    const normalLists = {
        麒麟: toNamedList(data.danyao_list),
        青龙: toNamedList(data.gongfa_list),
        玄武: toNamedList(data.equipment_list),
        朱雀: toNamedList(data.equipment_list),
        白虎: toNamedList(data.equipment_list)
    };
    const highList = highProbLists[beast] || [];
    const normalList = normalLists[beast] || [];
    if (!highList.length && !normalList.length) {
        Send(Text('神兽奖励配置缺失'));
        return false;
    }
    const randomB = Math.random();
    const fromList = randomB > 0.9 && highList.length ? highList : normalList;
    const item = fromList[Math.floor(Math.random() * fromList.length)];
    if (!item) {
        Send(Text('本次赐福意外失败'));
        return false;
    }
    const category = (item.class && typeof item.class === 'string' ? item.class : '道具');
    await addNajieThing(usr_qq, item.name, category, 1);
    if (randomB > 0.9) {
        Send(Text(`看见你来了, ${beast} 很高兴，仔细挑选了 ${item.name} 给你`));
    }
    else {
        Send(Text(`${beast} 今天心情不错，随手丢给了你 ${item.name}`));
    }
    return false;
});
async function getLastsign_Bonus(usr_qq) {
    const time = await redis.get(`xiuxian@1.3.0:${usr_qq}:getLastsign_Bonus`);
    if (time) {
        const parts = await shijianc(parseInt(time, 10));
        if (isDateParts(parts))
            return parts;
    }
    return null;
}

export { res as default, regular };
