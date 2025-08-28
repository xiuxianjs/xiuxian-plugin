import { pushInfo } from '../model/api.js';
import { notUndAndNull } from '../model/common.js';
import { keysByPath, __PATH } from '../model/keys.js';
import { writePlayer } from '../model/pub.js';
import { getDataList } from '../model/DataList.js';
import { readPlayer } from '../model/xiuxian_impl.js';
import '@alemonjs/db';
import { addExp2, addExp } from '../model/economy.js';
import { addNajieThing } from '../model/najie.js';
import { readTemp, writeTemp } from '../model/temp.js';
import { Mention } from 'alemonjs';
import { NAJIE_CATEGORIES } from '../model/settions.js';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';
import { safeParse } from '../model/utils/safe.js';

function isNajieCategory(v) {
    return typeof v === 'string' && NAJIE_CATEGORIES.includes(v);
}
const ShenjieTask = async () => {
    const playerList = await keysByPath(__PATH.player_path);
    for (const playerId of playerList) {
        const actionRaw = await getDataByUserId(playerId, 'action');
        const action = safeParse(actionRaw, null);
        if (!action) {
            continue;
        }
        let push_address;
        let isGroup = false;
        if ('group_id' in action && notUndAndNull(action.group_id)) {
            isGroup = true;
            push_address = String(action.group_id);
        }
        const msg = [Mention(playerId)];
        let end_time = Number(action.end_time) || 0;
        const now_time = Date.now();
        const player = await readPlayer(playerId);
        if (!player) {
            continue;
        }
        if (String(action.mojie) === '-1') {
            end_time = end_time - Number(action.time ?? 0);
            if (now_time > end_time) {
                let thingName;
                let thingClass;
                const x = 0.98;
                const random1 = Math.random();
                const y = 0.4;
                const random2 = Math.random();
                const z = 0.15;
                const random3 = Math.random();
                let m = '';
                let n = 1;
                let t1 = 1;
                let t2 = 1;
                let lastMessage = '';
                let fyd_msg = '';
                const data = {
                    shenjie: await getDataList('Shenjie')
                };
                const place = data.shenjie?.[0];
                if (!place) {
                    continue;
                }
                if (random1 <= x) {
                    if (random2 <= y) {
                        if (random3 <= z) {
                            if (place.three.length) {
                                const idx = Math.floor(Math.random() * place.three.length);
                                thingName = place.three[idx].name;
                                if (isNajieCategory(place.three[idx].class)) {
                                    thingClass = place.three[idx].class;
                                }
                                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${thingName}]`;
                                t1 = 2 + Math.random();
                                t2 = 2 + Math.random();
                            }
                        }
                        else if (place.two.length) {
                            const idx = Math.floor(Math.random() * place.two.length);
                            thingName = place.two[idx].name;
                            if (isNajieCategory(place.two[idx].class)) {
                                thingClass = place.two[idx].class;
                            }
                            m = `在洞穴中拿到[${thingName}]`;
                            t1 = 1 + Math.random();
                            t2 = 1 + Math.random();
                        }
                    }
                    else if (place.one.length) {
                        const idx = Math.floor(Math.random() * place.one.length);
                        thingName = place.one[idx].name;
                        if (isNajieCategory(place.one[idx].class)) {
                            thingClass = place.one[idx].class;
                        }
                        m = `捡到了[${thingName}]`;
                        t1 = 0.5 + Math.random() * 0.5;
                        t2 = 0.5 + Math.random() * 0.5;
                    }
                }
                else {
                    m = '走在路上都没看见一只蚂蚁！';
                    t1 = 2 + Math.random();
                    t2 = 2 + Math.random();
                }
                const random = Math.random();
                if (random < (Number(player.幸运) || 0)) {
                    if (random < (Number(player.addluckyNo) || 0)) {
                        lastMessage += '福源丹生效，所以在';
                    }
                    else if (player.仙宠?.type === '幸运') {
                        lastMessage += '仙宠使你在探索中欧气满满，所以在';
                    }
                    n++;
                    lastMessage += '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n';
                }
                if ((player.islucky || 0) > 0) {
                    player.islucky--;
                    if (player.islucky !== 0) {
                        fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
                    }
                    else {
                        fyd_msg = '  \n本次探索后，福源丹已失效\n';
                        player.幸运 = Number(player.幸运 ?? 0) - Number(player.addluckyNo ?? 0);
                        player.addluckyNo = 0;
                    }
                    await writePlayer(playerId, player);
                }
                const now_level_id = player.level_id ?? 0;
                const now_physique_id = player.Physique_id ?? 0;
                const xiuwei = Math.trunc(2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5);
                const qixue = Math.trunc(2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1);
                if (thingName && thingClass) {
                    await addNajieThing(playerId, thingName, thingClass, n);
                }
                lastMessage += `${m},获得修为${xiuwei},气血${qixue},剩余次数${(Number(action.cishu) || 0) - 1}`;
                msg.push('\n' + player.名号 + lastMessage + fyd_msg);
                const arr = action;
                const remain = Number(arr.cishu) || 0;
                if (remain <= 1) {
                    arr.shutup = 1;
                    arr.working = 1;
                    arr.power_up = 1;
                    arr.Place_action = 1;
                    arr.Place_actionplus = 1;
                    arr.mojie = 1;
                    arr.end_time = Date.now();
                    delete arr.group_id;
                    await setDataByUserId(playerId, 'action', JSON.stringify(arr));
                    await addExp2(playerId, qixue);
                    await addExp(playerId, xiuwei);
                    if (isGroup && push_address) {
                        pushInfo(push_address, isGroup, msg);
                    }
                    else {
                        pushInfo(playerId, isGroup, msg);
                    }
                }
                else {
                    arr.cishu = remain - 1;
                    await setDataByUserId(playerId, 'action', JSON.stringify(arr));
                    await addExp2(playerId, qixue);
                    await addExp(playerId, xiuwei);
                    try {
                        const temp = await readTemp();
                        const p = {
                            msg: player.名号 + lastMessage + fyd_msg,
                            qq_group: push_address
                        };
                        temp.push(p);
                        await writeTemp(temp);
                    }
                    catch {
                        const temp = [];
                        const p = {
                            msg: player.名号 + lastMessage + fyd_msg,
                            qq: playerId,
                            qq_group: push_address
                        };
                        temp.push(p);
                        await writeTemp(temp);
                    }
                }
            }
        }
    }
};

export { ShenjieTask };
