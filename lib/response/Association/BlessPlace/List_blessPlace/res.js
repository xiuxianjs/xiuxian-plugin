import { useMessage, Text, Image } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import { selects } from '../../../index.js';
import '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import 'lodash-es';
import '@alemonjs/db';
import 'dayjs';
import puppeteer from '../../../../image/index.js';

const regular = /^(#|＃|\/)?洞天福地列表$/;
var res = onResponse(selects, async (e) => {
    let weizhi = data.bless_list;
    const [message] = useMessage(e);
    const keys = await redis.keys(`${__PATH.association}:*`);
    const File = keys.map(key => key.replace(`${__PATH.association}:`, ''));
    const msg = [];
    for (let i = 0; i < weizhi.length; i++) {
        let ass = '无';
        for (let j of File) {
            let this_name = j;
            let this_ass = await await data.getAssociation(this_name);
            if (this_ass.宗门驻地 == weizhi[i].name) {
                ass = this_ass.宗门名称;
                break;
            }
            else {
                ass = '无';
                continue;
            }
        }
        msg.push({
            name: weizhi[i].name,
            level: weizhi[i].level,
            efficiency: weizhi[i].efficiency * 100,
            ass: ass
        });
    }
    const image = await puppeteer.screenshot('BlessPlace', e.UserId, {
        didian_list: msg
    });
    if (!image) {
        message.send(format(Text('图片生成失败')));
        return;
    }
    message.send(format(Image(image)));
});

export { res as default, regular };
