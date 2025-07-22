import { useSend, Image } from 'alemonjs';
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
import Game from '../../../../model/show.js';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { isNotNull } from '../../../../model/xiuxian.js';
import puppeteer from '../../../../image/index.js';

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

export { res as default, regular, selects };
