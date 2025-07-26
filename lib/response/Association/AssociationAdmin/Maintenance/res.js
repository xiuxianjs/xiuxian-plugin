import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
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
import { isNotNull, shijianc } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(宗门维护|维护宗门)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = await await data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) {
        return false;
    }
    if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
        Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    let ass = await await data.getAssociation(player.宗门.宗门名称);
    let now = new Date();
    let nowTime = now.getTime();
    let time = config.getConfig('xiuxian', 'xiuxian').CD.association;
    let nextmt_time = await shijianc(ass.维护时间 + 60000 * time);
    if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
        Send(Text(`当前无需维护,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`));
        return false;
    }
    if (ass.灵石池 < ass.宗门等级 * 50000) {
        Send(Text(`目前宗门维护需要${ass.宗门等级 * 50000}灵石,本宗门灵石池储量不足`));
        return false;
    }
    ass.灵石池 -= ass.宗门等级 * 50000;
    ass.维护时间 = nowTime;
    await data.setAssociation(ass.宗门名称, ass);
    nextmt_time = await shijianc(ass.维护时间 + 60000 * time);
    Send(Text(`宗门维护成功,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`));
});

export { res as default, regular };
