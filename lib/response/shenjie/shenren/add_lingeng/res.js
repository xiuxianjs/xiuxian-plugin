import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../api/api.js';
import { existplayer, existNajieThing, readPlayer, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?供奉神石$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let x = await existNajieThing(usr_qq, '神石', '道具');
    if (!x) {
        Send(Text('你没有神石'));
        return false;
    }
    let player = await readPlayer(usr_qq);
    if (player.魔道值 > 0 ||
        (player.灵根.type != '转生' && player.level_id < 42)) {
        Send(Text('你尝试供奉神石,但是失败了'));
        return false;
    }
    player.神石 += x;
    await writePlayer(usr_qq, player);
    Send(Text('供奉成功,当前供奉进度' + player.神石 + '/200'));
    await addNajieThing(usr_qq, '神石', '道具', -x);
});

export { res as default, regular };
