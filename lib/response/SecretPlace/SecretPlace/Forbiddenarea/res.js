import { useMessage, Text, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { screenshot } from '../../../../image/index.js';
import { getDataList } from '../../../../model/DataList.js';

const regular = /^(#|＃|\/)?禁地$/;
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const image = await screenshot('jindi', e.UserId, {
        didian_list: await getDataList('ForbiddenArea')
    });
    if (!image) {
        void message.send(format(Text('图片生成失败')));
        return;
    }
    void message.send(format(Image(image)));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
