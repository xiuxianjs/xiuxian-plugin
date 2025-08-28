import { redis, pushInfo } from '../model/api.js';
import { notUndAndNull } from '../model/common.js';
import { keysByPath, keys, __PATH } from '../model/keys.js';
import '@alemonjs/db';
import { getDataList } from '../model/DataList.js';
import { readPlayer } from '../model/xiuxian_impl.js';
import { addExp2, addExp } from '../model/economy.js';
import { existNajieThing, addNajieThing } from '../model/najie.js';
import { readTemp, writeTemp } from '../model/temp.js';
import 'alemonjs';
import '../model/settions.js';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';

function isExploreAction(a) {
    return !!a && typeof a === 'object' && 'end_time' in a;
}
const MojiTask = async () => {
    const playerList = await keysByPath(__PATH.player_path);
    for (const playerId of playerList) {
        const rawAction = await getDataByUserId(playerId, 'action');
        let action;
        try {
            action = JSON.parse(rawAction);
        }
        catch {
            action = null;
        }
        if (action !== null) {
            let push_address = playerId;
            let isGroup = false;
            if (isExploreAction(action) && notUndAndNull(action.group_id)) {
                isGroup = true;
                push_address = action.group_id;
            }
            const msg = [];
            if (!isExploreAction(action)) {
                continue;
            }
            const act = action;
            let end_time = act.end_time;
            const now_time = Date.now();
            const player = await readPlayer(playerId);
            if (String(act.mojie) === '0') {
                const baseDuration = typeof act.time === 'number' ? act.time : parseInt(String(act.time || 0), 10);
                end_time = end_time - (isNaN(baseDuration) ? 0 : baseDuration);
                if (now_time > end_time) {
                    let thingName;
                    let thingClass;
                    const x = 0.98;
                    const random1 = Math.random();
                    const y = 0.4;
                    const random2 = Math.random();
                    const z = 0.15;
                    const random3 = Math.random();
                    let random4;
                    let m = '';
                    let n = 1;
                    let t1;
                    let t2;
                    let lastMessage = '';
                    let fyd_msg = '';
                    const data = {
                        mojie: await getDataList('Mojie')
                    };
                    if (random1 <= x) {
                        if (random2 <= y) {
                            if (random3 <= z) {
                                random4 = Math.floor(Math.random() * data.mojie[0].three.length);
                                thingName = data.mojie[0].three[random4].name;
                                thingClass = data.mojie[0].three[random4].class;
                                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是[${thingName}]`;
                                t1 = 2 + Math.random();
                                t2 = 2 + Math.random();
                            }
                            else {
                                random4 = Math.floor(Math.random() * data.mojie[0].two.length);
                                thingName = data.mojie[0].two[random4].name;
                                thingClass = data.mojie[0].two[random4].class;
                                m = `在洞穴中拿到[${thingName}]`;
                                t1 = 1 + Math.random();
                                t2 = 1 + Math.random();
                            }
                        }
                        else {
                            random4 = Math.floor(Math.random() * data.mojie[0].one.length);
                            thingName = data.mojie[0].one[random4].name;
                            thingClass = data.mojie[0].one[random4].class;
                            m = `捡到了[${thingName}]`;
                            t1 = 0.5 + Math.random() * 0.5;
                            t2 = 0.5 + Math.random() * 0.5;
                        }
                    }
                    else {
                        thingName = '';
                        thingClass = '';
                        m = '走在路上都没看见一只蚂蚁！';
                        t1 = 2 + Math.random();
                        t2 = 2 + Math.random();
                    }
                    const random = Math.random();
                    if (random < player.幸运) {
                        if (random < player.addluckyNo) {
                            lastMessage += '福源丹生效，所以在';
                        }
                        else if (player.仙宠.type === '幸运') {
                            lastMessage += '仙宠使你在探索中欧气满满，所以在';
                        }
                        n++;
                        lastMessage += '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n';
                    }
                    if (player.islucky > 0) {
                        player.islucky--;
                        if (player.islucky !== 0) {
                            fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
                        }
                        else {
                            fyd_msg = '  \n本次探索后，福源丹已失效\n';
                            player.幸运 -= player.addluckyNo;
                            player.addluckyNo = 0;
                        }
                        await redis.set(keys.player(playerId), JSON.stringify(player));
                    }
                    const now_level_id = player.level_id;
                    const now_physique_id = player.Physique_id;
                    let qixue = 0;
                    let xiuwei = 0;
                    xiuwei = Math.trunc(2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5);
                    qixue = Math.trunc(2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1);
                    if (await existNajieThing(playerId, '修魔丹', '道具')) {
                        xiuwei *= 100;
                        xiuwei = Math.trunc(xiuwei);
                        await addNajieThing(playerId, '修魔丹', '道具', -1);
                    }
                    if (await existNajieThing(playerId, '血魔丹', '道具')) {
                        qixue *= 18;
                        qixue = Math.trunc(qixue);
                        await addNajieThing(playerId, '血魔丹', '道具', -1);
                    }
                    if (thingName !== '' || thingClass !== '') {
                        await addNajieThing(playerId, thingName, thingClass, n);
                    }
                    lastMessage
                        += m + ',获得修为' + xiuwei + ',气血' + qixue + ',剩余次数' + ((act.cishu ?? 0) - 1);
                    msg.push('\n' + player.名号 + lastMessage + fyd_msg);
                    const arr = {
                        ...act
                    };
                    if (arr.cishu === 1) {
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
                        pushInfo(push_address, isGroup, msg.join(''));
                    }
                    else {
                        if (typeof arr.cishu === 'number') {
                            arr.cishu--;
                        }
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
    }
};

export { MojiTask };
