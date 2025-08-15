import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { Go } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?转换副职$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await readPlayer(usr_qq);
    const actionStr = await redis.get('xiuxian:player:' + usr_qq + ':fuzhi');
    if (!actionStr) {
        Send(Text(`您还没有副职哦`));
        return false;
    }
    const action = JSON.parse(actionStr);
    if (!action || !action.职业名) {
        Send(Text(`您还没有副职哦`));
        return false;
    }
    const a = action.职业名;
    const b = action.职业经验;
    const c = action.职业等级;
    action.职业名 = player.occupation;
    action.职业经验 = player.occupation_exp;
    action.职业等级 = player.occupation_level;
    player.occupation = a;
    player.occupation_exp = b;
    player.occupation_level = c;
    await redis.set('xiuxian:player:' + usr_qq + ':fuzhi', JSON.stringify(action));
    await writePlayer(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`));
});

export { res as default, regular };
