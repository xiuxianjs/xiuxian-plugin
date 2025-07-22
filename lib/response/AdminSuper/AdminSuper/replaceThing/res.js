import { useSend, Text } from 'alemonjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)将米娜桑的纳戒里叫.*的的的(装备|道具|丹药|功法|草药|材料|仙宠|口粮)(抹除|替换为叫.*之之之(装备|道具|丹药|功法|草药|材料|仙宠|口粮))$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('功能暂未开放'));
});

export { res as default, regular, selects };
