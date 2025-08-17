import { redis, pushInfo } from '../model/api.js';
import { notUndAndNull } from '../model/common.js';
import { zdBattle } from '../model/battle.js';
import { addNajieThing } from '../model/najie.js';
import { readShop, writeShop, existshop } from '../model/shop.js';
import { __PATH } from '../model/keys.js';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';
import { KEY_AUCTION_GROUP_LIST } from '../model/constants.js';
import data from '../model/XiuxianData.js';

const Xijietask = async () => {
    const keys = await redis.keys(`${__PATH.player_path}:*`);
    const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''));
    for (const player_id of playerList) {
        const raw = await getDataByUserId(player_id, 'action');
        let action = null;
        try {
            action = raw ? JSON.parse(raw) : null;
        }
        catch {
            action = null;
        }
        if (action != null) {
            let push_address;
            let is_group = false;
            if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
                if (notUndAndNull(action.group_id)) {
                    is_group = true;
                    push_address = action.group_id;
                }
            }
            const msg = [];
            let end_time = action.end_time;
            const now_time = Date.now();
            if (action.xijie == '0') {
                const durRaw = typeof action.time === 'number'
                    ? action.time
                    : parseInt(String(action.time || 0), 10);
                const dur = isNaN(durRaw) ? 0 : durRaw;
                end_time = end_time - dur + 60000 * 10;
                if (typeof end_time === 'number' && now_time >= end_time) {
                    const weizhi = action.Place_address;
                    if (!weizhi)
                        continue;
                    let i;
                    for (i = 0; i < data.npc_list.length; i++) {
                        if (data.npc_list[i].name == weizhi.name) {
                            break;
                        }
                    }
                    const A_player = action.A_player;
                    let monster_length;
                    let monster_index;
                    let monster;
                    if (weizhi.Grade == 1) {
                        monster_length = data.npc_list[i].one.length;
                        monster_index = Math.trunc(Math.random() * monster_length);
                        monster = data.npc_list[i].one[monster_index];
                    }
                    else if (weizhi.Grade == 2) {
                        monster_length = data.npc_list[i].two.length;
                        monster_index = Math.trunc(Math.random() * monster_length);
                        monster = data.npc_list[i].two[monster_index];
                    }
                    else {
                        monster_length = data.npc_list[i].three.length;
                        monster_index = Math.trunc(Math.random() * monster_length);
                        monster = data.npc_list[i].three[monster_index];
                    }
                    const B_player = {
                        名号: monster.name,
                        攻击: Math.floor(monster.atk * A_player.攻击),
                        防御: Math.floor((monster.def * A_player.防御) / (1 + weizhi.Grade * 0.05)),
                        当前血量: Math.floor((monster.blood * A_player.当前血量) / (1 + weizhi.Grade * 0.05)),
                        暴击率: monster.baoji,
                        灵根: monster.灵根,
                        法球倍率: monster.灵根.法球倍率
                    };
                    let Data_battle;
                    let last_msg = '';
                    const talent = A_player.灵根;
                    const getTalentName = (t) => typeof t === 'object' && t != null && 'name' in t
                        ? String(t.name)
                        : '凡灵根';
                    const getTalentType = (t) => typeof t === 'object' && t != null && 'type' in t
                        ? String(t.type)
                        : '普通';
                    const getTalentRate = (t) => typeof t === 'object' && t != null && '法球倍率' in t
                        ? Number(t.法球倍率) || 1
                        : 1;
                    const A_battle = {
                        名号: A_player.名号,
                        攻击: A_player.攻击,
                        防御: A_player.防御,
                        当前血量: A_player.当前血量,
                        暴击率: A_player.暴击率 ?? 0.05,
                        灵根: {
                            name: getTalentName(talent),
                            type: getTalentType(talent),
                            法球倍率: getTalentRate(talent)
                        }
                    };
                    if ((A_player.魔值 ?? 0) === 0) {
                        Data_battle = await zdBattle(A_battle, B_player);
                        last_msg += A_player.名号 + '悄悄靠近' + B_player.名号;
                        A_player.当前血量 += Data_battle.A_xue;
                    }
                    else {
                        Data_battle = await zdBattle(B_player, A_battle);
                        last_msg += A_player.名号 + '杀气过重,被' + B_player.名号 + '发现了';
                        A_player.当前血量 += Data_battle.B_xue;
                    }
                    const msgg = Data_battle.msg;
                    logger.info(msgg);
                    const A_win = `${A_player.名号}击败了${B_player.名号}`;
                    const B_win = `${B_player.名号}击败了${A_player.名号}`;
                    const arr = action;
                    if (msgg.find(item => item == A_win)) {
                        const time = 10;
                        const action_time = 60000 * time;
                        arr.A_player = A_player;
                        arr.action = '搜刮';
                        arr.end_time = Date.now() + action_time;
                        arr.time = action_time;
                        arr.xijie = -1;
                        last_msg +=
                            ',经过一番战斗,击败对手,剩余' +
                                A_player.当前血量 +
                                '血量,开始搜刮物品';
                    }
                    else if (msgg.find(item => item == B_win)) {
                        const num = weizhi.Grade;
                        last_msg +=
                            ',经过一番战斗,败下阵来,被抓进了地牢\n在地牢中你找到了秘境之匙x' +
                                num;
                        await addNajieThing(player_id, '秘境之匙', '道具', num);
                        delete arr.group_id;
                        const shop = await readShop();
                        for (i = 0; i < shop.length; i++) {
                            if (shop[i].name == weizhi.name) {
                                shop[i].state = 0;
                                break;
                            }
                        }
                        await writeShop(shop);
                        const time = 60;
                        const action_time = 60000 * time;
                        arr.action = '禁闭';
                        arr.xijie = 1;
                        arr.end_time = Date.now() + action_time;
                        const redisGlKey = KEY_AUCTION_GROUP_LIST;
                        const groupList = await redis.smembers(redisGlKey);
                        const xx = '【全服公告】' +
                            A_player.名号 +
                            '被' +
                            B_player.名号 +
                            '抓进了地牢,希望大家遵纪守法,引以为戒';
                        for (const group_id of groupList) {
                            pushInfo(group_id, true, xx);
                        }
                    }
                    await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                    msg.push('\n' + last_msg);
                    if (is_group) {
                        await pushInfo(push_address, is_group, msg.join('\n'));
                    }
                    else {
                        await pushInfo(player_id, is_group, msg.join('\n'));
                    }
                }
            }
            else if (action.xijie == '-1') {
                const dur2Raw = typeof action.time === 'number'
                    ? action.time
                    : parseInt(String(action.time || 0), 10);
                const dur2 = isNaN(dur2Raw) ? 0 : dur2Raw;
                end_time = end_time - dur2 + 60000 * 5;
                if (typeof end_time === 'number' && now_time >= end_time) {
                    const weizhi = action.Place_address;
                    let thing = await existshop(weizhi.name);
                    const arr = action;
                    let last_msg = '';
                    const thing_name = [];
                    let shop = await readShop();
                    let i;
                    for (i = 0; i < shop.length; i++) {
                        if (shop[i].name == weizhi.name) {
                            break;
                        }
                    }
                    if (!thing) {
                        last_msg += '已经被搬空了';
                    }
                    else {
                        const gradeNum = Number(shop[i].Grade ?? 0) || 0;
                        let x = gradeNum * 2;
                        while (x > 0 && thing != false) {
                            const t = (() => {
                                const thing_index = Math.trunc(Math.random() * thing.length);
                                return thing[thing_index];
                            })();
                            thing_name.push(t);
                            shop = await readShop();
                            for (let j = 0; j < shop[i].one.length; j++) {
                                if (shop[i].one[j].name == t.name && shop[i].one[j].数量 > 0) {
                                    shop[i].one[j].数量 = 0;
                                    await writeShop(shop);
                                    break;
                                }
                            }
                            thing = await existshop(weizhi.name);
                            x--;
                        }
                        last_msg += '经过一番搜寻' + arr.A_player.名号 + '找到了';
                        for (let j = 0; j < thing_name.length; j++) {
                            last_msg += '\n' + thing_name[j].name + ' x ' + thing_name[j].数量;
                        }
                        last_msg +=
                            '\n刚出门就被万仙盟的人盯上了,他们仗着人多，你一人无法匹敌，于是撒腿就跑';
                    }
                    arr.action = '逃跑';
                    const time = 30;
                    const action_time = 60000 * time;
                    arr.end_time = Date.now() + action_time;
                    arr.time = action_time;
                    arr.xijie = -2;
                    arr.thing = thing_name;
                    const gradeNumFinal = Number(action.Place_address?.Grade ?? 0) || 0;
                    arr.cishu = gradeNumFinal + 1;
                    await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                    msg.push('\n' + last_msg);
                    if (is_group) {
                        await pushInfo(push_address, is_group, msg.join('\n'));
                    }
                    else {
                        await pushInfo(player_id, is_group, msg.join('\n'));
                    }
                }
            }
        }
    }
};

export { Xijietask };
