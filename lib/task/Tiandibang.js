import { Write_tiandibang } from '../response/Tiandibang/Tiandibang/tian.js';
import '../model/api.js';
import { keysByPath, __PATH } from '../model/keys.js';
import '@alemonjs/db';
import '../model/DataList.js';
import { readPlayer } from '../model/xiuxian_impl.js';
import 'alemonjs';
import data from '../model/XiuxianData.js';
import 'lodash-es';
import '../model/settions.js';

const TiandibangTask = async () => {
    const playerList = await keysByPath(__PATH.player_path);
    const temp = [];
    let t;
    for (let k = 0; k < playerList.length; k++) {
        const user_qq = playerList[k];
        const player = await readPlayer(user_qq);
        const level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        temp[k] = {
            名号: player.名号,
            境界: level_id,
            攻击: player.攻击,
            防御: player.防御,
            当前血量: player.血量上限,
            暴击率: player.暴击率,
            灵根: player.灵根,
            法球倍率: player.灵根.法球倍率,
            学习的功法: player.学习的功法,
            魔道值: player.魔道值,
            神石: player.神石,
            qq: user_qq,
            次数: 3,
            积分: 0
        };
    }
    for (let i = 0; i < playerList.length - 1; i++) {
        let count = 0;
        for (let j = 0; j < playerList.length - i - 1; j++) {
            if (temp[j].积分 < temp[j + 1].积分) {
                t = temp[j];
                temp[j] = temp[j + 1];
                temp[j + 1] = t;
                count = 1;
            }
        }
        if (count == 0)
            break;
    }
    await Write_tiandibang(temp);
    return false;
};

export { TiandibangTask };
