import { useSend, Text } from 'alemonjs';
import 'yaml';
import 'fs';
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
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { existplayer, Read_player, dujie, LevelTask } from '../../../../model/xiuxian.js';
import '../../../../api/api.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)渡劫$/;
let dj = 0;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    let now_level = data.Level_list.find(item => item.level_id == player.level_id).level;
    if (now_level != '渡劫期') {
        Send(Text(`你非渡劫期修士！`));
        return false;
    }
    if (player.linggenshow == 1) {
        Send(Text(`你灵根未开，不能渡劫！`));
        return false;
    }
    if (player.power_place == 0) {
        Send(Text('你已度过雷劫，请感应仙门#登仙'));
        return false;
    }
    let now_HP = player.当前血量;
    let list_HP = data.Level_list.find(item => item.level == now_level).基础血量;
    if (now_HP < list_HP * 0.9) {
        player.当前血量 = 1;
        await Write_player(usr_qq, player);
        Send(Text(player.名号 + '血量亏损，强行渡劫后晕倒在地！'));
        return false;
    }
    let now_level_id = data.Level_list.find(item => item.level == now_level).level_id;
    let now_exp = player.修为;
    let need_exp = data.Level_list.find(item => item.level_id == now_level_id).exp;
    if (now_exp < need_exp) {
        Send(Text(`修为不足,再积累${need_exp - now_exp}修为后方可突破`));
        return false;
    }
    let x = await dujie(usr_qq);
    let y = 3;
    if (player.灵根.type == '伪灵根') {
        y = 3;
    }
    else if (player.灵根.type == '真灵根') {
        y = 6;
    }
    else if (player.灵根.type == '天灵根') {
        y = 9;
    }
    else if (player.灵根.type == '体质') {
        y = 10;
    }
    else if (player.灵根.type == '转生' || player.灵根.type == '魔头') {
        y = 21;
    }
    else if (player.灵根.type == '转圣') {
        y = 26;
    }
    else {
        y = 12;
    }
    let n = 1380;
    let p = 280;
    let m = n + p;
    if (x <= n) {
        player.当前血量 = 0;
        player.修为 -= Math.floor(need_exp / 4);
        await Write_player(usr_qq, player);
        Send(Text('天空一声巨响，未降下雷劫，就被天道的气势震死了。'));
        return false;
    }
    if (dj > 0) {
        Send(Text('已经有人在渡劫了,建议打死他'));
        return false;
    }
    dj++;
    let l = (x - n) / (p + y * 0.1);
    l = l * 100;
    l = l.toFixed(2);
    Send(Text('天道：就你，也敢逆天改命？'));
    Send(Text('[' +
        player.名号 +
        ']' +
        '\n雷抗：' +
        x +
        '\n成功率：' +
        l +
        '%\n灵根：' +
        player.灵根.type +
        '\n需渡' +
        y +
        '道雷劫\n将在一分钟后落下\n[温馨提示]\n请把其他渡劫期打死后再渡劫！'));
    let aconut = 1;
    let time = setInterval(async function () {
        const flag = await LevelTask(e, n, m, y, aconut);
        aconut++;
        if (!flag) {
            dj = 0;
            clearInterval(time);
        }
    }, 60000);
});

export { res as default, regular, selects };
