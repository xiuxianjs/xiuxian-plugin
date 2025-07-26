import { useSend, Text, Image } from 'alemonjs';
import fs from 'fs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'path';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, readPlayer, Get_xiuwei, isNotNull, sortBy } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { getRankingPowerImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?天榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let usr_paiming;
    let File = fs
        .readdirSync(__PATH.player_path)
        .filter(file => file.endsWith('.json'));
    let File_length = File.length;
    let temp = [];
    for (let i = 0; i < File_length; i++) {
        let this_qq = parseInt(File[i].replace('.json', ''));
        let player = await readPlayer(this_qq);
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
    let img = await getRankingPowerImage(e, Data, usr_paiming, thisplayer);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
