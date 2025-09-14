import { useSend, Image, Text } from 'alemonjs';
import { screenshot } from '../../../image/index.js';
import mw, { selects } from '../../mw-captcha.js';
import { getDataList } from '../../../model/DataList.js';

const regular = /^(#|＃|\/)?更新日志$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const data = await getDataList('UpdateRecord');
    const image = await screenshot('updateRecord', e.UserId, {
        Record: data
    });
    if (Buffer.isBuffer(image)) {
        void Send(Image(image));
        return;
    }
    void Send(Text('更新日志获取失败'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
