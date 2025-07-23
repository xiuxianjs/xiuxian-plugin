import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull } from '../../../../model/xiuxian.js';
import 'dayjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)建设宗门$/;
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
    if (ass.宗门驻地 == 0) {
        Send(Text(`你的宗门还没有驻地，无法建设宗门`));
        return false;
    }
    let denji = Number(ass.宗门建设等级);
    if (denji < 0) {
        ass.宗门建设等级 = 0;
        denji = 0;
    }
    if (ass.灵石池 < 0) {
        ass.灵石池 = 0;
    }
    let lsckc = Math.trunc(denji * 10000);
    if (ass.灵石池 < lsckc) {
        Send(Text(`宗门灵石池不足，还需[` + lsckc + ']灵石'));
    }
    else {
        ass.灵石池 -= lsckc;
        let add = Math.trunc(player.level_id / 7) + 1;
        ass.宗门建设等级 += add;
        await data.setAssociation(ass.宗门名称, ass);
        Send(Text(`成功消耗 宗门${lsckc}灵石 建设宗门，增加了${add}点建设度,当前宗门建设等级为${ass.宗门建设等级}`));
    }
});

export { res as default, regular, selects };
