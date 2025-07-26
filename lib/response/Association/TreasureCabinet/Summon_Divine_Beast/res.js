import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
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
import { isNotNull } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?召唤神兽$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = await data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    if (player.宗门.职位 == '宗主') {
        logger.info('通过');
    }
    else {
        Send(Text('只有宗主可以操作'));
        return false;
    }
    let ass = await data.getAssociation(player.宗门.宗门名称);
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

export { res as default, regular };
