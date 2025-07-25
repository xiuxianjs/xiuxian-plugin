import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Go } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?修仙状态$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let flag = await Go(e);
    if (!flag) {
        return;
    }
    Send(Text('空闲中!'));
});

export { res as default, regular };
