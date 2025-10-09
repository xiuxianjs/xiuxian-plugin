import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import { KEY_RECORD, KEY_WORLD_BOOS_STATUS } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
import { screenshot } from '../../../../image/index.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { isBossWord, bossStatus, SortPlayer } from '../../../../model/boss.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw from '../../../mw-captcha.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?妖王贡献榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        void Send(Text('你还未开始修仙'));
        return false;
    }
    if (!(await isBossWord())) {
        void Send(Text('妖王未刷新'));
        return;
    }
    const bossStatusResult = await bossStatus('1');
    if (bossStatusResult === 'dead') {
        void Send(Text('妖王已经被击败了，请等待下次刷新'));
        return;
    }
    else if (bossStatusResult === 'initializing') {
        void Send(Text('妖王正在初始化，请稍后'));
        return;
    }
    const playerRecord = await getDataJSONParseByKey(KEY_RECORD);
    const worldBossStatus = await getDataJSONParseByKey(KEY_WORLD_BOOS_STATUS);
    if (!playerRecord || !Array.isArray(playerRecord.Name)) {
        void Send(Text('还没人挑战过妖王'));
        return false;
    }
    const playerList = SortPlayer(playerRecord);
    if (!Array.isArray(playerList) || playerList.length === 0) {
        void Send(Text('还没人挑战过妖王'));
        return false;
    }
    let totalDamage = 0;
    const limit = Math.min(playerList.length, 20);
    for (let i = 0; i < limit; i++) {
        const idx = playerList[i];
        totalDamage += playerRecord.TotalDamage[idx] ?? 0;
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
        void Send(Text(`你在妖王周本贡献排行榜中排名第${currentQq}，造成伤害${playerRecord.TotalDamage[idx] || 0}，再接再厉！`));
    }
    const image = await screenshot('immortal_genius', userId, {
        allplayer: temp,
        title: '妖王贡献榜',
        label: '上海'
    });
    if (Buffer.isBuffer(image)) {
        void Send(Image(image));
        return false;
    }
    void Send(Text('图片生产失败'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
