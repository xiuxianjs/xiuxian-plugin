import { useSend, Text, Image } from 'alemonjs';
import puppeteer from '../../../image/index.js';
import '../../../api/api.js';
import { selects } from '../../index.js';
import data from '../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?更新日志$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const image = await puppeteer.screenshot('updateRecord', e.UserId, {
        Record: data.updateRecord
    });
    if (!image) {
        Send(Text('更新日志获取失败'));
        return false;
    }
    Send(Image(image));
});

export { res as default, regular };
