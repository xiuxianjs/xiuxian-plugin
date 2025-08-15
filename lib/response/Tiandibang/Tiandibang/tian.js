import { screenshot } from '../../../image/index.js';
import { redis } from '../../../model/api.js';
import '../../../model/Config.js';
import { __PATH } from '../../../model/paths.js';
import data from '../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../model/xiuxian_impl.js';
import '../../../model/danyao.js';
import { shijianc } from '../../../model/common.js';
import 'lodash-es';
import '../../../model/equipment.js';
import '../../../model/shop.js';
import '../../../model/trade.js';
import '../../../model/qinmidu.js';
import '../../../model/shitu.js';
import '../../../model/temp.js';
import 'alemonjs';
import '../../../model/settions.js';
import 'dayjs';
import 'crypto';

async function Write_tiandibang(wupin) {
    await redis.set(`${__PATH.tiandibang}:tiandibang`, JSON.stringify(wupin, null, '\t'));
    return false;
}
async function readTiandibang() {
    const tiandibang = await redis.get(`${__PATH.tiandibang}:tiandibang`);
    if (!tiandibang) {
        return [];
    }
    const data = JSON.parse(tiandibang);
    return data;
}
async function getLastbisai(usr_qq) {
    const timeStr = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastbisai_time');
    if (timeStr != null) {
        const details = await shijianc(parseInt(timeStr, 10));
        return details;
    }
    return false;
}
async function get_tianditang_img(e, jifen) {
    const usr_qq = e.UserId;
    const player = await readPlayer(usr_qq);
    const commodities_list = data.tianditang;
    const tianditang_data = {
        name: player.名号,
        jifen,
        commodities_list: commodities_list
    };
    const img = await screenshot('tianditang', e.UserId, tianditang_data);
    return img;
}
async function re_bangdang() {
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    const temp = [];
    for (let k = 0; k < playerList.length; k++) {
        const thisQqStr = playerList[k];
        const player = await readPlayer(thisQqStr);
        const level_id = data.Level_list.find(item => item.level_id == player.level_id)?.level_id;
        if (level_id == null)
            continue;
        temp.push({
            名号: player.名号,
            境界: level_id,
            攻击: player.攻击,
            防御: player.防御,
            当前血量: player.血量上限,
            暴击率: player.暴击率,
            灵根: player.灵根,
            法球倍率: player.灵根.法球倍率,
            学习的功法: player.学习的功法,
            魔道值: player.魔道值 ?? 0,
            神石: player.神石 ?? 0,
            qq: thisQqStr,
            次数: 3,
            积分: 0
        });
    }
    temp.sort((a, b) => b.积分 - a.积分);
    await Write_tiandibang(temp);
    return false;
}

export { Write_tiandibang, getLastbisai, get_tianditang_img, re_bangdang, readTiandibang };
