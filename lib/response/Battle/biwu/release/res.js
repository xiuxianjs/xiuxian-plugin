import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import mw, { selects } from '../../../mw.js';
import { getRedisKey } from '../../../../model/keys.js';
import { getDataList } from '../../../../model/DataList.js';

const regular = /^(#|＃|\/)?释放技能.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const action_res = await redis.get(getRedisKey(e.UserId, 'bisai'));
    const action = await JSON.parse(action_res);
    if (!action) {
        return false;
    }
    const msg = e.MessageText.replace(/^(#|＃|\/)?释放技能/, '');
    const jineng = Number(msg) - 1;
    if (!action.技能[jineng]) {
        return false;
    }
    else {
        const data = {
            Jineng: await getDataList('Jineng')
        };
        if (action.技能[jineng].cd < data.Jineng.find(item => item.name === action.技能[jineng].name).cd) {
            void Send(Text(`${action.技能[jineng].name}技能cd中`));
            return false;
        }
    }
    action.use = jineng;
    await redis.set(getRedisKey(e.UserId, 'bisai'), JSON.stringify(action));
    void Send(Text(`选择成功,下回合释放技能:${action.技能[jineng].name}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
