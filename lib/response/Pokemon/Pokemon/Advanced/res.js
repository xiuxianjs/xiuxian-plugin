import { useSend, Text } from 'alemonjs';
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
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { Write_player } from '../../../../model/pub.js';
import { exist_najie_thing, Add_najie_thing } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)进阶仙宠$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    let list = ['仙胎', '仙仔', '仙兽', '仙道', '仙灵'];
    let list_level = [20, 40, 60, 80, 100];
    let x = 114514;
    for (let i = 0; list.length > i; i++) {
        if (list[i] == player.仙宠.品级) {
            x = i;
            break;
        }
    }
    if (x == 114514) {
        Send(Text('你没有仙宠'));
        return false;
    }
    if (x == 4) {
        Send(Text('[' + player.仙宠.name + ']已达到最高品级'));
        return false;
    }
    let number_n = x + 1;
    let name = number_n + '级仙石';
    let quantity = await exist_najie_thing(usr_qq, name, '道具');
    if (!quantity) {
        Send(Text(`你没有[${name}]`));
        return false;
    }
    let player_level = player.仙宠.等级;
    let last_jiachen = player.仙宠.加成;
    if (player_level == list_level[x]) {
        let thing = data.xianchon.find(item => item.id == player.仙宠.id + 1);
        console.log(thing);
        player.仙宠 = thing;
        player.仙宠.等级 = player_level;
        player.仙宠.加成 = last_jiachen;
        await Add_najie_thing(usr_qq, name, '道具', -1);
        await Write_player(usr_qq, player);
        Send(Text('恭喜进阶【' + player.仙宠.name + '】成功'));
    }
    else {
        let need = Number(list_level[x]) - Number(player_level);
        Send(Text('仙宠的灵泉集韵不足,还需要【' + need + '】级方可进阶'));
        return false;
    }
});

export { res as default, name, regular, selects };
