import { useSend, useMention, Text } from 'alemonjs';
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
import '../../../../model/XiuxianData.js';
import { existplayer, find_qinmidu, exist_hunyin, fstadd_qinmidu, Add_修为 as Add___, add_qinmidu } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^双修$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let gameswitch = cf.switch.couple;
    if (gameswitch != true) {
        return false;
    }
    let A = e.UserId;
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
        Send(Text('你咋这么爱撸自己呢?'));
        return false;
    }
    let Time = cf.CD.couple;
    let shuangxiuTimeout = Math.floor(60000 * Time);
    let now_Time = new Date().getTime();
    let last_timeA = await redis.get('xiuxian@1.3.0:' + A + ':last_shuangxiu_time');
    last_timeA = Math.floor(last_timeA);
    if (now_Time < last_timeA + shuangxiuTimeout) {
        let Couple_m = Math.trunc((last_timeA + shuangxiuTimeout - now_Time) / 60 / 1000);
        let Couple_s = Math.trunc(((last_timeA + shuangxiuTimeout - now_Time) % 60000) / 1000);
        Send(Text(`双修冷却:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    let last_timeB = await redis.get('xiuxian@1.3.0:' + B + ':last_shuangxiu_time');
    last_timeB = Math.floor(last_timeB);
    if (now_Time < last_timeB + shuangxiuTimeout) {
        let Couple_m = Math.trunc((last_timeB + shuangxiuTimeout - now_Time) / 60 / 1000);
        let Couple_s = Math.trunc(((last_timeB + shuangxiuTimeout - now_Time) % 60000) / 1000);
        Send(Text(`对方双修冷却:  ${Couple_m}分 ${Couple_s}秒`));
        return false;
    }
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    let couple = await redis.get('xiuxian@1.3.0:' + B + ':couple');
    if (+couple != 0) {
        Send(Text('哎哟，你干嘛...'));
        return false;
    }
    let pd = await find_qinmidu(A, B);
    let hunyin_B = await exist_hunyin(A);
    let hunyin_A = await exist_hunyin(B);
    if (hunyin_B != '' || hunyin_A != '') {
        if (hunyin_A != A || hunyin_B != B) {
            Send(Text(`力争纯爱！禁止贴贴！！`));
            return false;
        }
    }
    else if (pd == false) {
        await fstadd_qinmidu(A, B);
    }
    await redis.set('xiuxian@1.3.0:' + A + ':last_shuangxiu_time', now_Time);
    await redis.set('xiuxian@1.3.0:' + B + ':last_shuangxiu_time', now_Time);
    if (A != B) {
        let option = Math.random();
        let xiuwei = Math.random();
        let x = 0;
        let y = 0;
        if (option > 0 && option <= 0.5) {
            x = 28000;
            y = Math.trunc(xiuwei * x);
            await Add___(A, Math.floor(y));
            await Add___(B, Math.floor(y));
            await add_qinmidu(A, B, 30);
            Send(Text('你们双方情意相通，缠绵一晚，都增加了' +
                Math.floor(y) +
                '修为,亲密度增加了30点'));
            return false;
        }
        else if (option > 0.5 && option <= 0.6) {
            x = 21000;
            y = Math.trunc(xiuwei * x);
            await Add___(A, Math.floor(y));
            await Add___(B, Math.floor(y));
            await add_qinmidu(A, B, 20);
            Send(Text('你们双方交心交神，努力修炼，都增加了' +
                Math.floor(y) +
                '修为,亲密度增加了20点'));
        }
        else if (option > 0.6 && option <= 0.7) {
            x = 14000;
            y = Math.trunc(xiuwei * x);
            await Add___(A, Math.floor(y));
            await Add___(B, Math.floor(y));
            await add_qinmidu(A, B, 15);
            Send(Text('你们双方共同修炼，过程平稳，都增加了' +
                Math.floor(y) +
                '修为,亲密度增加了15点'));
        }
        else if (option > 0.7 && option <= 0.9) {
            x = 520;
            y = Math.trunc(1 * x);
            await Add___(A, Math.floor(y));
            await Add___(B, Math.floor(y));
            await add_qinmidu(A, B, 10);
            Send(Text('你们双方努力修炼，但是并进不了状态，都增加了' +
                Math.floor(y) +
                '修为,亲密度增加了10点'));
        }
        else {
            Send(Text('你们双修时心神合一，但是不知道哪来的小孩，惊断了状态'));
        }
        return false;
    }
});

export { res as default, regular };
