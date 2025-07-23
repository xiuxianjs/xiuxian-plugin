import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, Go } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|\/)再入仙途$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        Send(Text('没存档你转世个锤子!'));
        return false;
    }
    else {
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1);
    }
    let acount = await redis.get('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount');
    if (acount == undefined || acount == null || isNaN(acount) || acount <= 0) {
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1);
    }
    let player = await data.getData('player', usr_qq);
    if (player.灵石 <= 0) {
        Send(Text(`负债无法再入仙途`));
        return false;
    }
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let now = new Date();
    let nowTime = now.getTime();
    let lastrestart_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_reCreate_time');
    lastrestart_time = parseInt(lastrestart_time);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.reborn;
    let rebornTime = Math.floor(60000 * time);
    if (nowTime < lastrestart_time + rebornTime) {
        let waittime_m = Math.trunc((lastrestart_time + rebornTime - nowTime) / 60 / 1000);
        let waittime_s = Math.trunc(((lastrestart_time + rebornTime - nowTime) % 60000) / 1000);
        Send(Text(`每${rebornTime / 60 / 1000}分钟只能转世一次` +
            `剩余cd:${waittime_m}分 ${waittime_s}秒`));
        return false;
    }
    await Send(Text('一旦转世一切当世与你无缘,你真的要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择'));
});

export { res as default, regular };
