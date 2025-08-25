import { useSend, Text, Image } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_TWO } from '../../../../model/constants.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import { sortBy } from '../../../../model/cultivation.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import '../../../../route/core/auth.js';
import { BossIsAlive, SortPlayer } from '../../../../model/boss.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?金角大王贡献榜$/;
function parseJson(raw) {
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq))) {
        return false;
    }
    if (!(await BossIsAlive())) {
        Send(Text('金角大王未开启！'));
        return false;
    }
    const PlayerRecord = parseJson(await redis.get(KEY_RECORD_TWO));
    const WorldBossStatusStr = parseJson(await redis.get(KEY_WORLD_BOOS_STATUS_TWO));
    if (!PlayerRecord || !Array.isArray(PlayerRecord.Name)) {
        Send(Text('还没人挑战过金角大王'));
        return false;
    }
    const PlayerList = await SortPlayer(PlayerRecord);
    if (!Array.isArray(PlayerList) || PlayerList.length === 0) {
        Send(Text('还没人挑战过金角大王'));
        return false;
    }
    let TotalDamage = 0;
    const limit = Math.min(PlayerList.length, 20);
    for (let i = 0; i < limit; i++) {
        const idx = PlayerList[i];
        TotalDamage += PlayerRecord.TotalDamage[idx] || 0;
    }
    if (TotalDamage <= 0) {
        TotalDamage = 1;
    }
    const rewardBase = WorldBossStatusStr?.Reward || 0;
    const bossDead = (WorldBossStatusStr?.Health || 0) === 0;
    let CurrentQQ;
    const temp = [];
    for (let i = 0; i < PlayerList.length && i < 20; i++) {
        const idx = PlayerList[i];
        const dmg = PlayerRecord.TotalDamage[idx] || 0;
        let Reward = Math.trunc((dmg / TotalDamage) * rewardBase);
        if (Reward < 200000) {
            Reward = 200000;
        }
        temp[i] = {
            power: dmg,
            qq: PlayerRecord.QQ[idx],
            name: PlayerRecord.Name[idx],
            sub: [
                {
                    label: bossDead ? '已得到灵石' : '预计得到灵石',
                    value: Reward
                }
            ],
            level_id: 0
        };
        if (PlayerRecord.QQ[idx] == e.UserId) {
            CurrentQQ = i + 1;
        }
    }
    if (CurrentQQ) {
        const idx = PlayerList[CurrentQQ - 1];
        Send(Text(`你在金角大王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${PlayerRecord.TotalDamage[idx] || 0}，再接再厉！`));
    }
    temp.sort(sortBy('power'));
    const top = temp.slice(0, 10);
    const image = await screenshot('immortal_genius', user_qq, {
        allplayer: top,
        title: '金角大王贡献榜',
        label: '伤害'
    });
    if (Buffer.isBuffer(image)) {
        Send(Image(image));
        return;
    }
    Send(Text('图片生产失败'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
