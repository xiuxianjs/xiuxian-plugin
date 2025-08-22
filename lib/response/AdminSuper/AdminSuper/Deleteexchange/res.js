import { useSend, Text } from 'alemonjs';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import { addNajieThing } from '../../../../model/najie.js';
import { selects } from '../../../mw.js';

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
            let thing = i.thing.name;
            const quanity = i.aconut;
            if (i.thing.class == '装备' || i.thing.class == '仙宠')
                thing = i.thing;
            await addNajieThing(usr_qq, thing, i.thing.class, quanity, i.thing.pinji);
        }
        await writeExchange([]);
        Send(Text('清除完成！'));
        return false;
    }
});

export { res as default, regular };
