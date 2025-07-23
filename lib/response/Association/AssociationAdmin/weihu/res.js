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
import { isNotNull, convert2integer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|\/)维护护宗大阵.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    let player = data.getData('player', usr_qq);
    if (player.宗门.职位 == '宗主' ||
        player.宗门.职位 == '副宗主' ||
        player.宗门.职位 == '长老') ;
    else {
        Send(Text('只有宗主、副宗主或长老可以操作'));
        return false;
    }
    if (!isNotNull(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    let reg = new RegExp(/#维护护宗大阵/);
    let msg = e.MessageText.replace(reg, '');
    const lingshi = await convert2integer(msg);
    let ass = data.getAssociation(player.宗门.宗门名称);
    if (ass.灵石池 < lingshi) {
        Send(Text(`宗门灵石池只有${ass.灵石池}灵石,数量不足`));
        return false;
    }
    let xian = 5;
    if (ass.power == 1) {
        xian = 2;
    }
    ass.大阵血量 += lingshi * xian;
    ass.灵石池 -= lingshi;
    await data.setAssociation(ass.宗门名称, ass);
    Send(Text(`维护成功,宗门还有${ass.灵石池}灵石,护宗大阵增加了${lingshi * xian}血量`));
});

export { res as default, regular };
