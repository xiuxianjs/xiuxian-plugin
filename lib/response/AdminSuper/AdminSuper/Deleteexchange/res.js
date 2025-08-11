import { useSend, Text } from 'alemonjs';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import { addNajieThing } from '../../../../model/najie.js';
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
        for (const i of Exchange) {
            const usr_qq = i.qq;
            let thing = i.name.name;
            const quanity = i.aconut;
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
