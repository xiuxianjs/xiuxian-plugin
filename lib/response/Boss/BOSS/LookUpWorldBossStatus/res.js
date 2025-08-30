import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { isBossWord, bossStatus } from '../../../../model/boss.js';
import { KEY_WORLD_BOOS_STATUS } from '../../../../model/keys.js';
import mw from '../../../mw.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?妖王状态$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
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
    const WorldBossStatusStr = await redis.get(KEY_WORLD_BOOS_STATUS);
    if (WorldBossStatusStr) {
        const WorldBossStatus = JSON.parse(WorldBossStatusStr);
        const ReplyMsg = [`----妖王状态----\n攻击:????????????\n防御:????????????\n血量:${WorldBossStatus.Health}\n奖励:${WorldBossStatus.Reward}`];
        void Send(Text(ReplyMsg.join('\n')));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
