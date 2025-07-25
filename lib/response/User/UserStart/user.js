import { useSend, Image } from 'alemonjs';
import '../../../model/Config.js';
import 'fs';
import 'path';
import '../../../model/paths.js';
import '../../../model/XiuxianData.js';
import { existplayer, get_player_img } from '../../../model/xiuxian.js';
import 'dayjs';

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
