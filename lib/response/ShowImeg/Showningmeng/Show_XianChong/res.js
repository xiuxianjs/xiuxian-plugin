import { useSend, Text, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getXianChongImage } from '../../../../model/image.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import { redis } from '../../../../model/api.js';
import 'crypto';

const regular = /^(#|＃|\/)?仙宠楼$/;
const CD_MS = 10 * 1000;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const cdKey = `xiuxian@1.3.0:${usr_qq}:petShowCD`;
    const now = Date.now();
    const last = toInt(await redis.get(cdKey));
    if (now < last + CD_MS) {
        Send(Text(`查看过于频繁，请${Math.ceil((last + CD_MS - now) / 1000)}秒后再试`));
        return false;
    }
    await redis.set(cdKey, String(now));
    const evt = e;
    const img = await getXianChongImage(evt);
    if (!img) {
        Send(Text('生成图片失败，请稍后再试'));
        return false;
    }
    const buffer = Buffer.isBuffer(img) ? img : Buffer.from(img);
    Send(Image(buffer));
    return false;
});

export { res as default, regular };
