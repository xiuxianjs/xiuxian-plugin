import { useSend, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import { screenshot } from '../../../../image/index.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { readTiandibang, writeTiandibang } from '../../../../model/tian.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?天地榜$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    let tiandibang = [];
    try {
        tiandibang = await readTiandibang();
    }
    catch {
        await writeTiandibang([]);
    }
    const userIndex = tiandibang.findIndex(p => p.qq === userId);
    if (userIndex === -1) {
        void Send(Text('请先报名!'));
        return false;
    }
    const image = await screenshot('immortal_genius', userId, {
        allplayer: tiandibang
            .sort((a, b) => b.积分 - a.积分)
            .slice(0, 10)
            .map(item => {
            return {
                power: item.积分,
                qq: item.qq,
                name: item.name
            };
        }),
        title: '天地榜(每日免费三次)',
        label: '积分'
    });
    if (Buffer.isBuffer(image)) {
        void Send(Image(image));
        return;
    }
    void Send(Text('图片生产失败'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
