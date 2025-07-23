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
import '../../../../model/XiuxianData.js';
import { existplayer, convert2integer, Read_player, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?交税[1-9]d*/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let lingshi = e.MessageText.replace(/^(#|＃|\/)?交税/, '');
    lingshi = await convert2integer(lingshi);
    let player = await Read_player(usr_qq);
    if (player.灵石 <= lingshi) {
        Send(Text('醒醒，你没有那么多'));
        return false;
    }
    await Add___(usr_qq, -lingshi);
    Send(Text('成功交税' + lingshi));
});

export { res as default, regular };
