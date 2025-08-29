import { useSend, Text } from 'alemonjs';
import { readExchange, writeExchange } from '../../../../model/trade.js';
import { addNajieThing } from '../../../../model/najie.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?清除冲水堂$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return;
    }
    const Exchange = await readExchange();
    void Promise.all(Exchange.map(i => {
        const userId = i.qq;
        let thing = i.thing.name;
        const quanity = i.aconut;
        if (i.thing.class === '装备' || i.thing.class === '仙宠') {
            thing = i.thing;
        }
        return addNajieThing(userId, thing, i.thing.class, quanity, i.thing.pinji);
    })).finally(() => {
        void writeExchange([]);
        void Send(Text('清除完成！'));
    });
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
