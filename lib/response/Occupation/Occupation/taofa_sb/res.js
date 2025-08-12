import { useSend, Text } from 'alemonjs';
import { redis, pushInfo } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { existplayer, readPlayer, addExp4 } from '../../../../model/xiuxian_impl.js';
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

const regular = /^(#|＃|\/)?讨伐目标.*$/;
function parseJson(raw) {
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const actionState = parseJson(await redis.get('xiuxian@1.3.0:' + usr_qq + ':action'));
    if (actionState) {
        const now_time = Date.now();
        const end = actionState.end_time;
        if (now_time <= end) {
            const remain = end - now_time;
            const m = Math.floor(remain / 60000);
            const s = Math.floor((remain % 60000) / 1000);
            Send(Text(`正在${actionState.action}中,剩余时间:${m}分${s}秒`));
            return false;
        }
    }
    const player = await readPlayer(usr_qq);
    if (player.occupation != '侠客') {
        Send(Text('侠客资质不足,需要进行训练'));
        return false;
    }
    const task = parseJson(await redis.get('xiuxian@1.3.0:' + usr_qq + ':shangjing'));
    if (!task) {
        Send(Text('还没有接取到悬赏,请查看后再来吧'));
        return false;
    }
    if (task.arm.length === 0) {
        Send(Text('每日限杀,请等待20小时后新的赏金目标'));
        return false;
    }
    const idxRaw = e.MessageText.replace(/^(#|＃|\/)?讨伐目标/, '').trim();
    const num = parseInt(idxRaw, 10) - 1;
    if (isNaN(num) || num < 0 || num >= task.arm.length) {
        Send(Text('不要伤及无辜'));
        return false;
    }
    const target = task.arm[num];
    const qq = target.QQ;
    let last_msg = '';
    if (qq != 1) {
        const player_B = await readPlayer(String(qq));
        player_B.当前血量 = player_B.血量上限;
        const fq = typeof player_B.灵根.法球倍率 === 'number'
            ? player_B.灵根.法球倍率
            : parseFloat(String(player_B.灵根.法球倍率)) || 0;
        const buff = 1 + (player.occupation_level || 0) * 0.055;
        const player_A = {
            id: player.id,
            名号: player.名号,
            攻击: Math.floor(player.攻击 * buff),
            防御: Math.floor(player.防御),
            当前血量: Math.floor(player.血量上限 * buff),
            暴击率: player.暴击率,
            学习的功法: player.学习的功法,
            魔道值: player.魔道值 || 0,
            灵根: { ...player.灵根, 法球倍率: fq },
            法球倍率: fq,
            仙宠: player.仙宠,
            神石: player.神石 || 0
        };
        const player_B_entity = {
            id: player_B.id,
            名号: player_B.名号,
            攻击: player_B.攻击,
            防御: player_B.防御,
            当前血量: player_B.当前血量,
            暴击率: player_B.暴击率,
            学习的功法: player_B.学习的功法,
            魔道值: player_B.魔道值 || 0,
            灵根: { ...player_B.灵根, 法球倍率: fq },
            法球倍率: fq,
            仙宠: player_B.仙宠,
            神石: player_B.神石 || 0
        };
        const Data_battle = await zdBattle(player_A, player_B_entity);
        const msg = Data_battle.msg || [];
        const A_win = `${player_A.名号}击败了${player_B.名号}`;
        const B_win = `${player_B.名号}击败了${player_A.名号}`;
        if (msg.includes(A_win)) {
            player_B.魔道值 = (player_B.魔道值 || 0) - 50;
            player_B.灵石 -= 1000000;
            player_B.当前血量 = 0;
            await writePlayer(String(qq), player_B);
            player.灵石 += target.赏金;
            player.魔道值 = (player.魔道值 || 0) - 5;
            await writePlayer(usr_qq, player);
            await addExp4(usr_qq, 2255);
            last_msg = `【全服公告】${player_B.名号}失去了1000000灵石,罪恶得到了洗刷,魔道值-50,无名侠客获得了部分灵石,自己的正气提升了,同时获得了更多的悬赏加成`;
        }
        else if (msg.includes(B_win)) {
            const shangjing = Math.trunc(target.赏金 * 0.8);
            player.当前血量 = 0;
            player.灵石 += shangjing;
            player.魔道值 = (player.魔道值 || 0) - 5;
            await writePlayer(usr_qq, player);
            await addExp4(usr_qq, 1100);
            last_msg = `${player_B.名号}反杀了你,只获得了部分辛苦钱`;
        }
        if (msg.length > 100) {
            logger.info('通过');
        }
        else {
            Send(Text(msg.join('\n')));
        }
    }
    else {
        player.灵石 += target.赏金;
        player.魔道值 = (player.魔道值 || 0) - 5;
        await writePlayer(usr_qq, player);
        await addExp4(usr_qq, 2255);
        last_msg = '你惩戒了仙路窃贼,获得了部分灵石';
    }
    task.arm.splice(num, 1);
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':shangjing', JSON.stringify(task));
    if (last_msg === '你惩戒了仙路窃贼,获得了部分灵石' ||
        last_msg.endsWith('反杀了你,只获得了部分辛苦钱')) {
        Send(Text(last_msg));
    }
    else if (last_msg) {
        const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
        const groupList = await redis.smembers(redisGlKey);
        for (const group of groupList)
            pushInfo(group, true, last_msg);
    }
});

export { res as default, regular };
