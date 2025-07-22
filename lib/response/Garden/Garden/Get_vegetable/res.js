import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull, Add_najie_thing } from '../../../../model/xiuxian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)拔苗助长.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门))
        return false;
    let ass = data.getAssociation(player.宗门.宗门名称);
    if (!isNotNull(player.宗门)) {
        return false;
    }
    else if (ass.药园.药园等级 == 1) {
        Send(Text('药园等级太低，可远观不可亵玩焉'));
        return false;
    }
    let now = new Date();
    let nowTime = now.getTime();
    let last_garden_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_garden_time');
    last_garden_time = parseInt(last_garden_time);
    let time = config.getConfig('xiuxian', 'xiuxian').CD.garden;
    let transferTimeout = Math.floor(60000 * time);
    if (nowTime < last_garden_time + transferTimeout) {
        let waittime_m = Math.trunc((last_garden_time + transferTimeout - nowTime) / 60 / 1000);
        let waittime_s = Math.trunc(((last_garden_time + transferTimeout - nowTime) % 60000) / 1000);
        Send(Text(`每${transferTimeout / 1000 / 60}分钟拔苗一次。` +
            `cd: ${waittime_m}分${waittime_s}秒`));
        return false;
    }
    let vegetable = ass.药园.作物;
    let vagetable_name = e.MessageText.replace('#拔苗助长', '');
    for (let i = 0; i < vegetable.length; i++) {
        if (vegetable[i].name == vagetable_name) {
            let ts = vegetable[i].ts;
            let nowTime = new Date().getTime();
            let vegetable_Oldtime = await redis.get('xiuxian:' + ass.宗门名称 + vagetable_name);
            if (nowTime + 1000 * 60 * 30 < +vegetable_Oldtime) {
                Send(Text(`作物${vagetable_name}增加1800000成熟度,还需要${+vegetable_Oldtime - nowTime - 1000 * 60 * 30}成熟度`));
                vegetable_Oldtime -= 1000 * 60 * 30;
                await redis.set('xiuxian:' + ass.宗门名称 + vagetable_name, vegetable_Oldtime);
                await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_garden_time', nowTime);
                return false;
            }
            else {
                Send(Text(`作物${vagetable_name}已成熟，被${usr_qq}${player.名号}摘取,放入纳戒了`));
                await Add_najie_thing(usr_qq, vagetable_name, '草药', 1);
                let vegetable_OutTime = nowTime + 1000 * 60 * 60 * 24 * ts;
                ass.药园.作物[i].start_time = nowTime;
                await data.setAssociation(ass.宗门名称, ass);
                await redis.set('xiuxian:' + ass.宗门名称 + vagetable_name, vegetable_OutTime);
                await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_garden_time', nowTime);
                return false;
            }
        }
    }
    Send(Text('您拔错了吧！掣电树chedianshu'));
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_garden_time', nowTime);
});

export { res as default, regular, selects };
