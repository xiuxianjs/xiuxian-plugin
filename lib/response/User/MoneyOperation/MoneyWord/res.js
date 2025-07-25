import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
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
