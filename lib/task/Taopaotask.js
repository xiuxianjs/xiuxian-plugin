import { redis, pushInfo } from '../model/api.js';
import { getDataList } from '../model/DataList.js';
import { notUndAndNull } from '../model/common.js';
import { Harm } from '../model/battle.js';
import { readShop, writeShop } from '../model/shop.js';
import { addNajieThing } from '../model/najie.js';
import { keysByPath, __PATH } from '../model/keys.js';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';
import { safeParse } from '../model/utils/safe.js';
import { Mention } from 'alemonjs';
import { NAJIE_CATEGORIES } from '../model/settions.js';
import { getAuctionKeyManager } from '../model/constants.js';

function isNajieCategory(v) {
    return typeof v === 'string' && NAJIE_CATEGORIES.includes(v);
}
const Taopaotask = async () => {
    const playerList = await keysByPath(__PATH.player_path);
    for (const playerId of playerList) {
        const actionRaw = await getDataByUserId(playerId, 'action');
        const action = safeParse(actionRaw, null);
        if (action) {
            let push_address;
            let isGroup = false;
            if ('group_id' in action) {
                if (notUndAndNull(action.group_id)) {
                    isGroup = true;
                    push_address = action.group_id;
                }
            }
            const msg = [Mention(playerId)];
            let end_time = action.end_time;
            const now_time = Date.now();
            if (action.xijie === '-2') {
                const actTime = typeof action.time === 'string' ? parseInt(action.time) : Number(action.time);
                end_time = end_time - (isNaN(actTime) ? 0 : actTime) + 60000 * 5;
                if (now_time >= end_time) {
                    const weizhi = action.Place_address;
                    if (!weizhi) {
                        return;
                    }
                    const npcList = await getDataList('NPC');
                    let i = 0;
                    for (i = 0; i < npcList.length; i++) {
                        if (npcList[i].name === '万仙盟') {
                            break;
                        }
                    }
                    const playerA = action.playerA;
                    if (!playerA) {
                        return;
                    }
                    let monster;
                    if (weizhi.Grade === 1) {
                        const monsterLength = npcList[i].one.length;
                        const monsterIndex = Math.trunc(Math.random() * monsterLength);
                        monster = npcList[i].one[monsterIndex];
                    }
                    else if (weizhi.Grade === 2) {
                        const monsterLength = npcList[i].two.length;
                        const monsterIndex = Math.trunc(Math.random() * monsterLength);
                        monster = npcList[i].two[monsterIndex];
                    }
                    else {
                        const monsterLength = npcList[i].three.length;
                        const monsterIndex = Math.trunc(Math.random() * monsterLength);
                        monster = npcList[i].three[monsterIndex];
                    }
                    const playerB = {
                        名号: monster.name,
                        攻击: Math.floor(Number(monster.atk || 0) * Number(playerA.攻击 || 0)),
                        防御: Math.floor((Number(monster.def || 0) * Number(playerA.防御 || 0))
                            / (1 + Number(weizhi.Grade ?? 0) * 0.05)),
                        当前血量: Math.floor((Number(monster.blood || 0) * Number(playerA.当前血量 || 0))
                            / (1 + Number(weizhi.Grade ?? 0) * 0.05)),
                        暴击率: Number(monster.baoji || 0),
                        灵根: monster.灵根 ?? { },
                        法球倍率: Number(monster.灵根?.法球倍率 ?? 0.1)
                    };
                    const Random = Math.random();
                    const npc_damage = Math.trunc(Harm(playerB.攻击 * 0.85, Number(playerA.防御 || 0))
                        + Math.trunc(playerB.攻击 * playerB.法球倍率)
                        + playerB.防御 * 0.1);
                    let lastMessage = '';
                    if (Random < 0.1) {
                        playerA.当前血量 = Number(playerA.当前血量 || 0) - npc_damage;
                        lastMessage += `${playerB.名号}似乎不屑追你,只是随手丢出神通,剩余血量${playerA.当前血量}`;
                    }
                    else if (Random < 0.25) {
                        playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 0.3);
                        lastMessage += `你引起了${playerB.名号}的兴趣,${playerB.名号}决定试探你,只用了三分力,剩余血量${playerA.当前血量}`;
                    }
                    else if (Random < 0.5) {
                        playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 1.5);
                        lastMessage += `你的逃跑让${playerB.名号}愤怒,${playerB.名号}使用了更加强大的一次攻击,剩余血量${playerA.当前血量}`;
                    }
                    else if (Random < 0.7) {
                        playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 1.3);
                        lastMessage += `你成功的吸引了所有的仇恨,${playerB.名号}已经快要抓到你了,强大的攻击已经到了你的面前,剩余血量${playerA.当前血量}`;
                    }
                    else if (Random < 0.9) {
                        playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 1.8);
                        lastMessage += `你们近乎贴脸飞行,${playerB.名号}的攻势愈加猛烈,已经快招架不住了,剩余血量${playerA.当前血量}`;
                    }
                    else {
                        playerA.当前血量 = Number(playerA.当前血量 || 0) - Math.trunc(npc_damage * 0.5);
                        lastMessage += `身体快到极限了嘛,你暗暗问道,脚下逃跑的步伐更加迅速,剩余血量${playerA.当前血量}`;
                    }
                    if (playerA.当前血量 < 0) {
                        playerA.当前血量 = 0;
                    }
                    const arr = action;
                    const shop = await readShop();
                    const slot = shop.find(s => s.name === weizhi.name);
                    if (slot) {
                        slot.state = 0;
                    }
                    if (playerA.当前血量 > 0) {
                        arr.playerA = playerA;
                        if (typeof arr.cishu === 'number') {
                            arr.cishu -= 1;
                        }
                    }
                    else {
                        const num = Number(weizhi.Grade ?? 0) + 1;
                        lastMessage += `\n在躲避追杀中,没能躲过此劫,被抓进了天牢\n在天牢中你找到了秘境之匙x${num}`;
                        await addNajieThing(playerId, '秘境之匙', '道具', num);
                        delete arr.group_id;
                        if (slot) {
                            slot.state = 0;
                        }
                        await writeShop(shop);
                        const time = 60;
                        const action_time = 60000 * time;
                        arr.action = '天牢';
                        arr.xijie = 1;
                        arr.end_time = Date.now() + action_time;
                        const auctionKeyManager = getAuctionKeyManager();
                        const groupListKey = await auctionKeyManager.getAuctionGroupListKey();
                        const groupList = await redis.smembers(groupListKey);
                        const notice = `【全服公告】${playerA.名号}被${playerB.名号}抓进了地牢,希望大家遵纪守法,引以为戒`;
                        for (const gid of groupList) {
                            pushInfo(gid, true, notice);
                        }
                    }
                    if ((arr.cishu ?? 0) === 0) {
                        lastMessage += '\n你成功躲过了万仙盟的追杀,躲进了宗门';
                        arr.xijie = 1;
                        arr.end_time = Date.now();
                        delete arr.group_id;
                        if (Array.isArray(arr.thing)) {
                            for (const t of arr.thing) {
                                if (!t) {
                                    continue;
                                }
                                const tn = t.name;
                                const tc = isNajieCategory(t.class) ? t.class : '道具';
                                const count = t.数量 ?? 0;
                                if (tn && count > 0) {
                                    await addNajieThing(playerId, tn, tc, count);
                                }
                            }
                        }
                        if (slot) {
                            if (typeof slot.Grade === 'number') {
                                slot.Grade = Math.min(3, (slot.Grade || 0) + 1);
                            }
                            slot.state = 0;
                            await writeShop(shop);
                        }
                    }
                    await setDataByUserId(playerId, 'action', JSON.stringify(arr));
                    msg.push('\n' + lastMessage);
                    if (isGroup && push_address) {
                        pushInfo(push_address, isGroup, msg.join('\n'));
                    }
                    else {
                        pushInfo(playerId, isGroup, msg.join('\n'));
                    }
                }
            }
        }
    }
};

export { Taopaotask };
