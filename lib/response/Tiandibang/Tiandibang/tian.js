import { redis } from '../../../api/api.js';
import 'yaml';
import fs from 'fs';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/namelist.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/version.yaml.js';
import '../../../config/xiuxian.yaml.js';
import path from 'path';
import { __PATH } from '../../../model/paths.js';
import data from '../../../model/XiuxianData.js';
import { Read_player, shijianc } from '../../../model/xiuxian.js';
import 'dayjs';
import puppeteer from '../../../image/index.js';

async function Write_tiandibang(wupin) {
    let dir = path.join(__PATH.tiandibang, `tiandibang.json`);
    let new_ARR = JSON.stringify(wupin, null, '\t');
    fs.writeFileSync(dir, new_ARR);
    return false;
}
async function Read_tiandibang() {
    let dir = path.join(`${__PATH.tiandibang}/tiandibang.json`);
    let tiandibang = fs.readFileSync(dir, 'utf8');
    tiandibang = JSON.parse(tiandibang);
    return tiandibang;
}
async function getLastbisai(usr_qq) {
    let time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastbisai_time');
    logger.info(time);
    if (time != null) {
        let data = await shijianc(parseInt(time));
        return data;
    }
    return false;
}
async function get_tianditang_img(e, jifen) {
    let usr_qq = e.UserId;
    let player = await Read_player(usr_qq);
    let commodities_list = data.tianditang;
    let tianditang_data = {
        name: player.名号,
        jifen,
        commodities_list: commodities_list
    };
    let img = await puppeteer.screenshot('tianditang', e.UserId, tianditang_data);
    return img;
}
async function re_bangdang() {
    let File = fs.readdirSync(__PATH.player_path);
    File = File.filter(file => file.endsWith('.json'));
    let File_length = File.length;
    let temp = [];
    let t;
    for (let k = 0; k < File_length; k++) {
        let this_qq = File[k].replace('.json', '');
        this_qq = parseInt(this_qq);
        let player = await Read_player(this_qq);
        let level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
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
            qq: this_qq,
            次数: 3,
            积分: 0
        };
    }
    for (let i = 0; i < File_length - 1; i++) {
        let count = 0;
        for (let j = 0; j < File_length - i - 1; j++) {
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
}

export { Read_tiandibang, Write_tiandibang, getLastbisai, get_tianditang_img, re_bangdang };
