import { useSend, Image } from 'alemonjs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
import 'yaml';
import 'fs';
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
import { existplayer, Read_player, foundthing, instead_equipment, get_equipment_img } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)一键装备$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await data.getData('najie', usr_qq);
    let player = await Read_player(usr_qq);
    let sanwei = [];
    sanwei[0] =
        data.Level_list.find(item => item.level_id == player.level_id).基础攻击 +
            player.攻击加成 +
            data.LevelMax_list.find(item => item.level_id == player.Physique_id)
                .基础攻击;
    sanwei[1] =
        data.Level_list.find(item => item.level_id == player.level_id).基础防御 +
            player.防御加成 +
            data.LevelMax_list.find(item => item.level_id == player.Physique_id)
                .基础防御;
    sanwei[2] =
        data.Level_list.find(item => item.level_id == player.level_id).基础血量 +
            player.生命加成 +
            data.LevelMax_list.find(item => item.level_id == player.Physique_id)
                .基础血量;
    let equipment = await data.getData('equipment', usr_qq);
    let type = ['武器', '护具', '法宝'];
    for (let j of type) {
        let max;
        let max_equ;
        if (equipment[j].atk < 10 && equipment[j].def < 10 && equipment[j].HP < 10)
            max =
                equipment[j].atk * sanwei[0] * 0.43 +
                    equipment[j].def * sanwei[1] * 0.16 +
                    equipment[j].HP * sanwei[2] * 0.41;
        else
            max =
                equipment[j].atk * 0.43 +
                    equipment[j].def * 0.16 +
                    equipment[j].HP * 0.41;
        for (let i of najie['装备']) {
            let thing_exist = await foundthing(i.name);
            if (!thing_exist) {
                continue;
            }
            if (i.type == j) {
                let temp;
                if (i.atk < 10 && i.def < 10 && i.HP < 10)
                    temp =
                        i.atk * sanwei[0] * 0.43 +
                            i.def * sanwei[1] * 0.16 +
                            i.HP * sanwei[2] * 0.41;
                else
                    temp = i.atk * 0.43 + i.def * 0.16 + i.HP * 0.41;
                if (max < temp) {
                    max = temp;
                    max_equ = i;
                }
            }
        }
        if (max_equ)
            await instead_equipment(usr_qq, max_equ);
    }
    let img = await get_equipment_img(e);
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
