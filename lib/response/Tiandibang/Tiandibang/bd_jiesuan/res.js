import { useSend, Text } from 'alemonjs';
import { readTiandibang, writeTiandibang, reBangdang } from '../../../../model/tian.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?清空积分/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        void Send(Text('只有主人可以执行操作'));
        return false;
    }
    try {
        await readTiandibang();
    }
    catch {
        await writeTiandibang([]);
    }
    await reBangdang();
    void Send(Text('积分已经重置！'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
