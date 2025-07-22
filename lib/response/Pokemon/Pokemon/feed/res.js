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
import { convert2integer, isNotNull, exist_najie_thing, Add_najie_thing } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)喂给仙宠.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    if (player.仙宠 == '') {
        Send(Text('你没有仙宠'));
        return false;
    }
    let thing = e.MessageText.replace('#', '');
    thing = thing.replace('喂给仙宠', '');
    let code = thing.split('*');
    let thing_name = code[0];
    let thing_value = await convert2integer(code[1]);
    let ifexist = data.xianchonkouliang.find(item => item.name == thing_name);
    if (!isNotNull(ifexist)) {
        Send(Text('此乃凡物,仙宠不吃' + thing_name));
        return false;
    }
    if (player.仙宠.等级 == player.仙宠.等级上限 && player.仙宠.品级 != '仙灵') {
        Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'));
        return false;
    }
    if (player.仙宠.品级 == '仙灵' && player.仙宠.等级 == player.仙宠.等级上限) {
        Send(Text('您的仙宠已达到天赋极限'));
        return false;
    }
    let thing_quantity = await exist_najie_thing(usr_qq, thing_name, '仙宠口粮');
    if (thing_quantity < thing_value || !thing_quantity) {
        Send(Text(`【${thing_name}】数量不足`));
        return false;
    }
    await Add_najie_thing(usr_qq, thing_name, '仙宠口粮', -thing_value);
    let jiachen = ifexist.level * thing_value;
    if (jiachen > player.仙宠.等级上限 - player.仙宠.等级) {
        jiachen = player.仙宠.等级上限 - player.仙宠.等级;
    }
    player.仙宠.加成 += jiachen * player.仙宠.每级增加;
    if (player.仙宠.type == '修炼') {
        player.修炼效率提升 += jiachen * player.仙宠.每级增加;
    }
    if (player.仙宠.type == '幸运') {
        player.幸运 += jiachen * player.仙宠.每级增加;
    }
    if (player.仙宠.等级上限 > player.仙宠.等级 + jiachen) {
        player.仙宠.等级 += jiachen;
    }
    else {
        if (player.仙宠.品级 == '仙灵') {
            Send(Text('您的仙宠已达到天赋极限'));
        }
        else {
            Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'));
        }
        player.仙宠.等级 = player.仙宠.等级上限;
    }
    await data.setData('player', usr_qq, player);
    Send(Text(`喂养成功，仙宠的等级增加了${jiachen},当前为${player.仙宠.等级}`));
});

export { res as default, name, regular, selects };
