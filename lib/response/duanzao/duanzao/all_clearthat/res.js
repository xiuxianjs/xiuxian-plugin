import { useSend, Text } from 'alemonjs';
import fs from 'fs';
import { createEventName } from '../../../util.js';
import { redis } from '../../../../api/api.js';
import 'yaml';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import { Write_duanlu } from '../../../../model/duanzaofu.js';
import 'path';
import '../../../../model/XiuxianData.js';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state/state.jpg.js';
import '../../../../resources/img/state/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player/player.jpg.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/danfang/danfang.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/font/NZBZ.ttf.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment_pifu/0.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/fairyrealm/fairyrealm.jpg.js';
import '../../../../resources/img/fairyrealm/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/forbidden_area/forbidden_area.jpg.js';
import '../../../../resources/img/forbidden_area/card.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/img/supermarket/supermarket.jpg.js';
import '../../../../resources/html/state/state.css.js';
import '../../../../resources/html/help/common.css.js';
import '../../../../resources/html/help/help.css.js';
import '../../../../resources/img/help/xiuxian.jpg.js';
import '../../../../resources/img/help/icon.png.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/img/ningmenghome/ningmenghome.jpg.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/img/player_pifu/0.jpg.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/img/player/user_state.png.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/img/secret_place/secret_place.jpg.js';
import '../../../../resources/img/secret_place/card.jpg.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/font/华文中宋x.ttf.js';
import '../../../../resources/font/HYWH-85W.ttf.js';
import '../../../../resources/font/HYWH-65W.ttf.js';
import '../../../../resources/img/help/shituhelp.jpg.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/img/talent/talent.jpg.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/img/time_place/time_place.jpg.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/img/tuzhi/tuzhi.jpg.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables/valuables-top.jpg.js';
import '../../../../resources/img/valuables/valuables-danyao.jpg.js';
import '../../../../model/paths.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)全体清空锻炉/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    await Write_duanlu([]);
    let playerList = [];
    let files = fs
        .readdirSync('./resources/data/xiuxian_player')
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    for (let player_id of playerList) {
        let action = null;
        await redis.set('xiuxian@1.3.0:' + player_id + ':action10', JSON.stringify(action));
    }
    Send(Text('清除完成'));
});

export { res as default, name, regular, selects };
