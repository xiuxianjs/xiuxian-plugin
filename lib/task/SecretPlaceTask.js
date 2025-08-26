import { pushInfo } from '../model/api.js';
import { getDataList } from '../model/DataList.js';
import { notUndAndNull } from '../model/common.js';
import { keysByPath, __PATH } from '../model/keys.js';
import '@alemonjs/db';
import { writePlayer } from '../model/pub.js';
import { safeParse } from '../model/utils/safe.js';
import { readPlayer } from '../model/xiuxian_impl.js';
import { readDanyao, writeDanyao } from '../model/danyao.js';
import { addExp2, addExp, addHP } from '../model/economy.js';
import { addNajieThing } from '../model/najie.js';
import { zdBattle } from '../model/battle.js';
import { Mention } from 'alemonjs';
import { NAJIE_CATEGORIES } from '../model/settions.js';
import { getDataByUserId, setDataByUserId } from '../model/Redis.js';
import { getConfig } from '../model/Config.js';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import 'classnames';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import '../route/core/auth.js';

function isNajieCategory(v) {
    return typeof v === 'string' && NAJIE_CATEGORIES.includes(v);
}
const SecretPlaceTask = async () => {
    const playerList = await keysByPath(__PATH.player_path);
    for (const player_id of playerList) {
        const actionRaw = await getDataByUserId(player_id, 'action');
        const action = safeParse(actionRaw, null);
        if (action) {
            let push_address;
            let is_group = false;
            if ('group_id' in action) {
                if (notUndAndNull(action.group_id)) {
                    is_group = true;
                    push_address = action.group_id;
                }
            }
            const msg = [Mention(player_id)];
            let end_time = action.end_time;
            const now_time = Date.now();
            const player = await readPlayer(player_id);
            if (!player) {
                continue;
            }
            if (action.Place_action == '0') {
                end_time = end_time - 60000 * 2;
                if (now_time > end_time) {
                    const weizhi = action.Place_address;
                    if (!weizhi) {
                        continue;
                    }
                    const A_player = {
                        名号: player.名号,
                        攻击: player.攻击,
                        防御: player.防御,
                        当前血量: player.当前血量,
                        暴击率: player.暴击率,
                        法球倍率: Number(player.灵根?.法球倍率) || 1,
                        灵根: {
                            name: player.灵根?.name || '未知',
                            type: player.灵根?.type || '普通',
                            法球倍率: Number(player.灵根?.法球倍率) || 1
                        },
                        仙宠: player.仙宠 || { name: '无', type: 'none', 加成: 0 }
                    };
                    let buff = 1;
                    if (weizhi.name == '大千世界' || weizhi.name == '仙界矿场') {
                        buff = 0.6;
                    }
                    const monsterList = await getDataList('Monster');
                    const monster_length = monsterList.length;
                    if (monster_length === 0) {
                        return;
                    }
                    const monster_index = Math.trunc(Math.random() * monster_length);
                    const monster = monsterList[monster_index];
                    const B_player = {
                        名号: monster.名号,
                        攻击: Math.floor(Number(monster.攻击 || 0) * player.攻击 * buff),
                        防御: Math.floor(Number(monster.防御 || 0) * player.防御 * buff),
                        当前血量: Math.floor(Number(monster.当前血量 || 0) * player.血量上限 * buff),
                        暴击率: Number(monster.暴击率 || 0) * buff,
                        法球倍率: 0.1,
                        灵根: { name: '野怪', type: '普通', 法球倍率: 0.1 }
                    };
                    const Data_battle = await zdBattle(A_player, B_player);
                    const msgg = Data_battle.msg;
                    const A_win = `${A_player.名号}击败了${B_player.名号}`;
                    const B_win = `${B_player.名号}击败了${A_player.名号}`;
                    let thing_name;
                    let thing_class;
                    const cf = await getConfig('xiuxian', 'xiuxian');
                    const x = cf.SecretPlace.one;
                    const random1 = Math.random();
                    const y = cf.SecretPlace.two;
                    const random2 = Math.random();
                    const z = cf.SecretPlace.three;
                    const random3 = Math.random();
                    let random4;
                    let m = '';
                    let t1 = 1;
                    let t2 = 1;
                    let n = 1;
                    let last_msg = '';
                    if (random1 <= x) {
                        if (random2 <= y) {
                            if (random3 <= z) {
                                random4 = Math.floor(Math.random() * weizhi.three.length);
                                thing_name = weizhi.three[random4].name;
                                if (isNajieCategory(weizhi.three[random4].class)) {
                                    thing_class = weizhi.three[random4].class;
                                }
                                m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是：[${thing_name}`;
                                t1 = 2 + Math.random();
                                t2 = 2 + Math.random();
                            }
                            else {
                                random4 = Math.floor(Math.random() * weizhi.two.length);
                                thing_name = weizhi.two[random4].name;
                                if (isNajieCategory(weizhi.two[random4].class)) {
                                    thing_class = weizhi.two[random4].class;
                                }
                                m = `在洞穴中拿到[${thing_name}`;
                                t1 = 1 + Math.random();
                                t2 = 1 + Math.random();
                                if (weizhi.name == '太极之阳' || weizhi.name == '太极之阴') {
                                    n = 5;
                                    m = '捡到了[' + thing_name;
                                }
                            }
                        }
                        else {
                            random4 = Math.floor(Math.random() * weizhi.one.length);
                            thing_name = weizhi.one[random4].name;
                            if (isNajieCategory(weizhi.one[random4].class)) {
                                thing_class = weizhi.one[random4].class;
                            }
                            m = `捡到了[${thing_name}`;
                            t1 = 0.5 + Math.random() * 0.5;
                            t2 = 0.5 + Math.random() * 0.5;
                            if (weizhi.name == '诸神黄昏·旧神界') {
                                n = 100;
                                if (thing_name == '洗根水') {
                                    n = 130;
                                }
                                m = '捡到了[' + thing_name;
                            }
                            if (weizhi.name == '太极之阳' || weizhi.name == '太极之阴') {
                                n = 5;
                                m = '捡到了[' + thing_name;
                            }
                        }
                    }
                    else {
                        m = '走在路上看见了一只蚂蚁！蚂蚁大仙送了你[起死回生丹';
                        await addNajieThing(player_id, '起死回生丹', '丹药', 1);
                        t1 = 0.5 + Math.random() * 0.5;
                        t2 = 0.5 + Math.random() * 0.5;
                    }
                    if (weizhi.name != '诸神黄昏·旧神界') {
                        const random = Math.random();
                        if (random < player.幸运) {
                            if (random < player.addluckyNo) {
                                last_msg += '福源丹生效，所以在';
                            }
                            else if (player.仙宠.type == '幸运') {
                                last_msg += '仙宠使你在探索中欧气满满，所以在';
                            }
                            n *= 2;
                            last_msg += '本次探索中获得赐福加成\n';
                        }
                        if (player.islucky > 0) {
                            player.islucky--;
                            if (player.islucky != 0) ;
                            else {
                                player.幸运 -= player.addluckyNo;
                                player.addluckyNo = 0;
                            }
                            await writePlayer(player_id, player);
                        }
                    }
                    m += `]×${n}个。`;
                    let xiuwei = 0;
                    const now_level_id = player.level_id;
                    const now_physique_id = player.Physique_id;
                    let qixue = 0;
                    if (msgg.find(item => item == A_win)) {
                        xiuwei = Math.trunc(2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5);
                        qixue = Math.trunc(2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1);
                        if (thing_name && thing_class) {
                            await addNajieThing(player_id, thing_name, thing_class, n);
                        }
                        last_msg += `${m}不巧撞见[${B_player.名号}],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${A_player.当前血量 + Data_battle.A_xue}`;
                        const random = Math.random();
                        let newrandom = 0.995;
                        const dy = await readDanyao(player_id);
                        newrandom -= Number(dy.beiyong1 || 0);
                        if (dy.ped > 0) {
                            dy.ped--;
                        }
                        else {
                            dy.beiyong1 = 0;
                            dy.ped = 0;
                        }
                        await writeDanyao(player_id, dy);
                        if (random > newrandom) {
                            const xianchonkouliangList = await getDataList('Xianchonkouliang');
                            const length = xianchonkouliangList.length;
                            if (length > 0) {
                                const index = Math.trunc(Math.random() * length);
                                const kouliang = xianchonkouliangList[index];
                                last_msg
                                    += '\n七彩流光的神奇仙谷[' + kouliang.name + ']深埋在土壤中，是仙兽们的最爱。';
                                await addNajieThing(player_id, kouliang.name, '仙宠口粮', 1);
                            }
                        }
                        if (random > 0.1 && random < 0.1002) {
                            last_msg
                                += '\n'
                                    + B_player.名号
                                    + '倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。';
                            await addNajieThing(player_id, '长相奇怪的小石头', '道具', 1);
                        }
                    }
                    else if (msgg.find(item => item == B_win)) {
                        xiuwei = 800;
                        last_msg
                            = '不巧撞见['
                                + B_player.名号
                                + '],经过一番战斗,败下阵来,还好跑得快,只获得了修为'
                                + xiuwei
                                + ']';
                    }
                    msg.push('\n' + player.名号 + last_msg);
                    const arr = action;
                    arr.shutup = 1;
                    arr.working = 1;
                    arr.power_up = 1;
                    arr.Place_action = 1;
                    arr.Place_actionplus = 1;
                    arr.end_time = Date.now();
                    delete arr.group_id;
                    await setDataByUserId(player_id, 'action', JSON.stringify(arr));
                    await addExp2(player_id, qixue);
                    await addExp(player_id, xiuwei);
                    await addHP(player_id, Data_battle.A_xue);
                    if (is_group && push_address) {
                        await pushInfo(push_address, is_group, msg);
                    }
                    else {
                        await pushInfo(player_id, is_group, msg);
                    }
                }
            }
        }
    }
};

export { SecretPlaceTask };
