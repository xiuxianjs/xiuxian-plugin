import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { selects } from '../../../mw.js';
import { getRedisKey } from '../../../../model/keys.js';
import { getDataList } from '../../../../model/DataList.js';

const regular = /^(#|＃|\/)?释放技能.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const action_res = await redis.get(getRedisKey(e.UserId, 'bisai'));
    const action = await JSON.parse(action_res);
    if (!action)
        return false;
    const msg = e.MessageText.replace(/^(#|＃|\/)?释放技能/, '');
    const jineng = Number(msg) - 1;
    if (!action.技能[jineng])
        return false;
    else {
        const data = {
            jineng: await getDataList('Jineng')
        };
        if (action.技能[jineng].cd <
            data.jineng.find(item => item.name == action.技能[jineng].name).cd) {
            Send(Text(`${action.技能[jineng].name}技能cd中`));
            return false;
        }
    }
    action.use = jineng;
    await redis.set(getRedisKey(e.UserId, 'bisai'), JSON.stringify(action));
    Send(Text(`选择成功,下回合释放技能:${action.技能[jineng].name}`));
});

export { res as default, regular };
