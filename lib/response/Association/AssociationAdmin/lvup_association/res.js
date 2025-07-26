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
import { isNotNull, playerEfficiency } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?(升级宗门|宗门升级)$/;
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];
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
    if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
        Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    let ass = await data.getAssociation(player.宗门.宗门名称);
    if (ass.宗门等级 == 宗门人数上限.length) {
        Send(Text('已经是最高等级宗门'));
        return false;
    }
    let xian = 1;
    if (ass.power == 1) {
        xian = 10;
    }
    if (ass.灵石池 < ass.宗门等级 * 300000 * xian) {
        Send(Text(`本宗门目前灵石池中仅有${ass.灵石池}灵石,当前宗门升级需要${ass.宗门等级 * 300000 * xian}灵石,数量不足`));
        return false;
    }
    ass.灵石池 -= ass.宗门等级 * 300000 * xian;
    ass.宗门等级 += 1;
    data.setData('player', usr_qq, player);
    data.setAssociation(ass.宗门名称, ass);
    await playerEfficiency(usr_qq);
    Send(Text('宗门升级成功' +
        `当前宗门等级为${ass.宗门等级},宗门人数上限提高到:${宗门人数上限[ass.宗门等级 - 1]}`));
});

export { res as default, regular };
