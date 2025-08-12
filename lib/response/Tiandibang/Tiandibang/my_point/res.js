import { useSend, Text, Image } from 'alemonjs';
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
import '../../../../model/danyao.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import '../../../../model/api.js';
import { screenshot } from '../../../../image/index.js';
import 'crypto';
import { readTiandibang, Write_tiandibang } from '../tian.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?天地榜$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tiandibang = [];
    try {
        tiandibang = await readTiandibang();
    }
    catch {
        await Write_tiandibang([]);
    }
    const userIndex = tiandibang.findIndex(p => p.qq == usr_qq);
    if (userIndex === -1) {
        Send(Text('请先报名!'));
        return false;
    }
    const image = await screenshot('immortal_genius', usr_qq, {
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
        Send(Image(image));
        return;
    }
    Send(Text('图片生产失败'));
});

export { res as default, regular };
