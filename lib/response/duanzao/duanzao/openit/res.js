import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import { looktripod, readTripod, writeDuanlu, readThat, readAll, getxuanze, restraint, mainyuansu } from '../../../../model/duanzaofu.js';
import { existplayer, addNajieThing, addExp4 } from '../../../../model/xiuxian.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'dayjs';
import { selects } from '../../../index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?开炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A != 1) {
        Send(Text(`请先去#炼器师能力评测,再来锻造吧`));
        return false;
    }
    let newtripod = [];
    const player = await await data.getData('player', user_qq);
    if (player.occupation != '炼器师') {
        Send(Text(`切换到炼器师后再来吧,宝贝`));
        return false;
    }
    try {
        newtripod = await readTripod();
    }
    catch {
        await writeDuanlu([]);
    }
    for (let item of newtripod) {
        if (user_qq == item.qq) {
            if (item.TIME == 0) {
                Send(Text(`煅炉里面空空如也,也许自己还没有启动它`));
                return false;
            }
            let xishu = 1;
            const newtime = Date.now() - item.TIME;
            if (newtime < 1000 * 60 * 30) {
                Send(Text(`炼制时间过短,无法获得装备,再等等吧`));
                return false;
            }
            let action = await redis.get('xiuxian@1.3.0:' + user_qq + ':action10');
            action = JSON.parse(action);
            let cailiao;
            let jiuwei = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let newitem in item.材料) {
                cailiao = await readThat(item.材料[newitem], '锻造材料');
                jiuwei[0] += cailiao.攻 * item.数量[newitem];
                jiuwei[1] += cailiao.防 * item.数量[newitem];
                jiuwei[2] += cailiao.血 * item.数量[newitem];
                jiuwei[3] += cailiao.暴 * item.数量[newitem];
                jiuwei[4] += cailiao.金 * item.数量[newitem];
                jiuwei[5] += cailiao.木 * item.数量[newitem];
                jiuwei[6] += cailiao.土 * item.数量[newitem];
                jiuwei[7] += cailiao.水 * item.数量[newitem];
                jiuwei[8] += cailiao.火 * item.数量[newitem];
            }
            let newrandom = Math.random();
            let xuanze = ['锻造武器', '锻造护具', '锻造宝物'];
            let weizhi;
            let wehizhi1;
            if (jiuwei[0] > jiuwei[1] * 2) {
                weizhi = xuanze[0];
                wehizhi1 = '武器';
            }
            else if (jiuwei[0] * 2 < jiuwei[1]) {
                weizhi = xuanze[1];
                wehizhi1 = '护具';
            }
            else if (newrandom > 0.8) {
                weizhi = xuanze[2];
                wehizhi1 = '法宝';
            }
            else if (jiuwei[0] > jiuwei[1]) {
                weizhi = xuanze[0];
                wehizhi1 = '武器';
            }
            else {
                weizhi = xuanze[1];
                wehizhi1 = '护具';
            }
            const newwupin = await readAll(weizhi);
            let bizhi = [];
            for (let item2 in newwupin) {
                bizhi[item2] = Math.abs(newwupin[item2].atk -
                    jiuwei[0] +
                    newwupin[item2].def -
                    jiuwei[1] +
                    newwupin[item2].HP -
                    jiuwei[2]);
            }
            let min = bizhi[0];
            let new1;
            for (let item3 in bizhi) {
                if (min >= bizhi[item3]) {
                    min = bizhi[item3];
                    new1 = item3;
                }
            }
            const wuqiname = newwupin[new1].name;
            const num = jiuwei[0] + jiuwei[1] + jiuwei[2];
            const overtime = (80 * num + 10) * 1000 * 60;
            const nowtime = Math.abs((overtime - newtime) / 1000 / 60);
            if (nowtime < 2) {
                xishu += 0.1;
            }
            else if (nowtime > 8) {
                xishu -= 0.1;
            }
            else if (nowtime > 12) {
                xishu -= 0.2;
            }
            else {
                xishu -= 0.25;
            }
            let houzhui;
            let i;
            let qianzhui = 0;
            const wuwei = [jiuwei[4], jiuwei[5], jiuwei[6], jiuwei[7], jiuwei[8]];
            const wuxing = ['金', '木', '土', '水', '火'];
            let max = wuwei[0];
            let shuzu = [wuwei[0]];
            for (i = 0; i < wuwei.length; i++) {
                if (max < wuwei[i]) {
                    max = wuwei[i];
                    shuzu = [wuxing[i]];
                }
                else if (max == wuwei[i]) {
                    shuzu.push(wuxing[i]);
                }
                if (wuwei[i] != 0) {
                    qianzhui++;
                }
            }
            max = await getxuanze(shuzu, player.隐藏灵根.type);
            let fangyuxuejian = 0;
            if (qianzhui == 5) {
                houzhui = '五行杂灵';
                xishu += 0.1;
            }
            else if (qianzhui == 4) {
                houzhui = '四圣显化';
                xishu += 0.07;
            }
            else if (qianzhui == 3) {
                houzhui = '三灵共堂';
                xishu += 0.05;
            }
            else if (qianzhui == 2) {
                const shuzufu = await restraint(wuwei, max[0]);
                houzhui = shuzufu[0];
                xishu += shuzufu[1];
                if (shuzufu[1] == 0.5) {
                    fangyuxuejian = 0.5;
                }
            }
            else if (qianzhui == 1) {
                const mu = await mainyuansu(wuwei);
                houzhui = '纯' + mu;
                xishu += 0.15;
            }
            const newtime1 = Date.now() - Math.floor(Date.now() / 1000) * 1000;
            const sum = jiuwei[0] + jiuwei[1] + jiuwei[2];
            const zhuangbei = {
                id: max[1],
                name: wuqiname + '·' + houzhui + newtime1,
                class: '装备',
                type: wehizhi1,
                atk: Math.floor(jiuwei[0] * xishu * 1000) / 1000,
                def: Math.floor(jiuwei[1] * (xishu - fangyuxuejian) * 1000) / 1000,
                HP: Math.floor(jiuwei[2] * xishu * 1000) / 1000,
                bao: Math.floor(jiuwei[3] * 1000) / 1000,
                author_name: player.id,
                出售价: Math.floor(1000000 * sum)
            };
            await addNajieThing(user_qq, zhuangbei, '装备', 1);
            let v = player.隐藏灵根.控器 / (Math.abs(max[1] - player.隐藏灵根.type) + 5);
            let k = ((player.锻造天赋 + 100) * v) / 200 + 1;
            let z = Math.floor(sum * 1000 * 0.7 * k + 200);
            if (sum >= 0.9) {
                z += 2000;
            }
            else if (sum >= 0.7) {
                z += 1000;
            }
            if (player.仙宠.type == '炼器') {
                z = Math.floor(z * (1 + (player.仙宠.等级 / 25) * 0.1));
            }
            addExp4(user_qq, z);
            item.状态 = 0;
            item.TIME = 0;
            item.材料 = [];
            item.数量 = [];
            await writeDuanlu(newtripod);
            const time = new Date().getTime();
            await redis.set('xiuxian@1.3.0:' + user_qq + ':action10', JSON.stringify(time));
            Send(Text(`恭喜你获得了[${wuqiname}·${houzhui}],炼器经验增加了[${z}]`));
            return false;
        }
    }
});

export { res as default, regular };
