import { useSend, useMention, Text } from 'alemonjs';
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
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import 'classnames';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
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
        const battleMsg = Array.isArray(Data_battle.msg)
            ? Data_battle.msg.join('\n')
            : '战斗结束';
        const header = `${A_player.名号}向${B_player.名号}发起了切磋。\n`;
        Send(Text(header + battleMsg));
    }
    catch (_err) {
        Send(Text('战斗过程出现异常'));
    }
    return false;
});

export { res as default, regular };
