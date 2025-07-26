import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import '../../../../model/Config.js';
import { readIt, alluser } from '../../../../model/duanzaofu.js';
import { readNajie, readEquipment } from '../../../../model/xiuxian.js';
import { writeIt } from '../../../../model/pub.js';
import 'dayjs';
import { selects } from '../../../index.js';
import data from '../../../../model/XiuxianData.js';
import puppeteer from '../../../../image/index.js';

const regular = /^(#|＃|\/)?神兵榜/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let wupin = [];
    try {
        wupin = await readIt();
    }
    catch {
        await writeIt([]);
    }
    let newwupin = [];
    const type = ['武器', '护具', '法宝'];
    const nowTime = Date.now();
    if (!(await redis.exists('xiuxian:bestfileCD')) ||
        +(await redis.get('xiuxian:bestfileCD')) - nowTime > 30 * 60 * 1000) {
        await redis.set('xiuxian:bestfileCD', nowTime);
        let all = await alluser();
        for (let [wpId, j] of wupin.entries()) {
            for (let i of all) {
                let najie = await readNajie(i);
                const equ = await readEquipment(i);
                let exist = najie.装备.find(item => item.name == j.name);
                for (let m of type) {
                    if (equ[m].name == j.name) {
                        exist = 1;
                        break;
                    }
                }
                let D = '无门无派';
                let author = '神秘匠师';
                if (exist) {
                    if (j.author_name) {
                        const player = await await data.getData('player', j.author_name);
                        author = player.名号;
                    }
                    const usr_player = await await data.getData('player', i);
                    wupin[wpId].owner_name = i;
                    if (usr_player.宗门)
                        D = usr_player.宗门.宗门名称;
                    newwupin.push({
                        name: j.name,
                        type: j.type,
                        评分: Math.trunc((j.atk * 1.2 + j.def * 1.5 + j.HP * 1.5) * 10000),
                        制作者: author,
                        使用者: usr_player.名号 + '(' + D + ')'
                    });
                    break;
                }
            }
        }
        await writeIt(wupin);
    }
    else {
        for (const wp of wupin) {
            let D = '无门无派';
            let author = '神秘匠师';
            if (wp.author_name) {
                const player = await await data.getData('player', wp.author_name);
                author = player.名号;
            }
            const usr_player = await await data.getData('player', wp.owner_name);
            if (usr_player.宗门)
                D = usr_player.宗门.宗门名称;
            newwupin.push({
                name: wp.name,
                type: wp.type,
                评分: Math.trunc((wp.atk * 1.2 + wp.def * 1.5 + wp.HP * 1.5) * 10000),
                制作者: author,
                使用者: usr_player.名号 + '(' + D + ')'
            });
        }
    }
    newwupin.sort(function (a, b) {
        return b.评分 - a.评分;
    });
    if (newwupin[20] && newwupin[0].评分 == newwupin[20].评分) {
        let num = Math.floor((newwupin.length - 20) * Math.random());
        newwupin = newwupin.slice(num, num + 20);
    }
    else {
        newwupin = newwupin.slice(0, 20);
    }
    let bd_date = { newwupin };
    const tu = await puppeteer.screenshot('shenbing', e.UserId, bd_date);
    Send(Text(tu));
});

export { res as default, regular };
