import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import '@alemonjs/db';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?转职.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag)
        return false;
    if (!(await existplayer(usr_qq)))
        return false;
    const occupation = e.MessageText.replace(/^(#|＃|\/)?转职/, '').trim();
    if (!occupation) {
        Send(Text('格式: 转职职业名'));
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据读取失败'));
        return false;
    }
    const player_occupation = String(player.occupation || '');
    const targetOcc = data.occupation_list.find(o => o.name === occupation);
    if (!notUndAndNull(targetOcc)) {
        Send(Text(`没有[${occupation}]这项职业`));
        return false;
    }
    const levelRow = data.Level_list.find(item => item.level_id == player.level_id);
    const now_level_id = levelRow ? levelRow.level_id : 0;
    if (now_level_id < 17 && occupation === '采矿师') {
        Send(Text('包工头:就你这小身板还来挖矿？再去修炼几年吧'));
        return false;
    }
    const thing_name = occupation + '转职凭证';
    const thing_class = '道具';
    const thing_quantity = await existNajieThing(usr_qq, thing_name, thing_class);
    if (!thing_quantity || thing_quantity <= 0) {
        Send(Text(`你没有【${thing_name}】`));
        return false;
    }
    if (player_occupation === occupation) {
        Send(Text(`你已经是[${player_occupation}]了，可使用[职业转化凭证]重新转职`));
        return false;
    }
    await addNajieThing(usr_qq, thing_name, thing_class, -1);
    if (!player_occupation || player_occupation.length === 0) {
        player.occupation = occupation;
        player.occupation_level = 1;
        player.occupation_exp = 0;
        await writePlayer(usr_qq, player);
        Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
        return false;
    }
    const fuzhi = {
        职业名: player_occupation,
        职业经验: Number(player.occupation_exp) || 0,
        职业等级: Number(player.occupation_level) || 1
    };
    await redis.set(`xiuxian:player:${usr_qq}:fuzhi`, JSON.stringify(fuzhi));
    player.occupation = occupation;
    player.occupation_level = 1;
    player.occupation_exp = 0;
    await writePlayer(usr_qq, player);
    Send(Text(`恭喜${player.名号}转职为[${occupation}], 你的副职为${fuzhi.职业名}`));
    return false;
});

export { res as default, regular };
