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
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull, shijianc } from '../../../../model/xiuxian.js';
import { isNotMaintenance, getLastsign_Asso } from '../../ass.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)宗门俸禄$/;
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
    let ismt = isNotMaintenance(ass);
    if (ismt) {
        Send(Text(`宗门尚未维护，快找宗主维护宗门`));
        return false;
    }
    let now = new Date();
    let nowTime = now.getTime();
    let Today = await shijianc(nowTime);
    let lastsign_time = await getLastsign_Asso(usr_qq);
    if (Today.Y == lastsign_time.Y &&
        Today.M == lastsign_time.M &&
        Today.D == lastsign_time.D) {
        Send(Text(`今日已经领取过了`));
        return false;
    }
    let temp = player.宗门.职位;
    let n = 1;
    if (temp == '外门弟子') {
        Send(Text('没有资格领取俸禄'));
        return false;
    }
    if (temp == '内门弟子') {
        Send(Text('没有资格领取俸禄'));
        return false;
    }
    if (temp == '长老') {
        n = 3;
    }
    if (temp == '副宗主') {
        n = 4;
    }
    if (temp == '宗主') {
        n = 5;
    }
    let fuli = Number(Math.trunc(ass.宗门建设等级 * 2000));
    let gift_lingshi = Math.trunc(ass.宗门等级 * 1200 * n + fuli);
    gift_lingshi = gift_lingshi / 2;
    if (ass.灵石池 - gift_lingshi < 0) {
        Send(Text(`宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧`));
        return false;
    }
    ass.灵石池 -= gift_lingshi;
    player.灵石 += gift_lingshi;
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':lastsign_Asso_time', nowTime);
    data.setData('player', usr_qq, player);
    data.setAssociation(ass.宗门名称, ass);
    let msg = [`宗门俸禄领取成功,获得了${gift_lingshi}灵石`];
    Send(Text(msg.join('')));
    return false;
});

export { res as default, name, regular, selects };
