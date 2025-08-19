import { useMessage, Text, Image } from 'alemonjs';
import '../../../../model/api.js';
import { selects } from '../../../mw.js';
import { screenshot } from '../../../../image/index.js';
import data from '../../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?禁地$/;
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const image = await screenshot('jindi', e.UserId, {
        didian_list: data.forbiddenarea_list
    });
    if (!image) {
        message.send(format(Text('图片生成失败')));
        return;
    }
    message.send(format(Image(image)));
});

export { res as default, regular };
