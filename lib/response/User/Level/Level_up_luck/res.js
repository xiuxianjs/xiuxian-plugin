import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { exist_najie_thing } from '../../../../model/xiuxian.js';
import '../../../../model/XiuxianData.js';
import { Level_up } from '../level.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)幸运突破$/;
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

export { res as default, name, regular, selects };
