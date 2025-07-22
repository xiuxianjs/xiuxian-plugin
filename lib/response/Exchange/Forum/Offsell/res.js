import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
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
import '../../../../model/XiuxianData.js';
import { existplayer, Read_player, Read_Forum, Write_Forum, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)取消[1-9]d*/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let Forum;
    let player = await Read_player(usr_qq);
    let x = parseInt(e.MessageText.replace('#取消', '')) - 1;
    try {
        Forum = await Read_Forum();
    }
    catch {
        await Write_Forum([]);
        Forum = await Read_Forum();
    }
    if (x >= Forum.length) {
        Send(Text(`没有编号为${x + 1}的宝贝需求`));
        return false;
    }
    if (Forum[x].qq != usr_qq) {
        Send(Text('不能取消别人的宝贝需求'));
        return false;
    }
    await Add___(usr_qq, Forum[x].whole);
    Send(Text(player.名号 +
        '取消' +
        Forum[x].name +
        '成功,返还' +
        Forum[x].whole +
        '灵石'));
    Forum.splice(x, 1);
    await Write_Forum(Forum);
});

export { res as default, name, regular, selects };
