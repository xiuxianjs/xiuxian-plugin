import { useMessage, Text, Image } from 'alemonjs';
import '../../../../api/api.js';
import { selects } from '../../../index.js';
import puppeteer from '../../../../image/index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?禁地$/;
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const image = await puppeteer.screenshot('jindi', e.UserId, {
        didian_list: data.forbiddenarea_list
    });
    if (!image) {
        message.send(format(Text('图片生成失败')));
        return;
    }
    message.send(format(Image(image)));
});

export { res as default, regular };
