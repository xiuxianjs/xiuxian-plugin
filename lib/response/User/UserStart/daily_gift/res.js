import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, shijianc, getLastsign, addNajieThing, Add_修为 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?修仙签到$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let now = new Date();
    let nowTime = now.getTime();
    let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000);
    let Today = await shijianc(nowTime);
    let lastsign_time = await getLastsign(usr_qq);
    if (Today.Y == lastsign_time.Y &&
        Today.M == lastsign_time.M &&
        Today.D == lastsign_time.D) {
        Send(Text(`今日已经签到过了`));
        return false;
    }
    let Sign_Yesterday;
    if (Yesterday.Y == lastsign_time.Y &&
        Yesterday.M == lastsign_time.M &&
        Yesterday.D == lastsign_time.D) {
        Sign_Yesterday = true;
    }
    else {
        Sign_Yesterday = false;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastsign_time', nowTime);
    let player = await await data.getData('player', usr_qq);
    if (player.连续签到天数 == 7 || !Sign_Yesterday) {
        player.连续签到天数 = 0;
    }
    player.连续签到天数 += 1;
    data.setData('player', usr_qq, player);
    let gift_xiuwei = player.连续签到天数 * 3000;
    const cf = config.getConfig('xiuxian', 'xiuxian');
    await addNajieThing(usr_qq, '秘境之匙', '道具', cf.Sign.ticket);
    await Add___(usr_qq, gift_xiuwei);
    let msg = `已经连续签到${player.连续签到天数}天了，获得了${gift_xiuwei}修为,秘境之匙x${cf.Sign.ticket}`;
    Send(Text(msg));
});

export { res as default, regular };
