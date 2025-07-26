import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '../../../../api/api.js';
import { readExchange, addNajieThing, writeExchange } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?清除冲水堂$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        Send(Text('开始清除！'));
        let Exchange = [];
        try {
            Exchange = await readExchange();
        }
        catch {
        }
        for (let i of Exchange) {
            let usr_qq = i.qq;
            let thing = i.name.name;
            let quanity = i.aconut;
            if (i.name.class == '装备' || i.name.class == '仙宠')
                thing = i.name;
            await addNajieThing(usr_qq, thing, i.name.class, quanity, i.name.pinji);
        }
        await writeExchange([]);
        Send(Text('清除完成！'));
        return false;
    }
});

export { res as default, regular };
