import { useMessage, Text } from 'alemonjs';
import { selects } from '../../../index.js';
import '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import '../../../../model/settions.js';
import Association from '../../../../model/Association.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';

const regular = /^(#|＃|\/)?查看宗门贡献$/;
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const player = await readPlayer(e.UserId);
    if (!player) {
        message.send(format(Text(`玩家不存在`)));
        return;
    }
    if (!player.宗门) {
        message.send(format(Text(`玩家未加入宗门`)));
        return;
    }
    if (!['宗主', '副宗主', '长老'].includes(player.宗门['职位'])) {
        message.send(format(Text(`您没有权限查看宗门贡献`)));
        return;
    }
    const ass = await Association.getAssociation(player.宗门['宗门名称']);
    if (ass === 'error') {
        message.send(format(Text(`宗门不存在`)));
        return;
    }
    const allMembers = ass.所有成员;
    const list = [];
    for (const member of allMembers) {
        const user = await readPlayer(member);
        if (!user) {
            continue;
        }
        const money = user.宗门['lingshi_donate'] ?? 0;
        list.push({
            name: user.名号,
            contribution: Math.trunc(money / 10000)
        });
    }
    list.sort((a, b) => b.contribution - a.contribution);
    const msg = list.map(item => `${item.name} : ${item.contribution}`).join('\n');
    message.send(format(Text('名号     宗门贡献\n' + msg)));
});

export { res as default, regular };
