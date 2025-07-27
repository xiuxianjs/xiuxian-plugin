import { useSend, Text, useMention } from 'alemonjs';
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
import { existplayer, addCoin } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?抢红包$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await await data.getData('player', usr_qq);
    let now_time = new Date().getTime();
    let lastgetbung_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_getbung_time');
    lastgetbung_time = parseInt(lastgetbung_time);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let transferTimeout = Math.floor(cf.CD.honbao * 60000);
    if (now_time < lastgetbung_time + transferTimeout) {
        let waittime_m = Math.trunc((lastgetbung_time + transferTimeout - now_time) / 60 / 1000);
        let waittime_s = Math.trunc(((lastgetbung_time + transferTimeout - now_time) % 60000) / 1000);
        Send(Text(`每${transferTimeout / 1000 / 60}分钟抢一次，正在CD中，` +
            `剩余cd: ${waittime_m}分${waittime_s}秒`));
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
    let honbao_qq = User.UserId;
    let ifexistplay_honbao = await existplayer(honbao_qq);
    if (!ifexistplay_honbao) {
        return false;
    }
    let acount = await redis.get('xiuxian@1.3.0:' + honbao_qq + ':honbaoacount');
    acount = Number(acount);
    if (acount <= 0) {
        Send(Text('他的红包被光啦！'));
        return false;
    }
    const lingshi = await redis.get('xiuxian@1.3.0:' + honbao_qq + ':honbao');
    const addlingshi = Math.trunc(+lingshi);
    acount--;
    await redis.set('xiuxian@1.3.0:' + honbao_qq + ':honbaoacount', acount);
    await addCoin(usr_qq, addlingshi);
    Send(Text('【全服公告】' + player.名号 + '抢到一个' + addlingshi + '灵石的红包！'));
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_getbung_time', now_time);
    return false;
});

export { res as default, regular };
