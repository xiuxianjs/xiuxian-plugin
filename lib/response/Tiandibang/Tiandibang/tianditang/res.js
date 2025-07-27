import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '../../../../api/api.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { readTiandibang, Write_tiandibang, get_tianditang_img } from '../tian.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?天地堂/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tiandibang = [];
    try {
        tiandibang = await readTiandibang();
    }
    catch {
        await Write_tiandibang([]);
    }
    let m = tiandibang.length;
    for (m = 0; m < tiandibang.length; m++) {
        if (tiandibang[m].qq == usr_qq) {
            break;
        }
    }
    if (m == tiandibang.length) {
        Send(Text('请先报名!'));
        return false;
    }
    let img = await get_tianditang_img(e, tiandibang[m].积分);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
