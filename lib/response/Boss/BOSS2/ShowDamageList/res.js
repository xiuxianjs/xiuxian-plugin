import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import { KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_TWO } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import { isBossWord2, bossStatus, SortPlayer } from '../../../../model/boss.js';
import 'svg-captcha';
import 'sharp';
import { sortBy } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import 'lodash-es';
import 'posthog-node';
import '../../../../model/settions.js';
import '../../../../model/message.js';
import mw from '../../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?金角大王贡献榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        void Send(Text('你还未开始修仙'));
        return false;
    }
    if (!(await isBossWord2())) {
        void Send(Text('金角大王未刷新'));
        return;
    }
    const bossStatusResult = await bossStatus('2');
    if (bossStatusResult === 'dead') {
        void Send(Text('金角大王已经被击败了，请等待下次刷新'));
        return;
    }
    else if (bossStatusResult === 'initializing') {
        void Send(Text('金角大王正在初始化，请稍后'));
        return;
    }
    const playerRecord = (await getDataJSONParseByKey(KEY_RECORD_TWO));
    const worldBossStatus = (await getDataJSONParseByKey(KEY_WORLD_BOOS_STATUS_TWO));
    if (!playerRecord || !Array.isArray(playerRecord.Name)) {
        void Send(Text('还没人挑战过金角大王'));
        return false;
    }
    const playerList = SortPlayer(playerRecord);
    if (!Array.isArray(playerList) || playerList.length === 0) {
        void Send(Text('还没人挑战过金角大王'));
        return false;
    }
    let totalDamage = 0;
    const limit = Math.min(playerList.length, 20);
    for (let i = 0; i < limit; i++) {
        const idx = playerList[i];
        totalDamage += playerRecord.TotalDamage[idx] || 0;
    }
    if (totalDamage <= 0) {
        totalDamage = 1;
    }
    const rewardBase = worldBossStatus?.Reward ?? 0;
    const bossDead = (worldBossStatus?.Health ?? 0) === 0;
    let currentQq;
    const temp = [];
    for (let i = 0; i < playerList.length && i < 20; i++) {
        const idx = playerList[i];
        const dmg = playerRecord.TotalDamage[idx] || 0;
        let reward = Math.trunc((dmg / totalDamage) * rewardBase);
        if (reward < 200000) {
            reward = 200000;
        }
        temp[i] = {
            power: dmg,
            qq: playerRecord.QQ[idx],
            name: playerRecord.Name[idx],
            sub: [
                {
                    label: bossDead ? '已得到灵石' : '预计得到灵石',
                    value: reward
                }
            ],
            level_id: 0
        };
        if (playerRecord.QQ[idx] === userId) {
            currentQq = i + 1;
        }
    }
    if (currentQq) {
        const idx = playerList[currentQq - 1];
        void Send(Text(`你在金角大王周本贡献排行榜中排名第${currentQq}，造成伤害${playerRecord.TotalDamage[idx] || 0}，再接再厉！`));
    }
    temp.sort(sortBy('power'));
    const top = temp.slice(0, 10);
    const image = await screenshot('immortal_genius', userId, {
        allplayer: top,
        title: '金角大王贡献榜',
        label: '伤害'
    });
    if (Buffer.isBuffer(image)) {
        void Send(Image(image));
        return false;
    }
    void Send(Text('图片生产失败'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
