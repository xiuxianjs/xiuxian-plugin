import { useSend, Image } from 'alemonjs';
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
import Game from '../../../../model/show.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull } from '../../../../model/xiuxian.js';
import puppeteer from '../../../../image/index.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)金银坊记录$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let qq = e.UserId;
    let player_data = data.getData('player', qq);
    let victory = isNotNull(player_data.金银坊胜场) ? player_data.金银坊胜场 : 0;
    let victory_num = isNotNull(player_data.金银坊收入)
        ? player_data.金银坊收入
        : 0;
    let defeated = isNotNull(player_data.金银坊败场) ? player_data.金银坊败场 : 0;
    let defeated_num = isNotNull(player_data.金银坊支出)
        ? player_data.金银坊支出
        : 0;
    if (parseInt(victory) + parseInt(defeated) == 0) ;
    else {
        ((victory / (victory + defeated)) * 100).toFixed(2);
    }
    const data1 = await new Game().get_jinyin({
        user_qq: qq,
        victory,
        victory_num,
        defeated,
        defeated_num
    });
    let img = await puppeteer.screenshot('moneyCheck', e.UserId, { ...data1 });
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
