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
import { existplayer, convert2integer, Read_player, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)#交税[1-9]d*/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let lingshi = e.MessageText.replace('#', '');
    lingshi = lingshi.replace('交税', '');
    lingshi = await convert2integer(lingshi);
    let player = await Read_player(usr_qq);
    if (player.灵石 <= lingshi) {
        Send(Text('醒醒，你没有那么多'));
        return false;
    }
    await Add___(usr_qq, -lingshi);
    Send(Text('成功交税' + lingshi));
});

export { res as default, name, regular, selects };
