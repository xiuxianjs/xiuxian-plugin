import { useSend, Text, Image } from 'alemonjs';
import fs from 'fs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
import 'yaml';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { existplayer, __PATH, Read_player, Get_xiuwei, isNotNull, sortBy, get_ranking_power_img } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
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

export { res as default, name, regular, selects };
