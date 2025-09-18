import { useSend, Text, useSubscribe } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { existDataByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { notUndAndNull, timestampToTime } from '../../../../model/common.js';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import { setFileValue } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import 'crypto';
import 'lodash-es';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?开宗立派$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelItem = levelList.find(item => item.level_id === player.level_id);
    if (!levelItem) {
        void Send(Text('等级数据异常'));
        return false;
    }
    const nowLevelId = levelItem.level_id;
    if (nowLevelId < 22) {
        void Send(Text('修为达到化神再来吧'));
        return false;
    }
    if (notUndAndNull(player.宗门)) {
        void Send(Text('已经有宗门了'));
        return false;
    }
    if (player.灵石 < 10000) {
        void Send(Text('开宗立派是需要本钱的,攒到一万灵石再来吧'));
        return false;
    }
    void Send(Text('请发送宗门名字,一旦设立,无法再改,请慎重取名,(宗门名字最多6个中文字符)\n想改变主意请回复:【取消】'));
    const [subscribe] = useSubscribe(e, selects);
    const sub = subscribe.mount(async (event, next) => {
        const associationName = event.MessageText;
        if (/^(#|＃|\/)?取消$/.test(associationName)) {
            void Send(Text('已取消创建宗门'));
            clearTimeout(timeout);
            return;
        }
        if (!/^[\u4e00-\u9fa5]+$/.test(associationName)) {
            void Send(Text('宗门名字只能使用中文,请重新输入:\n想改变主意请回复:【取消】'));
            next();
            return;
        }
        if (associationName.length > 6) {
            void Send(Text('宗门名字最多只能设置6个字符,请重新输入:\n想改变主意请回复:【取消】'));
            next();
            return;
        }
        const ifexistass = await existDataByKey(keys.association(associationName));
        if (ifexistass) {
            void Send(Text('该宗门已经存在,请重新输入:\n想改变主意请回复:【取消】'));
            next();
            return;
        }
        clearTimeout(timeout);
        const now = new Date();
        const nowTime = now.getTime();
        const date = timestampToTime(nowTime);
        const player = await readPlayer(userId);
        if (!player) {
            void Send(Text('玩家数据异常'));
            return;
        }
        player.宗门 = {
            宗门名称: associationName,
            职位: '宗主',
            time: [date, nowTime]
        };
        await writePlayer(userId, player);
        await newAssociation(associationName, userId, e);
        await setFileValue(userId, -1e4, '灵石');
        void Send(Text('宗门创建成功'));
    }, ['UserId']);
    const timeout = setTimeout(() => {
        try {
            subscribe.cancel(sub);
            void Send(Text('创建宗门超时,已取消'));
        }
        catch (e) {
            logger.error('取消订阅失败', e);
        }
    }, 1000 * 60 * 1);
});
async function newAssociation(name, holderId, e) {
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const levelList = await getDataList('Level1');
    const levelItem = levelList.find(item => item.level_id === player.level_id);
    if (!levelItem) {
        return;
    }
    const nowLevelId = levelItem.level_id;
    const isHigh = nowLevelId > 41;
    const x = isHigh ? 1 : 0;
    const xian = isHigh ? 10 : 1;
    const dj = isHigh ? 42 : 1;
    const now = new Date();
    const nowTime = now.getTime();
    const date = timestampToTime(nowTime);
    const Association = {
        宗门名称: name,
        宗门等级: 1,
        创立时间: [date, nowTime],
        灵石池: 0,
        宗门驻地: 0,
        宗门建设等级: 0,
        宗门神兽: 0,
        宗主: holderId,
        副宗主: [],
        长老: [],
        内门弟子: [],
        外门弟子: [],
        所有成员: [holderId],
        药园: {
            药园等级: 1,
            作物: [{ name: '凝血草', start_time: nowTime, who_plant: holderId }]
        },
        维护时间: nowTime,
        大阵血量: 114514 * xian,
        最低加入境界: dj,
        power: x
    };
    await setDataJSONStringifyByKey(keys.association(name), Association);
}
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
