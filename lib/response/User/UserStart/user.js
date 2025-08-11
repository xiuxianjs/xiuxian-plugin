import { useSend, Image, Text } from 'alemonjs';
import '../../../model/Config.js';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/xiuxian.yaml.js';
import '../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../model/equipment.js';
import '../../../model/shop.js';
import '../../../model/trade.js';
import '../../../model/qinmidu.js';
import '../../../model/shitu.js';
import '../../../model/danyao.js';
import '../../../model/temp.js';
import 'dayjs';
import '../../../model/api.js';
import { getPlayerImage } from '../../../model/image.js';
import 'crypto';

function isPublic(e) {
    return (!!e && typeof e === 'object' && 'Guild' in e);
}
async function Show_player(e) {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    if (isPublic(e)) {
        try {
            const img = await getPlayerImage(e);
            if (Buffer.isBuffer(img)) {
                Send(Image(img));
                return false;
            }
            Send(Text('图片加载失败'));
            return false;
        }
        catch {
            Send(Text('角色卡生成失败'));
            return false;
        }
    }
    else {
        Send(Text('私聊暂不支持角色卡展示'));
    }
    return false;
}

export { Show_player };
