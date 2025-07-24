import { useSend, Text, Image } from 'alemonjs';
import fs from 'fs';
import 'yaml';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import { __PATH } from '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player, sortBy } from '../../../../model/xiuxian.js';
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
    const files = fs
        .readdirSync(__PATH.player_path)
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        const player = await Read_player(file);
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
