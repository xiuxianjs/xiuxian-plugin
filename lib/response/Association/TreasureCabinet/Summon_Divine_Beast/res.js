import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
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
import { isNotNull } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)召唤神兽$/;
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
    if (player.宗门.职位 == '宗主') {
        console.log('通过');
    }
    else {
        Send(Text('只有宗主可以操作'));
        return false;
    }
    let ass = data.getAssociation(player.宗门.宗门名称);
    if (ass.宗门等级 < 8) {
        Send(Text(`宗门等级不足，尚不具备召唤神兽的资格`));
        return false;
    }
    if (ass.宗门建设等级 < 50) {
        Send(Text(`宗门建设等级不足,木头墙木头地板的不怕神兽把宗门拆了？`));
        return false;
    }
    if (ass.宗门驻地 == 0) {
        Send(Text(`驻地都没有，让神兽跟你流浪啊？`));
        return false;
    }
    if (ass.灵石池 < 2000000) {
        Send(Text(`宗门就这点钱，还想神兽跟着你干活？`));
        return false;
    }
    if (ass.宗门神兽 != 0) {
        Send(Text(`你的宗门已经有神兽了`));
        return false;
    }
    let random = Math.random();
    if (random > 0.8) {
        ass.宗门神兽 = '麒麟';
    }
    else if (random > 0.6) {
        ass.宗门神兽 = '青龙';
    }
    else if (random > 0.4) {
        ass.宗门神兽 = '玄武';
    }
    else if (random > 0.2) {
        ass.宗门神兽 = '朱雀';
    }
    else {
        ass.宗门神兽 = '白虎';
    }
    ass.灵石池 -= 2000000;
    await data.setAssociation(ass.宗门名称, ass);
    Send(Text(`召唤成功，神兽${ass.宗门神兽}投下一道分身，开始守护你的宗门，绑定神兽后不可更换哦`));
    return false;
});

export { res as default, name, regular, selects };
