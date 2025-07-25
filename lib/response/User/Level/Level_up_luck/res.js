import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { exist_najie_thing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { Level_up } from '../level.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?幸运突破$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let x = await exist_najie_thing(usr_qq, '幸运草', '道具');
    if (!x) {
        Send(Text('醒醒，你没有道具【幸运草】!'));
        return false;
    }
    Level_up(e, true);
});

export { res as default, regular };
