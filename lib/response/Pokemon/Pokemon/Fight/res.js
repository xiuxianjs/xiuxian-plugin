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
import { Read_najie, isNotNull, Add_仙宠 as Add___, Write_player } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)出战仙宠.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    let name = e.MessageText.replace('#', '');
    name = name.replace('出战仙宠', '');
    let num = parseInt(name);
    let najie = await Read_najie(usr_qq);
    if (num && num > 1000) {
        try {
            name = najie.仙宠[num - 1001].name;
        }
        catch {
            Send(Text('仙宠代号输入有误!'));
            return false;
        }
    }
    if (player.仙宠.灵魂绑定 == 1) {
        Send(Text('你已经与' + player.仙宠.name + '绑定了灵魂,无法更换别的仙宠！'));
        return false;
    }
    let thing = data.xianchon.find(item => item.name == name);
    if (!isNotNull(thing)) {
        Send(Text('这方世界不存在' + name));
        return false;
    }
    let last = 114514;
    for (let i = 0; najie.仙宠.length > i; i++) {
        if (najie.仙宠[i].name == name) {
            last = najie.仙宠[i];
            break;
        }
    }
    if (last == 114514) {
        Send(Text('你没有' + name));
        return false;
    }
    if (isNotNull(player.仙宠.name)) {
        await Add___(usr_qq, player.仙宠.name, 1, player.仙宠.等级);
    }
    if (player.仙宠.type == '修炼') {
        player.修炼效率提升 = player.修炼效率提升 - player.仙宠.加成;
    }
    if (player.仙宠.type == '幸运') {
        player.幸运 = player.幸运 - player.仙宠.加成;
    }
    player.仙宠 = last;
    player.仙宠.加成 = player.仙宠.等级 * player.仙宠.每级增加;
    if (last.type == '幸运') {
        player.幸运 = player.幸运 + last.加成;
    }
    if (last.type == '修炼') {
        player.修炼效率提升 = player.修炼效率提升 + last.加成;
    }
    await Add___(usr_qq, last.name, -1, last.等级);
    await Write_player(usr_qq, player);
    Send(Text('成功出战' + name));
});

export { res as default, name, regular, selects };
