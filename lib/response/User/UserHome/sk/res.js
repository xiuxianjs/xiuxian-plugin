import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, exist_najie_thing, Add_najie_thing, sleep, Add_仙宠 as Add___ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|\/)抽(天地卡池|灵界卡池|凡界卡池)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tianluoRandom;
    let thing = e.MessageText.replace('#', '');
    thing = thing.replace('抽', '');
    if (thing == '天地卡池') {
        let x = await exist_najie_thing(usr_qq, '天罗地网', '道具');
        if (!x) {
            Send(Text('你没有【天罗地网】'));
            return false;
        }
        await Add_najie_thing(usr_qq, '天罗地网', '道具', -1);
    }
    else if (thing == '灵界卡池') {
        let x = await exist_najie_thing(usr_qq, '金丝仙网', '道具');
        if (!x) {
            Send(Text('你没有【金丝仙网】'));
            return false;
        }
        await Add_najie_thing(usr_qq, '金丝仙网', '道具', -1);
    }
    else if (thing == '凡界卡池') {
        let x = await exist_najie_thing(usr_qq, '银丝仙网', '道具');
        if (!x) {
            Send(Text('你没有【银丝仙网】'));
            return false;
        }
        await Add_najie_thing(usr_qq, '银丝仙网', '道具', -1);
    }
    tianluoRandom = Math.floor(Math.random() * data.changzhuxianchon.length);
    tianluoRandom = (Math.ceil((tianluoRandom + 1) / 5) - 1) * 5;
    Send(Text('一道金光从天而降'));
    await sleep(5000);
    Send(Text('金光掉落在地上，走近一看是【' +
        data.changzhuxianchon[tianluoRandom].品级 +
        '】' +
        data.changzhuxianchon[tianluoRandom].name));
    await Add___(usr_qq, data.changzhuxianchon[tianluoRandom].name, 1);
    Send(Text('恭喜获得' + data.changzhuxianchon[tianluoRandom].name));
});

export { res as default, regular };
