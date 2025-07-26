import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { redis } from '../../../../api/api.js';
import { existplayer, readPlayer, sortBy } from '../../../../model/xiuxian.js';
import 'dayjs';
import puppeteer from '../../../../image/index.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?至尊榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    let temp = [];
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (let file of playerList) {
        const player = await readPlayer(file);
        if (player.level_id >= 42) {
            continue;
        }
        const power = Math.trunc((player.攻击 + player.防御 * 0.8 + player.血量上限 * 0.6) *
            (player.暴击率 + 1));
        temp.push({
            power: power,
            qq: file,
            name: player.名号,
            level_id: player.level_id,
            灵石: player.灵石
        });
    }
    temp.sort(sortBy('power'));
    logger.info(temp);
    const top = temp.slice(0, 10);
    const image = await puppeteer.screenshot('immortal_genius', usr_qq, {
        allplayer: top
    });
    if (!image) {
        Send(Text('图片生产失败'));
        return false;
    }
    Send(Image(image));
});

export { res as default, regular };
