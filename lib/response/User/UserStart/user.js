import { useSend, Image } from 'alemonjs';
import '../../../model/Config.js';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/namelist.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/version.yaml.js';
import '../../../config/xiuxian.yaml.js';
import '../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../model/xiuxian.js';
import 'dayjs';
import { getPlayerImage } from '../../../model/image.js';

async function Show_player(e) {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let img = await getPlayerImage(e);
    if (img)
        Send(Image(img));
    return false;
}

export { Show_player };
