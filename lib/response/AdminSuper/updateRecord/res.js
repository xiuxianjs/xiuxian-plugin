import { useSend, Image, Text } from 'alemonjs';
import { screenshot } from '../../../image/index.js';
import '../../../model/api.js';
import { selects } from '../../index.js';
import data from '../../../model/XiuxianData.js';

const regular = /^(#|＃|\/)?更新日志$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const image = await screenshot('updateRecord', e.UserId, {
        Record: data.updateRecord
    });
    if (Buffer.isBuffer(image)) {
        Send(Image(image));
        return;
    }
    Send(Text('更新日志获取失败'));
});

export { res as default, regular };
