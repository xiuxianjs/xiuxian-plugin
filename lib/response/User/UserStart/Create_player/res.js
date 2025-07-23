import { useSend, Image } from 'alemonjs';
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
import { Write_player } from '../../../../model/pub.js';
import { existplayer, get_player_img, get_random_talent, Write_equipment, Write_najie, Add_HP, Write_danyao } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?踏入仙途$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (ifexistplay) {
        let img = await get_player_img(e);
        if (img)
            Send(Image(img));
        return false;
    }
    let File_msg = fs.readdirSync(__PATH.player_path);
    let n = File_msg.length + 1;
    let talent = await get_random_talent();
    let new_player = {
        id: e.UserId,
        sex: 0,
        名号: `路人甲${n}号`,
        宣言: '这个人很懒还没有写',
        avatar: e.UserAvatar || 'https://s1.ax1x.com/2022/08/09/v8XV3q.jpg',
        level_id: 1,
        Physique_id: 1,
        race: 1,
        修为: 1,
        血气: 1,
        灵石: 10000,
        灵根: talent,
        神石: 0,
        favorability: 0,
        breakthrough: false,
        linggen: [],
        linggenshow: 1,
        学习的功法: [],
        修炼效率提升: talent.eff,
        连续签到天数: 0,
        攻击加成: 0,
        防御加成: 0,
        生命加成: 0,
        power_place: 1,
        当前血量: 8000,
        lunhui: 0,
        lunhuiBH: 0,
        轮回点: 10,
        occupation: [],
        occupation_level: 1,
        镇妖塔层数: 0,
        神魄段数: 0,
        魔道值: 0,
        仙宠: [],
        练气皮肤: 0,
        装备皮肤: 0,
        幸运: 0,
        addluckyNo: 0,
        师徒任务阶段: 0,
        师徒积分: 0
    };
    await Write_player(usr_qq, new_player);
    let new_equipment = {
        武器: data.equipment_list.find(item => item.name == '烂铁匕首'),
        护具: data.equipment_list.find(item => item.name == '破铜护具'),
        法宝: data.equipment_list.find(item => item.name == '廉价炮仗')
    };
    await Write_equipment(usr_qq, new_equipment);
    let new_najie = {
        等级: 1,
        灵石上限: 5000,
        灵石: 0,
        装备: [],
        丹药: [],
        道具: [],
        功法: [],
        草药: [],
        材料: [],
        仙宠: [],
        仙宠口粮: []
    };
    await Write_najie(usr_qq, new_najie);
    await Add_HP(usr_qq, 999999);
    const arr = {
        biguan: 0,
        biguanxl: 0,
        xingyun: 0,
        lianti: 0,
        ped: 0,
        modao: 0,
        beiyong1: 0,
        beiyong2: 0,
        beiyong3: 0,
        beiyong4: 0,
        beiyong5: 0
    };
    await Write_danyao(usr_qq, arr);
    let img = await get_player_img(e);
    if (img)
        Send(Image(img));
    return false;
});

export { res as default, regular };
