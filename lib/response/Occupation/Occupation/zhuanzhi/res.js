import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
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
import { existplayer, Read_player, isNotNull } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?猎户转.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    if (player.occupation != '猎户') {
        Send(Text('你不是猎户,无法自选职业'));
        return false;
    }
    let occupation = e.MessageText.replace(/^(#|＃|\/)?猎户转/, '');
    let x = data.occupation_list.find(item => item.name == occupation);
    if (!isNotNull(x)) {
        Send(Text(`没有[${occupation}]这项职业`));
        return false;
    }
    player.occupation = occupation;
    await Write_player(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
});

export { res as default, regular };
