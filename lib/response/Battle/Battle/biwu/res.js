import { useSend, Text, useMention, Image } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import { getAvatar } from '../../../../model/utils/utilsx.js';
import '../../../../model/DataList.js';
import { screenshot } from '../../../../image/index.js';
import '@alemonjs/db';
import { zdBattle } from '../../../../model/battle.js';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'dayjs';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?以武会友$/;
function extractFaQiu(lg) {
    if (!lg || typeof lg !== 'object') {
        return undefined;
    }
    const v = lg.法球倍率;
    return typeof v === 'number' ? v : undefined;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        void Send(Text('你还未开始修仙'));
        return false;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        void Send(Text('请@要切磋的修仙者'));
        return false;
    }
    const targetUserId = target.UserId;
    if (userId === targetUserId) {
        void Send(Text('你还跟自己修炼上了是不是?'));
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        void Send(Text('你的数据不存在'));
        return false;
    }
    const playerDataB = await getDataJSONParseByKey(keys.player(targetUserId));
    if (!playerDataB) {
        void Send(Text('对方数据不存在'));
        return false;
    }
    const playerA = player;
    const playerB = playerDataB;
    const a = { ...playerA };
    const b = { ...playerB };
    if (a.灵根) {
        const v = extractFaQiu(a.灵根);
        if (v !== undefined) {
            a.法球倍率 = v;
        }
    }
    if (b.灵根) {
        const v = extractFaQiu(b.灵根);
        if (v !== undefined) {
            b.法球倍率 = v;
        }
    }
    a.当前血量 = a.血量上限;
    b.当前血量 = b.血量上限;
    try {
        const dataBattle = await zdBattle(a, b);
        const header = `${playerA.名号}向${playerB.名号}发起了切磋。\n`;
        const winA = `${playerA.名号}击败了${playerB.名号}`;
        const winB = `${playerB.名号}击败了${playerA.名号}`;
        const img = await screenshot('CombatResult', userId, {
            msg: [header, ...(dataBattle.msg ?? [])],
            playerA: {
                id: userId,
                name: playerA.名号,
                avatar: getAvatar(userId),
                power: playerA.战力,
                hp: playerA.当前血量,
                maxHp: playerA.血量上限
            },
            playerB: {
                id: targetUserId,
                name: playerB.名号,
                avatar: getAvatar(targetUserId),
                power: playerB.战力,
                hp: playerB.当前血量,
                maxHp: playerB.血量上限
            },
            result: dataBattle.msg.includes(winA) ? 'A' : dataBattle.msg.includes(winB) ? 'B' : 'draw'
        });
        if (Buffer.isBuffer(img)) {
            void Send(Image(img));
        }
        else {
            const result = dataBattle.msg.includes(winA) ? 'A' : dataBattle.msg.includes(winB) ? 'B' : 'draw';
            void Send(Text(header + result));
        }
    }
    catch (_err) {
        void Send(Text('战斗过程出现异常'));
    }
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
