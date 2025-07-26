import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import { existplayer, readPlayer, isNotNull } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?猎户转.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await readPlayer(usr_qq);
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
    await writePlayer(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
});

export { res as default, regular };
