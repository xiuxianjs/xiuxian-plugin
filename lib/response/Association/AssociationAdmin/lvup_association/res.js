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
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull, player_efficiency } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)(升级宗门|宗门升级)$/;
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];
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
    if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
        Send(Text('只有宗主、副宗主可以操作'));
        return false;
    }
    let ass = data.getAssociation(player.宗门.宗门名称);
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
    await player_efficiency(usr_qq);
    Send(Text('宗门升级成功' +
        `当前宗门等级为${ass.宗门等级},宗门人数上限提高到:${宗门人数上限[ass.宗门等级 - 1]}`));
});

export { res as default, name, regular, selects };
