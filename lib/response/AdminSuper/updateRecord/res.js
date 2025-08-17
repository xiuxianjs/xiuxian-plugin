import { useSend, Image, Text } from 'alemonjs';
import { screenshot } from '../../../image/index.js';
import { selects } from '../../index.js';
import { getDataList } from '../../../model/DataList.js';

const regular = /^(#|＃|\/)?更新日志$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const data = await getDataList('UpdateRecord');
    const image = await screenshot('updateRecord', e.UserId, {
        Record: data
    });
    if (Buffer.isBuffer(image)) {
        Send(Image(image));
        return;
    }
    Send(Text('更新日志获取失败'));
});

export { res as default, regular };
