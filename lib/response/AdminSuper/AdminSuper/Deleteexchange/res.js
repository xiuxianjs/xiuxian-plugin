import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { Read_Exchange, Add_najie_thing, Write_Exchange } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?清除冲水堂$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    {
        if (!e.IsMaster)
            return false;
        Send(Text('开始清除！'));
        let Exchange;
        try {
            Exchange = await Read_Exchange();
        }
        catch {
            Exchange = [];
        }
        for (let i of Exchange) {
            let usr_qq = i.qq;
            let thing = i.name.name;
            let quanity = i.aconut;
            if (i.name.class == '装备' || i.name.class == '仙宠')
                thing = i.name;
            await Add_najie_thing(usr_qq, thing, i.name.class, quanity, i.name.pinji);
        }
        await Write_Exchange([]);
        Send(Text('清除完成！'));
        return false;
    }
});

export { res as default, regular };
