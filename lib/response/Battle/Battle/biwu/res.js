import { useSend, useMention, Text, Image } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import 'lodash-es';
import { zdBattle } from '../../../../model/battle.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import '../../../../model/equipment.js';
import 'dayjs';
import '../../../../model/api.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?以武会友$/;
function isPlayer(v) {
    return !!v && typeof v === 'object' && '名号' in v && '血量上限' in v;
}
function extractFaQiu(lg) {
    if (!lg || typeof lg !== 'object')
        return undefined;
    const o = lg;
    const v = o.法球倍率;
    return typeof v === 'number' ? v : undefined;
}
const getAvatar = (usr_qq) => {
    return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${usr_qq}`;
};
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const A = e.UserId;
    if (!(await existplayer(A)))
        return false;
    const mentionsApi = useMention(e)[0];
    const Mentions = (await mentionsApi.find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0)
        return false;
    const target = Mentions.find(item => !item.IsBot);
    if (!target)
        return false;
    const B = target.UserId;
    if (A === B) {
        Send(Text('你还跟自己修炼上了是不是?'));
        return false;
    }
    if (!(await existplayer(B))) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    let A_player;
    let B_player;
    try {
        A_player = await readPlayer(A);
        B_player = await readPlayer(B);
    }
    catch (_err) {
        Send(Text('读取玩家数据失败'));
        return false;
    }
    if (!isPlayer(A_player) || !isPlayer(B_player)) {
        Send(Text('玩家数据异常'));
        return false;
    }
    const a = { ...A_player };
    const b = { ...B_player };
    if (a.灵根) {
        const v = extractFaQiu(a.灵根);
        if (v !== undefined)
            a.法球倍率 = v;
    }
    if (b.灵根) {
        const v = extractFaQiu(b.灵根);
        if (v !== undefined)
            b.法球倍率 = v;
    }
    a.当前血量 = a.血量上限;
    b.当前血量 = b.血量上限;
    try {
        const Data_battle = await zdBattle(a, b);
        const header = `${A_player.名号}向${B_player.名号}发起了切磋。\n`;
        const A_win = `${A_player.名号}击败了${B_player.名号}`;
        const B_win = `${B_player.名号}击败了${A_player.名号}`;
        const img = await screenshot('CombatResult', ``, {
            msg: [header, ...(Data_battle.msg || [])],
            playerA: {
                id: A,
                name: A_player.名号,
                avatar: getAvatar(A),
                power: A_player.战力,
                hp: A_player.当前血量,
                maxHp: A_player.血量上限
            },
            playerB: {
                id: B,
                name: B_player.名号,
                avatar: getAvatar(B),
                power: B_player.战力,
                hp: B_player.当前血量,
                maxHp: B_player.血量上限
            },
            result: Data_battle.msg.includes(A_win)
                ? 'A'
                : Data_battle.msg.includes(B_win)
                    ? 'B'
                    : 'draw'
        });
        if (Buffer.isBuffer(img)) {
            Send(Image(img));
        }
        else {
            const result = Data_battle.msg.includes(A_win)
                ? 'A'
                : Data_battle.msg.includes(B_win)
                    ? 'B'
                    : 'draw';
            Send(Text(header + result));
        }
    }
    catch (_err) {
        Send(Text('战斗过程出现异常'));
    }
    return false;
});

export { res as default, regular };
