import { useSend, Text } from 'alemonjs';
import { dujie, LevelTask } from '../../../../model/cultivation.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import mw, { selects } from '../../../mw.js';
import { getDataList } from '../../../../model/DataList.js';
import { writePlayer } from '../../../../model/pub.js';

const regular = /^(#|＃|\/)?渡劫$/;
let dj = 0;
const MIN_HP_RATIO = 0.9;
const BASE_N = 1380;
const RANGE_P = 280;
const STRIKE_DELAY_MS = 60_000;
function buildLinggenFactor(type) {
    switch (type) {
        case '伪灵根':
            return 3;
        case '真灵根':
            return 6;
        case '天灵根':
            return 9;
        case '体质':
            return 10;
        case '转生':
        case '魔头':
            return 21;
        case '转圣':
            return 26;
        default:
            return 12;
    }
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq))) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!player) {
        return false;
    }
    const levelList = await getDataList('Level1');
    const levelInfo = levelList.find(l => l.level_id === player.level_id);
    if (!levelInfo) {
        Send(Text('境界数据缺失'));
        return false;
    }
    if (levelInfo.level !== '渡劫期') {
        Send(Text('你非渡劫期修士！'));
        return false;
    }
    if (player.linggenshow === 1) {
        Send(Text('你灵根未开，不能渡劫！'));
        return false;
    }
    if (player.power_place === 0) {
        Send(Text('你已度过雷劫，请感应仙门#登仙'));
        return false;
    }
    const baseHpNeed = Number(levelInfo.基础血量) || 0;
    if (Number(player.当前血量) < baseHpNeed * MIN_HP_RATIO) {
        player.当前血量 = 1;
        await writePlayer(usr_qq, player);
        Send(Text(`${player.名号}血量亏损，强行渡劫后晕倒在地！`));
        return false;
    }
    const needExp = levelInfo.exp;
    if (player.修为 < needExp) {
        Send(Text(`修为不足,再积累${needExp - player.修为}修为后方可突破`));
        return false;
    }
    const x = await dujie(usr_qq);
    const y = buildLinggenFactor(player.灵根.type);
    const n = BASE_N;
    const p = RANGE_P;
    if (x <= n) {
        player.当前血量 = 0;
        player.修为 -= Math.floor(needExp / 4);
        if (player.修为 < 0) {
            player.修为 = 0;
        }
        await writePlayer(usr_qq, player);
        Send(Text('天空一声巨响，未降下雷劫，就被天道的气势震死了。'));
        return false;
    }
    if (dj > 0) {
        Send(Text('已经有人在渡劫了,建议打死他'));
        return false;
    }
    dj++;
    const denominator = p + y * 0.1;
    const lRatio = denominator > 0 ? ((x - n) / denominator) * 100 : 0;
    const percent = lRatio.toFixed(2);
    Send(Text('天道：就你，也敢逆天改命？'));
    Send(Text(`【${player.名号}】\n雷抗：${x}\n成功率：${percent}%\n灵根：${player.灵根.type}\n需渡${y}道雷劫\n将在1分钟后落下\n[温馨提示]\n请把其他渡劫期打死后再渡劫！`));
    let strikeIndex = 1;
    let active = true;
    const doStrike = async () => {
        if (!active) {
            return;
        }
        const stillPlayer = await readPlayer(usr_qq);
        if (!stillPlayer) {
            release();
            return;
        }
        if (stillPlayer.当前血量 <= 0 || stillPlayer.power_place === 0) {
            release();
            return;
        }
        const publicEvent = e;
        const cont = await LevelTask(publicEvent, n, n + p, y, strikeIndex);
        strikeIndex++;
        if (!cont || strikeIndex > y) {
            release();
            return;
        }
        setTimeout(doStrike, STRIKE_DELAY_MS);
    };
    const release = (_reason) => {
        if (!active) {
            return;
        }
        active = false;
        dj = 0;
    };
    setTimeout(doStrike, STRIKE_DELAY_MS);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
