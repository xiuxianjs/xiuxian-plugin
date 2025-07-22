import { useSend, Image } from 'alemonjs';
import 'yaml';
import 'fs';
import '../../../config/help/Association.yaml.js';
import '../../../config/help/help.yaml.js';
import '../../../config/help/helpcopy.yaml.js';
import '../../../config/help/set.yaml.js';
import '../../../config/help/shituhelp.yaml.js';
import '../../../config/parameter/namelist.yaml.js';
import '../../../config/task/task.yaml.js';
import '../../../config/version/version.yaml.js';
import '../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../model/paths.js';
import '../../../model/XiuxianData.js';
import { existplayer, get_player_img } from '../../../model/xiuxian.js';

async function Show_player(e) {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let img = await get_player_img(e);
    if (img)
        Send(Image(img));
    return false;
}

export { Show_player };
