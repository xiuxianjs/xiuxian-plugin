import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { isNotNull, shijianc, Read_danyao, Write_danyao, Add_najie_thing } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)神兽赐福$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    let ass = data.getAssociation(player.宗门.宗门名称);
    if (ass.宗门神兽 == 0) {
        Send(Text('你的宗门还没有神兽的护佑，快去召唤神兽吧'));
        return false;
    }
    let now = new Date();
    let nowTime = now.getTime();
    let Today = await shijianc(nowTime);
    let lastsign_time = await getLastsign_Bonus(usr_qq);
    if (Today.Y == lastsign_time.Y &&
        Today.M == lastsign_time.M &&
        Today.D == lastsign_time.D) {
        Send(Text(`今日已经接受过神兽赐福了，明天再来吧`));
        return false;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':getLastsign_Bonus', nowTime);
    let random = Math.random();
    let dy = await Read_danyao(usr_qq);
    if (dy.beiyong2 > 0) {
        dy.beiyong2--;
    }
    random += dy.beiyong3;
    if (dy.beiyong2 == 0) {
        dy.beiyong3 = 0;
    }
    await Write_danyao(usr_qq, dy);
    if (random > 0.7) {
        let location;
        let item_name;
        let item_class;
        let randomB = Math.random();
        if (ass.宗门神兽 == '麒麟') {
            if (randomB > 0.9) {
                location = Math.floor(Math.random() * data.qilin.length);
                item_name = data.qilin[location].name;
                item_class = data.qilin[location].class;
            }
            else {
                location = Math.floor(Math.random() * data.danyao_list.length);
                item_name = data.danyao_list[location].name;
                item_class = data.danyao_list[location].class;
            }
            await Add_najie_thing(usr_qq, item_name, item_class, 1);
        }
        else if (ass.宗门神兽 == '青龙') {
            if (randomB > 0.9) {
                location = Math.floor(Math.random() * data.qinlong.length);
                item_name = data.qinlong[location].name;
                item_class = data.qinlong[location].class;
            }
            else {
                location = Math.floor(Math.random() * data.gongfa_list.length);
                item_name = data.gongfa_list[location].name;
                item_class = data.gongfa_list[location].class;
            }
            await Add_najie_thing(usr_qq, item_name, item_class, 1);
        }
        else if (ass.宗门神兽 == '玄武') {
            if (randomB > 0.9) {
                location = Math.floor(Math.random() * data.xuanwu.length);
                item_name = data.xuanwu[location].name;
                item_class = data.xuanwu[location].class;
            }
            else {
                location = Math.floor(Math.random() * data.equipment_list.length);
                item_name = data.equipment_list[location].name;
                item_class = data.equipment_list[location].class;
            }
            await Add_najie_thing(usr_qq, item_name, item_class, 1);
        }
        else if (ass.宗门神兽 == '朱雀') {
            if (randomB > 0.9) {
                location = Math.floor(Math.random() * data.xuanwu.length);
                item_name = data.xuanwu[location].name;
                item_class = data.xuanwu[location].class;
            }
            else {
                location = Math.floor(Math.random() * data.equipment_list.length);
                item_name = data.equipment_list[location].name;
                item_class = data.equipment_list[location].class;
            }
            await Add_najie_thing(usr_qq, item_name, item_class, 1);
        }
        else {
            if (randomB > 0.9) {
                location = Math.floor(Math.random() * data.xuanwu.length);
                item_name = data.xuanwu[location].name;
                item_class = data.xuanwu[location].class;
            }
            else {
                location = Math.floor(Math.random() * data.equipment_list.length);
                item_name = data.equipment_list[location].name;
                item_class = data.equipment_list[location].class;
            }
            await Add_najie_thing(usr_qq, item_name, item_class, 1);
        }
        if (randomB > 0.9) {
            Send(Text(`看见你来了,${ass.宗门神兽}很高兴，仔细挑选了${item_name}给你`));
        }
        else {
            Send(Text(`${ass.宗门神兽}今天心情不错，随手丢给了你${item_name}`));
        }
        return false;
    }
    else {
        Send(Text(`${ass.宗门神兽}闭上了眼睛，表示今天不想理你`));
        return false;
    }
});
async function getLastsign_Bonus(usr_qq) {
    let time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':getLastsign_Bonus');
    if (time != null) {
        let data = await shijianc(parseInt(time));
        return data;
    }
    return false;
}

export { res as default, name, regular, selects };
