import { useSend, Text, Image } from 'alemonjs';
import fs from 'fs';
import '../../../../api/api.js';
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
import data from '../../../../model/XiuxianData.js';
import { existplayer, Read_player, Get_xiuwei, isNotNull, sortBy, get_ranking_power_img } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)天榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let usr_paiming;
    let File = fs.readdirSync(__PATH.player_path);
    File = File.filter(file => file.endsWith('.json'));
    let File_length = File.length;
    let temp = [];
    for (let i = 0; i < File_length; i++) {
        let this_qq = File[i].replace('.json', '');
        this_qq = parseInt(this_qq);
        let player = await Read_player(this_qq);
        let sum_exp = await Get_xiuwei(this_qq);
        if (!isNotNull(player.level_id)) {
            Send(Text('请先#同步信息'));
            return false;
        }
        let level = data.Level_list.find(item => item.level_id == player.level_id).level;
        temp[i] = { 总修为: sum_exp, 境界: level, 名号: player.名号, qq: this_qq };
    }
    temp.sort(sortBy('总修为'));
    usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1;
    let Data = [];
    if (File_length > 10) {
        File_length = 10;
    }
    for (let i = 0; i < File_length; i++) {
        temp[i].名次 = i + 1;
        Data[i] = temp[i];
    }
    let thisplayer = await data.getData('player', usr_qq);
    let img = await get_ranking_power_img(e, Data, usr_paiming, thisplayer);
    if (img)
        Send(Image(img));
});

export { res as default, regular, selects };
