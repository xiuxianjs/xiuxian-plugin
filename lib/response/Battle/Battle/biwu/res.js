import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, readPlayer, zd_battle } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^(以武会友)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let A = e.UserId;
    let ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A) {
        return false;
    }
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0) {
        return;
    }
    const User = Mentions.find(item => !item.IsBot);
    if (!User) {
        return;
    }
    let B = User.UserId;
    if (A == B) {
        Send(Text('你还跟自己修炼上了是不是?'));
        return false;
    }
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    let final_msg = [];
    let A_player = await readPlayer(A);
    let B_player = await readPlayer(B);
    final_msg.push(`${A_player.名号}向${B_player.名号}发起了切磋。`);
    A_player.法球倍率 = A_player.灵根.法球倍率;
    B_player.法球倍率 = B_player.灵根.法球倍率;
    A_player.当前血量 = A_player.血量上限;
    B_player.当前血量 = B_player.血量上限;
    let Data_battle = await zd_battle(A_player, B_player);
    let msg = Data_battle.msg;
    Send(Text(msg));
    Send(Text(final_msg.join('')));
});

export { res as default, regular };
