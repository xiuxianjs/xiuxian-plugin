import fs, { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { redis } from '../api/api.js';
import data from './XiuxianData.js';
import { Read_it } from './duanzaofu.js';
import config from './Config.js';
import { useSend, Text } from 'alemonjs';
import puppeteer from '../image/index.js';
import { __PATH } from './paths.js';
import { Write_player, Writeit } from './pub.js';

function getPlayerDataSafe(usr_qq) {
    const playerData = data.getData('player', usr_qq);
    if (playerData === 'error' || Array.isArray(playerData)) {
        return null;
    }
    return playerData;
}
function setPlayerDataSafe(usr_qq, player) {
    data.setData('player', usr_qq, player);
}
function getEquipmentDataSafe(usr_qq) {
    const equipmentData = data.getData('equipment', usr_qq);
    if (equipmentData === 'error' || Array.isArray(equipmentData)) {
        return null;
    }
    return equipmentData;
}
const 体质概率 = 0.2;
const 伪灵根概率 = 0.37;
const 真灵根概率 = 0.29;
const 天灵根概率 = 0.08;
const 圣体概率 = 0.01;
async function existplayer(usr_qq) {
    const exist_player = fs.existsSync(`${__PATH.player_path}/${usr_qq}.json`);
    if (exist_player) {
        return true;
    }
    return false;
}
async function convert2integer(amount) {
    const number = 1;
    const reg = new RegExp(/^[1-9][0-9]{0,12}$/);
    if (!reg.test(String(amount))) {
        return number;
    }
    else {
        return Math.floor(Number(amount));
    }
}
async function Read_updata_log() {
    const update_log = fs.readFileSync('', 'utf8');
    return update_log;
}
async function Read_player(usr_qq) {
    let dir = path.join(`${__PATH.player_path}/${usr_qq}.json`);
    let player = fs.readFileSync(dir, 'utf8');
    const playerData = JSON.parse(decodeURIComponent(player));
    return playerData;
}
async function LevelTask(e, power_n, power_m, power_Grade, aconut) {
    const usr_qq = e.UserId;
    const Send = useSend(e);
    const msg = [Number(usr_qq).toString()];
    const player = await Read_player(usr_qq);
    if (!player) {
        Send(Text('玩家数据不存在'));
        return 0;
    }
    let power_distortion = await dujie(usr_qq);
    const yaocaolist = ['凝血草', '小吉祥草', '大吉祥草'];
    for (const j in yaocaolist) {
        const num = await exist_najie_thing(usr_qq, yaocaolist[j], '草药');
        if (num) {
            msg.push(`[${yaocaolist[j]}]为你提高了雷抗\n`);
            power_distortion = Math.trunc(power_distortion * (1 + 0.2 * Number(j)));
            await Add_najie_thing(usr_qq, yaocaolist[j], '草药', -1);
        }
        let variable = Math.random() * (power_m - power_n) + power_n;
        variable = variable + aconut / 10;
        variable = Number(variable);
        if (power_distortion >= variable) {
            if (aconut >= power_Grade) {
                player.power_place = 0;
                await Write_player(usr_qq, player);
                msg.push('\n' +
                    player.名号 +
                    '成功度过了第' +
                    aconut +
                    '道雷劫！可以#登仙，飞升仙界啦！');
                Send(Text(msg.join('')));
                return 0;
            }
            else {
                let act = variable - power_n;
                act = act / (power_m - power_n);
                player.当前血量 = Math.trunc(player.当前血量 - player.当前血量 * act);
                await Write_player(usr_qq, player);
                msg.push('\n本次雷伤：' +
                    variable.toFixed(2) +
                    '\n本次雷抗：' +
                    power_distortion +
                    '\n' +
                    player.名号 +
                    '成功度过了第' +
                    aconut +
                    '道雷劫！\n下一道雷劫在一分钟后落下！');
                Send(Text(msg.join('')));
                return 1;
            }
        }
        else {
            player.当前血量 = 1;
            player.修为 = Math.trunc(player.修为 * 0.5);
            player.power_place = 1;
            await Write_player(usr_qq, player);
            msg.push('\n本次雷伤' +
                variable.toFixed(2) +
                '\n本次雷抗：' +
                power_distortion +
                '\n第' +
                aconut +
                '道雷劫落下了，可惜' +
                player.名号 +
                '未能抵挡，渡劫失败了！');
            Send(Text(msg.join('')));
            return 0;
        }
    }
    return 0;
}
async function Read_equipment(usr_qq) {
    let dir = path.join(`${__PATH.equipment_path}/${usr_qq}.json`);
    let equipment = fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(equipment);
    return data;
}
async function Write_equipment(usr_qq, equipment) {
    let player = await Read_player(usr_qq);
    if (!player)
        return;
    player.攻击 =
        data.Level_list.find(item => item.level_id == player.level_id)?.基础攻击 +
            player.攻击加成 +
            data.LevelMax_list.find(item => item.level_id == player.Physique_id)
                ?.基础攻击;
    player.防御 =
        data.Level_list.find(item => item.level_id == player.level_id)?.基础防御 +
            player.防御加成 +
            data.LevelMax_list.find(item => item.level_id == player.Physique_id)
                ?.基础防御;
    player.血量上限 =
        data.Level_list.find(item => item.level_id == player.level_id)?.基础血量 +
            player.生命加成 +
            data.LevelMax_list.find(item => item.level_id == player.Physique_id)
                ?.基础血量;
    player.暴击率 =
        data.Level_list.find(item => item.level_id == player.level_id)?.基础暴击 +
            data.LevelMax_list.find(item => item.level_id == player.Physique_id)
                ?.基础暴击;
    let type = ['武器', '护具', '法宝'];
    for (let i of type) {
        const equipItem = equipment[i];
        if (equipItem.atk > 10 || equipItem.def > 10 || equipItem.HP > 10) {
            player.攻击 += equipItem.atk;
            player.防御 += equipItem.def;
            player.血量上限 += equipItem.HP;
        }
        else {
            player.攻击 = Math.trunc(player.攻击 * (1 + equipItem.atk));
            player.防御 = Math.trunc(player.防御 * (1 + equipItem.def));
            player.血量上限 = Math.trunc(player.血量上限 * (1 + equipItem.HP));
        }
        player.暴击率 += equipItem.bao;
    }
    player.暴击伤害 = player.暴击率 + 1.5;
    if (player.暴击伤害 > 2.5)
        player.暴击伤害 = 2.5;
    if (player.仙宠.type == '暴伤')
        player.暴击伤害 += player.仙宠.加成;
    await Write_player(usr_qq, player);
    await Add_HP(usr_qq, 0);
    let dir = path.join(__PATH.equipment_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(equipment);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Read_najie(usr_qq) {
    let dir = path.join(`${__PATH.najie_path}/${usr_qq}.json`);
    let najie = fs.readFileSync(dir, 'utf8');
    let najieData;
    try {
        najieData = JSON.parse(najie);
    }
    catch {
        await fixed(usr_qq);
        najieData = await Read_najie(usr_qq);
    }
    return najieData;
}
async function get_XianChong_img(e) {
    let i;
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let playerData = data.getData('player', usr_qq);
    if (playerData === 'error' || Array.isArray(playerData)) {
        return;
    }
    let player = playerData;
    let najie = await Read_najie(usr_qq);
    if (!najie)
        return;
    let XianChong_have = [];
    let XianChong_need = [];
    let Kouliang = [];
    let XianChong_list = data.xianchon;
    let Kouliang_list = data.xianchonkouliang;
    for (i = 0; i < XianChong_list.length; i++) {
        if (najie.仙宠.find(item => item.name == XianChong_list[i].name)) {
            XianChong_have.push(XianChong_list[i]);
        }
        else if (player.仙宠.name == XianChong_list[i].name) {
            XianChong_have.push(XianChong_list[i]);
        }
        else {
            XianChong_need.push(XianChong_list[i]);
        }
    }
    for (i = 0; i < Kouliang_list.length; i++) {
        Kouliang.push(Kouliang_list[i]);
    }
    let player_data = {
        nickname: player.名号,
        XianChong_have,
        XianChong_need,
        Kouliang
    };
    return await puppeteer.screenshot('xianchong', e.UserId, player_data);
}
async function get_daoju_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let playerData = data.getData('player', usr_qq);
    if (playerData === 'error' || Array.isArray(playerData)) {
        return;
    }
    let player = playerData;
    let najie = await Read_najie(usr_qq);
    if (!najie)
        return;
    let daoju_have = [];
    let daoju_need = [];
    for (const i of data.daoju_list) {
        if (najie.道具.find(item => item.name == i.name)) {
            daoju_have.push(i);
        }
        else {
            daoju_need.push(i);
        }
    }
    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        daoju_have,
        daoju_need
    };
    return await puppeteer.screenshot('daoju', e.UserId, player_data);
}
async function get_wuqi_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = getPlayerDataSafe(usr_qq);
    if (!player)
        return;
    let najie = await Read_najie(usr_qq);
    if (!najie)
        return;
    let equipment = await Read_equipment(usr_qq);
    if (!equipment)
        return;
    let wuqi_have = [];
    let wuqi_need = [];
    const wuqi_list = [
        'equipment_list',
        'timeequipmen_list',
        'duanzhaowuqi',
        'duanzhaohuju',
        'duanzhaobaowu'
    ];
    for (const i of wuqi_list) {
        for (const j of data[i]) {
            if (najie['装备'].find(item => item.name == j.name) &&
                !wuqi_have.find(item => item.name == j.name)) {
                wuqi_have.push(j);
            }
            else if ((equipment['武器'].name == j.name ||
                equipment['法宝'].name == j.name ||
                equipment['护具'].name == j.name) &&
                !wuqi_have.find(item => item.name == j.name)) {
                wuqi_have.push(j);
            }
            else if (!wuqi_need.find(item => item.name == j.name)) {
                wuqi_need.push(j);
            }
        }
    }
    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        wuqi_have,
        wuqi_need
    };
    return await puppeteer.screenshot('wuqi', e.UserId, player_data);
}
async function get_danyao_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    const player = await Read_player(usr_qq);
    if (!player)
        return;
    const najie = await Read_najie(usr_qq);
    if (!najie)
        return;
    let danyao_have = [];
    let danyao_need = [];
    const danyao = ['danyao_list', 'timedanyao_list', 'newdanyao_list'];
    for (const i of danyao) {
        for (const j of data[i]) {
            if (najie['丹药'].find(item => item.name == j.name) &&
                !danyao_have.find(item => item.name == j.name)) {
                danyao_have.push(j);
            }
            else if (!danyao_need.find(item => item.name == j.name)) {
                danyao_need.push(j);
            }
        }
    }
    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        danyao_have,
        danyao_need
    };
    return await puppeteer.screenshot('danyao', e.UserId, player_data);
}
async function get_gongfa_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    const player = await getPlayerDataSafe(usr_qq);
    if (!player) {
        return;
    }
    let xuexi_gongfa = player.学习的功法;
    let gongfa_have = [];
    let gongfa_need = [];
    const gongfa = ['gongfa_list', 'timegongfa_list'];
    for (const i of gongfa) {
        for (const j of data[i]) {
            if (xuexi_gongfa.find(item => item == j.name) &&
                !gongfa_have.find(item => item.name == j.name)) {
                gongfa_have.push(j);
            }
            else if (!gongfa_need.find(item => item.name == j.name)) {
                gongfa_need.push(j);
            }
        }
    }
    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        gongfa_have,
        gongfa_need
    };
    return await puppeteer.screenshot('gongfa', e.UserId, player_data);
}
async function get_power_img(e) {
    let usr_qq = e.UserId;
    const Send = useSend(e);
    const player = await getPlayerDataSafe(usr_qq);
    if (!player) {
        Send(Text('玩家数据获取失败'));
        return;
    }
    let lingshi = Math.trunc(player.灵石);
    if (player.灵石 > 999999999999) {
        lingshi = 999999999999;
    }
    await setPlayerDataSafe(usr_qq, player);
    await player_efficiency(usr_qq);
    if (!isNotNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return;
    }
    let this_association;
    if (!isNotNull(player.宗门)) {
        this_association = {
            宗门名称: '无',
            职位: '无'
        };
    }
    else {
        this_association = player.宗门;
    }
    let levelMax = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;
    let need_xueqi = data.LevelMax_list.find(item => item.level_id == player.Physique_id).exp;
    let playercopy = {
        user_id: usr_qq,
        nickname: player.名号,
        need_xueqi: need_xueqi,
        xueqi: player.血气,
        levelMax: levelMax,
        lingshi: lingshi,
        镇妖塔层数: player.镇妖塔层数,
        神魄段数: player.神魄段数,
        hgd: player.favorability,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        learned_gongfa: player.学习的功法,
        association: this_association
    };
    return await puppeteer.screenshot('playercopy', e.UserId, playercopy);
}
async function get_player_img(e) {
    const Send = useSend(e);
    let 法宝评级;
    let 护具评级;
    let 武器评级;
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    const player = await getPlayerDataSafe(usr_qq);
    if (!player) {
        Send(Text('玩家数据获取失败'));
        return;
    }
    const equipment = getEquipmentDataSafe(usr_qq);
    if (!equipment) {
        Send(Text('装备数据获取失败'));
        return;
    }
    let player_status = await getPlayerAction(usr_qq);
    let status = '空闲';
    if (player_status.time != null) {
        status = player_status.action + '(剩余时间:' + player_status.time + ')';
    }
    let lingshi = Math.trunc(player.灵石);
    if (player.灵石 > 999999999999) {
        lingshi = 999999999999;
    }
    if (player.宣言 == null || player.宣言 == undefined) {
        player.宣言 = '这个人很懒什么都没写';
    }
    if (player.灵根 == null || player.灵根 == undefined) {
        player.灵根 = await get_random_talent();
    }
    await setPlayerDataSafe(usr_qq, player);
    await player_efficiency(usr_qq);
    if ((await player.linggenshow) != 0) {
        player.灵根.type = '无';
        player.灵根.name = '未知';
        player.灵根.法球倍率 = '0';
        player.修炼效率提升 = '0';
    }
    if (!isNotNull(player.level_id)) {
        Send(Text('请先#一键同步'));
        return;
    }
    if (!isNotNull(player.sex)) {
        Send(Text('请先#一键同步'));
        return;
    }
    let nd = '无';
    if (player.隐藏灵根)
        nd = player.隐藏灵根.name;
    let zd = ['攻击', '防御', '生命加成', '防御加成', '攻击加成'];
    let num = [];
    let p = [];
    let kxjs = [];
    let count = 0;
    for (let j of zd) {
        if (player[j] == 0) {
            p[count] = '';
            kxjs[count] = 0;
            count++;
            continue;
        }
        p[count] = Math.floor(Math.log(player[j]) / Math.LN10);
        num[count] = player[j] * 10 ** -p[count];
        kxjs[count] = `${num[count].toFixed(2)} x 10`;
        count++;
    }
    let level = data.Level_list.find(item => item.level_id == player.level_id).level;
    let power = (player.攻击 * 0.9 +
        player.防御 * 1.1 +
        player.血量上限 * 0.6 +
        player.暴击率 * player.攻击 * 0.5 +
        Number(player.灵根?.法球倍率 || 0) * player.攻击) /
        10000;
    power = Number(power);
    power = power.toFixed(2);
    let power2 = (player.攻击 + player.防御 * 1.1 + player.血量上限 * 0.5) / 10000;
    power2 = Number(power2);
    power2 = power2.toFixed(2);
    let level2 = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;
    let need_exp = data.Level_list.find(item => item.level_id == player.level_id).exp;
    let need_exp2 = data.LevelMax_list.find(item => item.level_id == player.Physique_id).exp;
    let occupation = player.occupation;
    let occupation_level;
    let occupation_level_name;
    let occupation_exp;
    let occupation_need_exp;
    if (!isNotNull(player.occupation)) {
        occupation = '无';
        occupation_level_name = '-';
        occupation_exp = '-';
        occupation_need_exp = '-';
    }
    else {
        occupation_level = player.occupation_level;
        occupation_level_name = data.occupation_exp_list.find(item => item.id == occupation_level).name;
        occupation_exp = player.occupation_exp;
        occupation_need_exp = data.occupation_exp_list.find(item => item.id == occupation_level).experience;
    }
    let this_association;
    if (!isNotNull(player.宗门)) {
        this_association = {
            宗门名称: '无',
            职位: '无'
        };
    }
    else {
        this_association = player.宗门;
    }
    let pinji = ['劣', '普', '优', '精', '极', '绝', '顶'];
    if (!isNotNull(equipment.武器.pinji)) {
        武器评级 = '无';
    }
    else {
        武器评级 = pinji[equipment.武器.pinji];
    }
    if (!isNotNull(equipment.护具.pinji)) {
        护具评级 = '无';
    }
    else {
        护具评级 = pinji[equipment.护具.pinji];
    }
    if (!isNotNull(equipment.法宝.pinji)) {
        法宝评级 = '无';
    }
    else {
        法宝评级 = pinji[equipment.法宝.pinji];
    }
    let rank_lianqi = data.Level_list.find(item => item.level_id == player.level_id).level;
    let expmax_lianqi = data.Level_list.find(item => item.level_id == player.level_id).exp;
    let rank_llianti = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;
    let expmax_llianti = need_exp2;
    let rank_liandan = occupation_level_name;
    let expmax_liandan = occupation_need_exp;
    let strand_hp = Strand(player.当前血量, player.血量上限);
    let strand_lianqi = Strand(player.修为, expmax_lianqi);
    let strand_llianti = Strand(player.血气, expmax_llianti);
    let strand_liandan = Strand(occupation_exp, expmax_liandan);
    let Power = GetPower(player.攻击, player.防御, player.血量上限, player.暴击率);
    let PowerMini = bigNumberTransform(Power);
    let bao = Math.floor(player.暴击率 * 100) + '%';
    const equipmentCopy = {
        武器: {
            ...equipment.武器,
            bao: Math.floor(equipment.武器.bao * 100) + '%'
        },
        护具: {
            ...equipment.护具,
            bao: Math.floor(equipment.护具.bao * 100) + '%'
        },
        法宝: { ...equipment.法宝, bao: Math.floor(equipment.法宝.bao * 100) + '%' }
    };
    lingshi = bigNumberTransform(lingshi);
    let hunyin = '未知';
    let A = usr_qq;
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    }
    catch {
        await Write_qinmidu([]);
        qinmidu = await Read_qinmidu();
    }
    for (let i = 0; i < qinmidu.length; i++) {
        if (qinmidu[i].QQ_A == A || qinmidu[i].QQ_B == A) {
            if (qinmidu[i].婚姻 > 0) {
                if (qinmidu[i].QQ_A == A) {
                    let B = await Read_player(qinmidu[i].QQ_B);
                    hunyin = B.名号;
                }
                else {
                    let A = await Read_player(qinmidu[i].QQ_A);
                    hunyin = A.名号;
                }
                break;
            }
        }
    }
    let action = player.练气皮肤;
    let player_data = {
        neidan: nd,
        pifu: action,
        user_id: usr_qq,
        player,
        rank_lianqi,
        expmax_lianqi,
        rank_llianti,
        expmax_llianti,
        rank_liandan,
        expmax_liandan,
        equipment,
        talent: Math.floor(Number(player.修炼效率提升 || 0) * 100),
        player_action: status,
        this_association,
        strand_hp,
        strand_lianqi,
        strand_llianti,
        strand_liandan,
        PowerMini,
        bao,
        nickname: player.名号,
        linggen: player.灵根,
        declaration: player.宣言,
        need_exp: need_exp,
        need_exp2: need_exp2,
        exp: player.修为,
        exp2: player.血气,
        zdl: power,
        镇妖塔层数: player.镇妖塔层数,
        sh: player.神魄段数,
        mdz: player.魔道值,
        hgd: player.favorability,
        jczdl: power2,
        level: level,
        level2: level2,
        lingshi: lingshi,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        player_atk: kxjs[0],
        player_atk2: p[0],
        player_def: kxjs[1],
        player_def2: p[1],
        生命加成: kxjs[2],
        生命加成_t: p[2],
        防御加成: kxjs[3],
        防御加成_t: p[3],
        攻击加成: kxjs[4],
        攻击加成_t: p[4],
        player_bao: player.暴击率,
        player_bao2: player.暴击伤害,
        occupation: occupation,
        occupation_level: occupation_level_name,
        occupation_exp: occupation_exp,
        occupation_need_exp: occupation_need_exp,
        arms: equipmentCopy.武器,
        armor: equipmentCopy.护具,
        treasure: equipmentCopy.法宝,
        association: this_association,
        learned_gongfa: player.学习的功法,
        婚姻状况: hunyin,
        武器评级: 武器评级,
        护具评级: 护具评级,
        法宝评级: 法宝评级,
        avatar: player.avatar
    };
    if (process.env.NODE_ENV === 'development') {
        const dir = './views';
        mkdirSync(dir, { recursive: true });
        writeFileSync(`${dir}/user.json`, JSON.stringify(player_data, null, 2));
    }
    return await puppeteer.screenshot('player', e.UserId, player_data);
}
async function get_association_img(e) {
    let item;
    let usr_qq = e.UserId;
    const Send = useSend(e);
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    const player = getPlayerDataSafe(usr_qq);
    if (!player || !isNotNull(player.宗门)) {
        return;
    }
    if (!isNotNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return;
    }
    const zongmenName = typeof player.宗门 === 'string' ? player.宗门 : player.宗门?.宗门名称;
    const ass = data.getAssociation(zongmenName);
    if (ass === 'error' || Array.isArray(ass)) {
        Send(Text('宗门数据获取失败'));
        return;
    }
    const mainqqData = data.getData('player', ass.宗主);
    if (mainqqData === 'error' || Array.isArray(mainqqData)) {
        Send(Text('宗主数据获取失败'));
        return;
    }
    const mainqq = mainqqData;
    let xian = ass.power;
    let weizhi;
    if (xian == 0) {
        weizhi = '凡界';
    }
    else {
        weizhi = '仙界';
    }
    let level = data.Level_list.find(item => item.level_id === ass.最低加入境界).level;
    let fuzong = [];
    for (item in ass.副宗主) {
        fuzong[item] =
            '道号：' +
                data.getData('player', ass.副宗主[item]).名号 +
                'QQ：' +
                ass.副宗主[item];
    }
    const zhanglao = [];
    for (item in ass.长老) {
        zhanglao[item] =
            '道号：' +
                data.getData('player', ass.长老[item]).名号 +
                'QQ：' +
                ass.长老[item];
    }
    const neimen = [];
    for (item in ass.内门弟子) {
        neimen[item] =
            '道号：' +
                data.getData('player', ass.内门弟子[item]).名号 +
                'QQ：' +
                ass.内门弟子[item];
    }
    const waimen = [];
    for (item in ass.外门弟子) {
        waimen[item] =
            '道号：' +
                data.getData('player', ass.外门弟子[item]).名号 +
                'QQ：' +
                ass.外门弟子[item];
    }
    let state = '需要维护';
    let now = new Date();
    let nowTime = now.getTime();
    if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
        state = '不需要维护';
    }
    let xiulian;
    let dongTan = await data.bless_list.find(item => item.name == ass.宗门驻地);
    if (ass.宗门驻地 == 0) {
        xiulian = ass.宗门等级 * 0.05 * 100;
    }
    else {
        try {
            xiulian = ass.宗门等级 * 0.05 * 100 + dongTan.efficiency * 100;
        }
        catch {
            xiulian = ass.宗门等级 * 0.05 * 100 + 0.5;
        }
    }
    xiulian = Math.trunc(xiulian);
    if (ass.宗门神兽 == 0) {
        ass.宗门神兽 = '无';
    }
    let association_data = {
        user_id: usr_qq,
        ass: ass,
        mainname: mainqq.名号,
        mainqq: ass.宗主,
        xiulian: xiulian,
        weizhi: weizhi,
        level: level,
        mdz: player.魔道值,
        zhanglao: zhanglao,
        fuzong: fuzong,
        neimen: neimen,
        waimen: waimen,
        state: state
    };
    return await puppeteer.screenshot('association', e.UserId, association_data);
}
async function get_equipment_img(e) {
    let usr_qq = e.UserId;
    let playerData = data.getData('player', usr_qq);
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay || playerData === 'error' || Array.isArray(playerData)) {
        return;
    }
    let player = playerData;
    const bao = Math.trunc(Math.floor(player.暴击率 * 100));
    let equipmentData = data.getData('equipment', usr_qq);
    if (equipmentData === 'error' || Array.isArray(equipmentData)) {
        return;
    }
    let equipment = equipmentData;
    let player_data = {
        user_id: usr_qq,
        mdz: player.魔道值,
        nickname: player.名号,
        arms: equipment.武器,
        armor: equipment.护具,
        treasure: equipment.法宝,
        player_atk: player.攻击,
        player_def: player.防御,
        player_bao: bao,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        pifu: Number(player.装备皮肤 || 0)
    };
    if (process.env.NODE_ENV === 'development') {
        const dir = './views';
        mkdirSync(dir, { recursive: true });
        writeFileSync(`${dir}/equipment.json`, JSON.stringify(player_data, null, 2));
    }
    return await puppeteer.screenshot('equipment', e.UserId, player_data);
}
async function get_najie_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let playerData = data.getData('player', usr_qq);
    if (playerData === 'error' || Array.isArray(playerData)) {
        return;
    }
    let player = playerData;
    let najie = await Read_najie(usr_qq);
    if (!najie)
        return;
    const lingshi = Math.trunc(najie.灵石);
    const lingshi2 = Math.trunc(najie.灵石上限 || 0);
    let strand_hp = Strand(player.当前血量, player.血量上限);
    let strand_lingshi = Strand(najie.灵石, najie.灵石上限 || 0);
    let player_data = {
        user_id: usr_qq,
        player: player,
        najie: najie,
        mdz: player.魔道值,
        nickname: player.名号,
        najie_lv: najie.等级 || 1,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        najie_maxlingshi: lingshi2,
        najie_lingshi: lingshi,
        najie_equipment: najie.装备,
        najie_danyao: najie.丹药,
        najie_daoju: najie.道具,
        najie_gongfa: najie.功法,
        najie_caoyao: najie.草药,
        najie_cailiao: najie.材料,
        strand_hp: strand_hp,
        strand_lingshi: strand_lingshi,
        pifu: player.练气皮肤 || 0
    };
    return await puppeteer.screenshot('najie', e.UserId, player_data);
}
async function get_state_img(e, all_level) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let playerData = data.getData('player', usr_qq);
    if (playerData === 'error' || Array.isArray(playerData)) {
        return;
    }
    let player = playerData;
    let Level_id = player.level_id;
    let Level_list = data.Level_list;
    if (!all_level) {
        for (let i = 1; i <= 60; i++) {
            if (i > Level_id - 6 && i < Level_id + 6) {
                continue;
            }
            Level_list = await Level_list.filter(item => item.level_id != i);
        }
    }
    let state_data = {
        user_id: usr_qq,
        Level_list: Level_list
    };
    return await puppeteer.screenshot('state', e.UserId, state_data);
}
async function get_statezhiye_img(e, all_level) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let playerData = data.getData('player', usr_qq);
    if (playerData === 'error' || Array.isArray(playerData)) {
        return;
    }
    let player = playerData;
    let Level_id = player.occupation_level || 0;
    let Level_list = data.occupation_exp_list;
    if (!all_level) {
        for (let i = 0; i <= 60; i++) {
            if (i > Level_id - 6 && i < Level_id + 6) {
                continue;
            }
            Level_list = await Level_list.filter(item => item.id != i);
        }
    }
    let state_data = {
        user_id: usr_qq,
        Level_list: Level_list
    };
    return await puppeteer.screenshot('statezhiye', e.UserId, state_data);
}
async function get_statemax_img(e, all_level) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let playerData = data.getData('player', usr_qq);
    if (playerData === 'error' || Array.isArray(playerData)) {
        return;
    }
    let player = playerData;
    let Level_id = player.Physique_id;
    let LevelMax_list = data.LevelMax_list;
    if (!all_level) {
        for (let i = 1; i <= 60; i++) {
            if (i > Level_id - 6 && i < Level_id + 6) {
                continue;
            }
            LevelMax_list = await LevelMax_list.filter(item => item.level_id != i);
        }
    }
    let statemax_data = {
        user_id: usr_qq,
        LevelMax_list: LevelMax_list
    };
    return await puppeteer.screenshot('statemax', e.UserId, statemax_data);
}
async function get_talent_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let talent_list = data.talent_list;
    let talent_data = {
        user_id: usr_qq,
        talent_list: talent_list
    };
    return await puppeteer.screenshot('talent', e.UserId, talent_data);
}
async function get_adminset_img(e) {
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let adminset = {
        CDassociation: cf.CD.association,
        CDjoinassociation: cf.CD.joinassociation,
        CDassociationbattle: cf.CD.associationbattle,
        CDrob: cf.CD.rob,
        CDgambling: cf.CD.gambling,
        CDcouple: cf.CD.couple,
        CDgarden: cf.CD.garden,
        CDlevel_up: cf.CD.level_up,
        CDsecretplace: cf.CD.secretplace,
        CDtimeplace: cf.CD.timeplace,
        CDforbiddenarea: cf.CD.forbiddenarea,
        CDreborn: cf.CD.reborn,
        CDtransfer: cf.CD.transfer,
        CDhonbao: cf.CD.honbao,
        CDboss: cf.CD.boss,
        percentagecost: cf.percentage.cost,
        percentageMoneynumber: cf.percentage.Moneynumber,
        percentagepunishment: cf.percentage.punishment,
        sizeMoney: cf.size.Money,
        switchplay: cf.switch.play,
        switchMoneynumber: cf.switch.play,
        switchcouple: cf.switch.couple,
        switchXiuianplay_key: cf.switch.Xiuianplay_key,
        biguansize: cf.biguan.size,
        biguantime: cf.biguan.time,
        biguancycle: cf.biguan.cycle,
        worksize: cf.work.size,
        worktime: cf.work.time,
        workcycle: cf.work.cycle,
        SecretPlaceone: cf.SecretPlace.one,
        SecretPlacetwo: cf.SecretPlace.two,
        SecretPlacethree: cf.SecretPlace.three
    };
    return await puppeteer.screenshot('adminset', e.UserId, adminset);
}
async function get_ranking_power_img(e, Data, usr_paiming, thisplayer) {
    let usr_qq = e.UserId;
    let level = data.Level_list.find(item => item.level_id == thisplayer.level_id).level;
    let ranking_power_data = {
        user_id: usr_qq,
        mdz: thisplayer.魔道值,
        nickname: thisplayer.名号,
        exp: thisplayer.修为,
        level: level,
        usr_paiming: usr_paiming,
        allplayer: Data
    };
    return await puppeteer.screenshot('ranking_power', e.UserId, ranking_power_data);
}
async function get_ranking_money_img(e, Data, usr_paiming, thisplayer, thisnajie) {
    let usr_qq = e.UserId;
    const najie_lingshi = Math.trunc(thisnajie.灵石);
    const lingshi = Math.trunc(thisplayer.灵石 + thisnajie.灵石);
    let ranking_money_data = {
        user_id: usr_qq,
        nickname: thisplayer.名号,
        lingshi: lingshi,
        najie_lingshi: najie_lingshi,
        usr_paiming: usr_paiming,
        allplayer: Data
    };
    return await puppeteer.screenshot('ranking_money', e.UserId, ranking_money_data);
}
async function fixed(usr_qq) {
    fs.copyFileSync(`${__PATH.auto_backup}/najie/${usr_qq}.json`, `${__PATH.najie_path}/${usr_qq}.json`);
    return;
}
async function get_ningmenghome_img(e, thing_type) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let commodities_list = data.commodities_list;
    if (thing_type != '') {
        if (thing_type == '装备' ||
            thing_type == '丹药' ||
            thing_type == '功法' ||
            thing_type == '道具' ||
            thing_type == '草药') {
            commodities_list = commodities_list.filter(item => item.class == thing_type);
        }
        else if (thing_type == '武器' ||
            thing_type == '护具' ||
            thing_type == '法宝' ||
            thing_type == '修为' ||
            thing_type == '血量' ||
            thing_type == '血气' ||
            thing_type == '天赋') {
            commodities_list = commodities_list.filter(item => item.type == thing_type);
        }
    }
    let ningmenghome_data = {
        user_id: usr_qq,
        commodities_list: commodities_list
    };
    let img = await puppeteer.screenshot('ningmenghome', e.UserId, ningmenghome_data);
    return img;
}
async function get_valuables_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let valuables_data = {
        user_id: usr_qq
    };
    let img = await puppeteer.screenshot('valuables', e.UserId, valuables_data);
    return img;
}
function Strand(now, max) {
    let num = ((now / max) * 100).toFixed(0);
    let mini = Number(num) > 100 ? 100 : num;
    let strand = {
        style: { width: `${mini}%` },
        num: num
    };
    return strand;
}
function bigNumberTransform(value) {
    const newValue = ['', '', ''];
    let fr = 1000;
    let num = 3;
    let text1 = '';
    let fm = 1;
    while (value / fr >= 1) {
        fr *= 10;
        num += 1;
    }
    if (num <= 4) {
        newValue[0] = Math.floor(value / 1000) + '';
        newValue[1] = '千';
    }
    else if (num <= 8) {
        text1 = Math.floor(num - 4) / 3 > 1 ? '千万' : '万';
        fm = text1 === '万' ? 10000 : 10000000;
        if (value % fm === 0) {
            newValue[0] = Math.floor(value / fm) + '';
        }
        else {
            newValue[0] = (value / fm).toFixed(2) + '';
        }
        newValue[1] = text1;
    }
    else if (num <= 16) {
        text1 = (num - 8) / 3 > 1 ? '千亿' : '亿';
        text1 = (num - 8) / 4 > 1 ? '万亿' : text1;
        text1 = (num - 8) / 7 > 1 ? '千万亿' : text1;
        fm = 1;
        if (text1 === '亿') {
            fm = 100000000;
        }
        else if (text1 === '千亿') {
            fm = 100000000000;
        }
        else if (text1 === '万亿') {
            fm = 1000000000000;
        }
        else if (text1 === '千万亿') {
            fm = 1000000000000000;
        }
        if (value % fm === 0) {
            newValue[0] = Math.floor(value / fm) + '';
        }
        else {
            newValue[0] = (value / fm).toFixed(2) + '';
        }
        newValue[1] = text1;
    }
    if (value < 1000) {
        newValue[0] = value + '';
        newValue[1] = '';
    }
    return newValue.join('');
}
function GetPower(atk, def, hp, bao) {
    let power = (atk + def * 0.8 + hp * 0.6) * (bao + 1);
    power = Math.floor(power);
    return power;
}
async function Add_仙宠(usr_qq, thing_name, n, thing_level = null) {
    let x = Number(n);
    if (x == 0) {
        return;
    }
    let najie = await Read_najie(usr_qq);
    let trr = najie.仙宠.find(item => item.name == thing_name && item.等级 == thing_level);
    let name = thing_name;
    if (x > 0 && !isNotNull(trr)) {
        let newthing = data.xianchon.find(item => item.name == name);
        if (!isNotNull(newthing)) {
            logger.info('没有这个东西');
            return;
        }
        if (thing_level != null) {
            newthing.等级 = thing_level;
        }
        najie.仙宠.push(newthing);
        najie.仙宠.find(item => item.name == name && item.等级 == newthing.等级).数量 = x;
        let xianchon = najie.仙宠.find(item => item.name == name && item.等级 == newthing.等级);
        najie.仙宠.find(item => item.name == name && item.等级 == newthing.等级).加成 = xianchon.等级 * xianchon.每级增加;
        najie.仙宠.find(item => item.name == name && item.等级 == newthing.等级).islockd = 0;
        await Write_najie(usr_qq, najie);
        return;
    }
    najie.仙宠.find(item => item.name == name && item.等级 == trr.等级).数量 += x;
    if (najie.仙宠.find(item => item.name == name && item.等级 == trr.等级).数量 < 1) {
        najie.仙宠 = najie.仙宠.filter(item => item.name != thing_name || item.等级 != trr.等级);
    }
    await Write_najie(usr_qq, najie);
    return;
}
async function get_danfang_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let danfang_list = data.danfang_list;
    let danfang_data = {
        user_id: usr_qq,
        danfang_list: danfang_list
    };
    let img = await puppeteer.screenshot('danfang', e.UserId, danfang_data);
    return img;
}
async function get_tuzhi_img(e) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let tuzhi_list = data.tuzhi_list;
    let tuzhi_data = {
        user_id: usr_qq,
        tuzhi_list: tuzhi_list
    };
    if (process.env.NODE_ENV === 'development') {
        const dir = './views';
        mkdirSync(dir, { recursive: true });
        writeFileSync(`${dir}/tuzhi.json`, JSON.stringify(tuzhi_data, null, 2));
    }
    let img = await puppeteer.screenshot('tuzhi', e.UserId, tuzhi_data);
    return img;
}
async function setu(e) {
    const Send = useSend(e);
    Send(Text(`玩命加载图片中,请稍后...   ` +
        '\n(一分钟后还没有出图片,大概率被夹了,这个功能谨慎使用,机器人容易寄)'));
    let url;
    url = 'https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0';
    let msg = [];
    let res;
    try {
        let response = await fetch(url);
        res = await response.json();
    }
    catch (error) {
        logger.info('Request Failed', error);
    }
    if (res !== '{}') {
        logger.info('res不为空');
    }
    else {
        logger.info('res为空');
    }
    let link = res.data[0].urls.original;
    link = link.replace('pixiv.cat', 'pixiv.re');
    let pid = res.data[0].pid;
    let uid = res.data[0].uid;
    let title = res.data[0].title;
    let author = res.data[0].author;
    let px = res.data[0].width + '*' + res.data[0].height;
    msg.push('User: ' +
        author +
        '\nUid: ' +
        uid +
        '\nTitle: ' +
        title +
        '\nPid: ' +
        pid +
        '\nPx: ' +
        px +
        '\nLink: ' +
        link);
    await sleep(1000);
    await Send(Text(msg.join('\n')));
    return true;
}
async function datachange(data) {
    if (data / 1000000000000 > 1) {
        return Math.floor((data * 100) / 1000000000000) / 100 + '万亿';
    }
    else if (data / 100000000 > 1) {
        return Math.floor((data * 100) / 100000000) / 100 + '亿';
    }
    else if (data / 10000 > 1) {
        return Math.floor((data * 100) / 10000) / 100 + '万';
    }
    else {
        return data.toString();
    }
}
async function Write_najie(usr_qq, najie) {
    let dir = path.join(__PATH.najie_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(najie);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Add_灵石(usr_qq, 灵石数量 = 0) {
    let player = await Read_player(usr_qq);
    if (!player)
        return;
    player.灵石 += Math.trunc(灵石数量);
    await Write_player(usr_qq, player);
    return;
}
async function Add_修为(usr_qq, 修为数量 = 0) {
    let player = await Read_player(usr_qq);
    if (!player)
        return;
    player.修为 += Math.trunc(修为数量);
    await Write_player(usr_qq, player);
    return;
}
async function Add_魔道值(usr_qq, 魔道值 = 0) {
    let player = await Read_player(usr_qq);
    if (!player)
        return;
    player.魔道值 += Math.trunc(魔道值);
    await Write_player(usr_qq, player);
    return;
}
async function Add_血气(usr_qq, 血气 = 0) {
    let player = await Read_player(usr_qq);
    if (!player)
        return;
    player.血气 += Math.trunc(血气);
    await Write_player(usr_qq, player);
    return;
}
async function Add_HP(usr_qq, blood = 0) {
    let player = await Read_player(usr_qq);
    if (!player)
        return;
    player.当前血量 += Math.trunc(blood);
    if (player.当前血量 > player.血量上限) {
        player.当前血量 = player.血量上限;
    }
    if (player.当前血量 < 0) {
        player.当前血量 = 0;
    }
    await Write_player(usr_qq, player);
    return;
}
async function Add_职业经验(usr_qq, exp = 0) {
    let player = await Read_player(usr_qq);
    if (exp == 0) {
        return;
    }
    exp = player.occupation_exp + exp;
    let level = player.occupation_level;
    while (true) {
        let need_exp = data.occupation_exp_list.find(item => item.id == level).experience;
        if (need_exp > exp) {
            break;
        }
        else {
            exp -= need_exp;
            level++;
        }
    }
    player.occupation_exp = exp;
    player.occupation_level = level;
    await Write_player(usr_qq, player);
    return;
}
async function Add_najie_灵石(usr_qq, lingshi) {
    let najie = await Read_najie(usr_qq);
    najie.灵石 += Math.trunc(lingshi);
    await Write_najie(usr_qq, najie);
    return;
}
async function Add_player_学习功法(usr_qq, gongfa_name) {
    let player = await Read_player(usr_qq);
    player.学习的功法.push(gongfa_name);
    data.setData('player', usr_qq, player);
    await player_efficiency(usr_qq);
    return;
}
async function Reduse_player_学习功法(usr_qq, gongfa_name) {
    let player = await Read_player(usr_qq);
    player.学习的功法 = player.学习的功法.filter(item => item != gongfa_name);
    data.setData('player', usr_qq, player);
    await player_efficiency(usr_qq);
    return;
}
async function player_efficiency(usr_qq) {
    const player = getPlayerDataSafe(usr_qq);
    if (!player) {
        return;
    }
    let ass;
    let Assoc_efficiency;
    let linggen_efficiency;
    let gongfa_efficiency = 0;
    let xianchong_efficiency = 0;
    if (!isNotNull(player.宗门)) {
        Assoc_efficiency = 0;
    }
    else {
        const zongmenName = typeof player.宗门 === 'string' ? player.宗门 : player.宗门?.宗门名称;
        ass = await data.getAssociation(zongmenName);
        if (ass === 'error' || Array.isArray(ass)) {
            Assoc_efficiency = 0;
        }
        else {
            if (ass.宗门驻地 == 0) {
                Assoc_efficiency = ass.宗门等级 * 0.05;
            }
            else {
                let dongTan = await data.bless_list.find(item => item.name == ass.宗门驻地);
                try {
                    Assoc_efficiency = ass.宗门等级 * 0.05 + dongTan.efficiency;
                }
                catch {
                    Assoc_efficiency = ass.宗门等级 * 0.05 + 0.5;
                }
            }
        }
    }
    linggen_efficiency = player.灵根.eff;
    label1: for (let i in player.学习的功法) {
        let gongfa = ['gongfa_list', 'timegongfa_list'];
        for (let j of gongfa) {
            let ifexist = data[j].find(item => item.name == player.学习的功法[i]);
            if (ifexist) {
                gongfa_efficiency += ifexist.修炼加成;
                continue label1;
            }
        }
        player.学习的功法.splice(Number(i), 1);
    }
    if (player.仙宠?.type == '修炼') {
        xianchong_efficiency = player.仙宠.加成;
    }
    let dy = await Read_danyao(usr_qq);
    let bgdan = dy.biguanxl;
    const currentXiulianEfficiency = Number(player.修炼效率提升 || 0);
    if (Math.floor(currentXiulianEfficiency) != Math.floor(currentXiulianEfficiency)) {
        player.修炼效率提升 = 0;
    }
    player.修炼效率提升 =
        (linggen_efficiency || 0) +
            Assoc_efficiency +
            gongfa_efficiency +
            xianchong_efficiency +
            bgdan;
    await setPlayerDataSafe(usr_qq, player);
    return;
}
async function re_najie_thing(usr_qq, thing_name, thing_class, thing_pinji, lock) {
    let najie = await Read_najie(usr_qq);
    if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
        for (let i of najie['装备']) {
            if (i.name == thing_name && i.pinji == thing_pinji)
                i.islockd = lock;
        }
    }
    else {
        for (let i of najie[thing_class]) {
            if (i.name == thing_name)
                i.islockd = lock;
        }
    }
    await Write_najie(usr_qq, najie);
    return true;
}
async function exist_najie_thing(usr_qq, thing_name, thing_class, thing_pinji = 0) {
    let najie = await Read_najie(usr_qq);
    let ifexist;
    if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
        ifexist = najie.装备.find(item => item.name == thing_name && item.pinji == thing_pinji);
    }
    else {
        let type = [
            '装备',
            '丹药',
            '道具',
            '功法',
            '草药',
            '材料',
            '仙宠',
            '仙宠口粮'
        ];
        for (let i of type) {
            ifexist = najie[i].find(item => item.name == thing_name);
            if (ifexist)
                break;
        }
    }
    if (ifexist) {
        return ifexist.数量;
    }
    return false;
}
async function Add_najie_thing(usr_qq, name, thing_class, x, pinji) {
    if (x == 0)
        return;
    let najie = await Read_najie(usr_qq);
    if (thing_class == '装备') {
        if (!pinji && pinji != 0) {
            pinji = Math.trunc(Math.random() * 6);
        }
        let z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];
        if (x > 0) {
            if (typeof name != 'object') {
                let list = [
                    'equipment_list',
                    'timeequipmen_list',
                    'duanzhaowuqi',
                    'duanzhaohuju',
                    'duanzhaobaowu'
                ];
                for (let i of list) {
                    let thing = data[i].find(item => item.name == name);
                    if (thing) {
                        let equ = JSON.parse(JSON.stringify(thing));
                        equ.pinji = pinji;
                        equ.atk *= z[pinji];
                        equ.def *= z[pinji];
                        equ.HP *= z[pinji];
                        equ.数量 = x;
                        equ.islockd = 0;
                        najie[thing_class].push(equ);
                        await Write_najie(usr_qq, najie);
                        return;
                    }
                }
            }
            else {
                if (!name.pinji)
                    name.pinji = pinji;
                name.数量 = x;
                name.islockd = 0;
                najie[thing_class].push(name);
                await Write_najie(usr_qq, najie);
                return;
            }
        }
        if (typeof name != 'object') {
            najie[thing_class].find(item => item.name == name && item.pinji == pinji).数量 += x;
        }
        else {
            najie[thing_class].find(item => item.name == name.name && item.pinji == pinji).数量 += x;
        }
        najie.装备 = najie.装备.filter(item => item.数量 > 0);
        await Write_najie(usr_qq, najie);
        return;
    }
    else if (thing_class == '仙宠') {
        if (x > 0) {
            if (typeof name != 'object') {
                let thing = data.xianchon.find(item => item.name == name);
                if (thing) {
                    thing = JSON.parse(JSON.stringify(thing));
                    thing.数量 = x;
                    thing.islockd = 0;
                    najie[thing_class].push(thing);
                    await Write_najie(usr_qq, najie);
                    return;
                }
            }
            else {
                name.数量 = x;
                name.islockd = 0;
                najie[thing_class].push(name);
                await Write_najie(usr_qq, najie);
                return;
            }
        }
        if (typeof name != 'object') {
            najie[thing_class].find(item => item.name == name).数量 += x;
        }
        else {
            najie[thing_class].find(item => item.name == name.name).数量 += x;
        }
        najie.仙宠 = najie.仙宠.filter(item => item.数量 > 0);
        await Write_najie(usr_qq, najie);
        return;
    }
    let exist = await exist_najie_thing(usr_qq, name, thing_class);
    if (x > 0 && !exist) {
        let thing;
        let list = [
            'danyao_list',
            'newdanyao_list',
            'timedanyao_list',
            'daoju_list',
            'gongfa_list',
            'timegongfa_list',
            'caoyao_list',
            'xianchonkouliang',
            'duanzhaocailiao'
        ];
        for (let i of list) {
            thing = data[i].find(item => item.name == name);
            if (thing) {
                najie[thing_class].push(thing);
                najie[thing_class].find(item => item.name == name).数量 = x;
                najie[thing_class].find(item => item.name == name).islockd = 0;
                await Write_najie(usr_qq, najie);
                return;
            }
        }
    }
    najie[thing_class].find(item => item.name == name).数量 += x;
    najie[thing_class] = najie[thing_class].filter(item => item.数量 > 0);
    await Write_najie(usr_qq, najie);
    return;
}
async function instead_equipment(usr_qq, equipment_data) {
    await Add_najie_thing(usr_qq, equipment_data, '装备', -1, equipment_data.pinji);
    let equipment = await Read_equipment(usr_qq);
    if (equipment_data.type == '武器') {
        await Add_najie_thing(usr_qq, equipment.武器, '装备', 1, equipment.武器.pinji);
        equipment.武器 = equipment_data;
        await Write_equipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == '护具') {
        await Add_najie_thing(usr_qq, equipment.护具, '装备', 1, equipment.护具.pinji);
        equipment.护具 = equipment_data;
        await Write_equipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == '法宝') {
        await Add_najie_thing(usr_qq, equipment.法宝, '装备', 1, equipment.法宝.pinji);
        equipment.法宝 = equipment_data;
        await Write_equipment(usr_qq, equipment);
        return;
    }
    return;
}
async function dujie(user_qq) {
    let usr_qq = user_qq;
    let player = await Read_player(usr_qq);
    if (!player)
        return 0;
    let new_blood = player.当前血量;
    let new_defense = player.防御;
    let new_attack = player.攻击;
    new_blood = new_blood / 100000;
    new_defense = new_defense / 100000;
    new_attack = new_attack / 100000;
    new_blood = (new_blood * 4) / 10;
    new_defense = (new_defense * 6) / 10;
    new_attack = (new_attack * 2) / 10;
    let N = new_blood + new_defense;
    let x = N * new_attack;
    if (player.灵根.type == '真灵根') {
        x = x * (1 + 0.5);
    }
    else if (player.灵根.type == '天灵根') {
        x = x * (1 + 0.75);
    }
    else {
        x = x * (1 + 1);
    }
    x = x.toFixed(2);
    return x;
}
function sortBy(field) {
    return function (b, a) {
        return a[field] - b[field];
    };
}
async function Get_xiuwei(usr_qq) {
    let player = await Read_player(usr_qq);
    let sum_exp = 0;
    let now_level_id;
    if (!isNotNull(player.level_id)) {
        return;
    }
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 65) {
        for (let i = 1; i < now_level_id; i++) {
            sum_exp = sum_exp + data.Level_list.find(temp => temp.level_id == i).exp;
        }
    }
    else {
        sum_exp = -999999999;
    }
    sum_exp += player.修为;
    return sum_exp;
}
async function get_random_talent() {
    let talent;
    if (get_random_res(体质概率)) {
        talent = data.talent_list.filter(item => item.type == '体质');
    }
    else if (get_random_res(伪灵根概率 / (1 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == '伪灵根');
    }
    else if (get_random_res(真灵根概率 / (1 - 伪灵根概率 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == '真灵根');
    }
    else if (get_random_res(天灵根概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == '天灵根');
    }
    else if (get_random_res(圣体概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率 - 天灵根概率))) {
        talent = data.talent_list.filter(item => item.type == '圣体');
    }
    else {
        talent = data.talent_list.filter(item => item.type == '变异灵根');
    }
    let newtalent = get_random_fromARR(talent);
    return newtalent;
}
function get_random_res(P) {
    if (P > 1) {
        P = 1;
    }
    if (P < 0) {
        P = 0;
    }
    let rand = Math.random();
    if (rand < P) {
        return true;
    }
    return false;
}
function get_random_fromARR(ARR) {
    let randindex = Math.trunc(Math.random() * ARR.length);
    return ARR[randindex];
}
async function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
function timestampToTime(timestamp) {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y + M + D + h + m + s;
}
async function shijianc(time) {
    let dateobj = {};
    let date = new Date(time);
    dateobj.Y = date.getFullYear();
    dateobj.M = date.getMonth() + 1;
    dateobj.D = date.getDate();
    dateobj.h = date.getHours();
    dateobj.m = date.getMinutes();
    dateobj.s = date.getSeconds();
    return dateobj;
}
async function getLastsign(usr_qq) {
    let time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastsign_time');
    if (time != null) {
        let data = await shijianc(parseInt(time));
        return data;
    }
    return false;
}
async function getPlayerAction(usr_qq) {
    let arr = {};
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = Math.floor((action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            arr.action = action.action;
            arr.time = m + '分' + s + '秒';
            return arr;
        }
    }
    arr.action = '空闲';
    return arr;
}
async function dataverification(e) {
    if (e.name !== 'message.create') {
        return 1;
    }
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return 1;
    }
    return 0;
}
function isNotNull(obj) {
    if (obj == undefined || obj == null)
        return false;
    return true;
}
function isNotBlank(value) {
    if (value ?? '' !== '') {
        return true;
    }
    else {
        return false;
    }
}
async function Read_qinmidu() {
    let dir = path.join(`${__PATH.qinmidu}/qinmidu.json`);
    let qinmidu = fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(qinmidu);
    return data;
}
async function Write_qinmidu(qinmidu) {
    let dir = path.join(__PATH.qinmidu, `qinmidu.json`);
    let new_ARR = JSON.stringify(qinmidu);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function fstadd_qinmidu(A, B) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    }
    catch {
        await Write_qinmidu([]);
        qinmidu = await Read_qinmidu();
    }
    let player = {
        QQ_A: A,
        QQ_B: B,
        亲密度: 0,
        婚姻: 0
    };
    qinmidu.push(player);
    await Write_qinmidu(qinmidu);
    return;
}
async function add_qinmidu(A, B, qinmi) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    }
    catch {
        await Write_qinmidu([]);
        qinmidu = await Read_qinmidu();
    }
    let i;
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) ||
            (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)) {
            break;
        }
    }
    if (i == qinmidu.length) {
        await fstadd_qinmidu(A, B);
        qinmidu = await Read_qinmidu();
    }
    qinmidu[i].亲密度 += qinmi;
    await Write_qinmidu(qinmidu);
    return;
}
async function find_qinmidu(A, B) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    }
    catch {
        await Write_qinmidu([]);
        qinmidu = await Read_qinmidu();
    }
    let i;
    let QQ = [];
    for (i = 0; i < qinmidu.length; i++) {
        if (qinmidu[i].QQ_A == A || qinmidu[i].QQ_A == B) {
            if (qinmidu[i].婚姻 != 0) {
                QQ.push = qinmidu[i].QQ_B;
                break;
            }
        }
        else if (qinmidu[i].QQ_B == A || qinmidu[i].QQ_B == B) {
            if (qinmidu[i].婚姻 != 0) {
                QQ.push = qinmidu[i].QQ_A;
                break;
            }
        }
    }
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) ||
            (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)) {
            break;
        }
    }
    if (i == qinmidu.length) {
        return false;
    }
    else if (QQ.length != 0) {
        return 0;
    }
    else {
        return qinmidu[i].亲密度;
    }
}
async function exist_hunyin(A) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    }
    catch {
        await Write_qinmidu([]);
        qinmidu = await Read_qinmidu();
    }
    let i = 0;
    let flag = '';
    for (i = 0; i < qinmidu.length; i++) {
        if (qinmidu[i].QQ_A == A) {
            if (qinmidu[i].婚姻 != 0) {
                flag = qinmidu[i].QQ_B;
                break;
            }
        }
        else if (qinmidu[i].QQ_B == A) {
            if (qinmidu[i].婚姻 != 0) {
                flag = qinmidu[i].QQ_A;
                break;
            }
        }
    }
    return flag;
}
async function Write_shitu(shitu) {
    let dir = path.join(__PATH.shitu, `shitu.json`);
    let new_ARR = JSON.stringify(shitu);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Read_shitu() {
    let dir = path.join(`${__PATH.shitu}/shitu.json`);
    let shitu = fs.readFileSync(dir, 'utf8');
    shitu = JSON.parse(shitu);
    return shitu;
}
async function fstadd_shitu(A) {
    let shitu;
    try {
        shitu = await Read_shitu();
    }
    catch {
        await Write_shitu([]);
        shitu = await Read_shitu();
    }
    let player = {
        师傅: A,
        收徒: 0,
        未出师徒弟: 0,
        任务阶段: 0,
        renwu1: 0,
        renwu2: 0,
        renwu3: 0,
        师徒BOOS剩余血量: 100000000,
        已出师徒弟: []
    };
    shitu.push(player);
    await Write_shitu(shitu);
    return;
}
async function add_shitu(A, num) {
    let shitu;
    try {
        shitu = await Read_shitu();
    }
    catch {
        await Write_shitu([]);
        shitu = await Read_shitu();
    }
    let i;
    for (i = 0; i < shitu.length; i++) {
        if (shitu[i].A == A) {
            break;
        }
    }
    if (i == shitu.length) {
        await fstadd_shitu(A);
        shitu = await Read_shitu();
    }
    shitu[i].收徒 += num;
    await Write_shitu(shitu);
    return;
}
async function find_shitu(A) {
    let shitu;
    try {
        shitu = await Read_shitu();
    }
    catch {
        await Write_shitu([]);
        shitu = await Read_shitu();
    }
    let i;
    let QQ = [];
    for (i = 0; i < shitu.length; i++) {
        if (shitu[i].师傅 == A) {
            break;
        }
    }
    if (i == shitu.length) {
        return false;
    }
    else if (QQ.length != 0) {
        return 0;
    }
    else {
        return shitu[i].师徒;
    }
}
async function find_tudi(A) {
    let shitu;
    shitu = await Read_shitu();
    let i;
    let QQ = [];
    for (i = 0; i < shitu.length; i++) {
        if (shitu[i].未出师徒弟 == A) {
            break;
        }
    }
    if (i == shitu.length) {
        return false;
    }
    else if (QQ.length != 0) {
        return 0;
    }
    else {
        return shitu[i].师徒;
    }
}
async function Read_danyao(usr_qq) {
    let dir = path.join(`${__PATH.danyao_path}/${usr_qq}.json`);
    let danyao = fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(danyao);
    return data;
}
async function Write_danyao(usr_qq, danyao) {
    let dir = path.join(__PATH.danyao_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(danyao);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Read_temp() {
    let dir = path.join(`${__PATH.temp_path}/temp.json`);
    let temp = fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(temp);
    return data;
}
async function Write_temp(temp) {
    let dir = path.join(__PATH.temp_path, `temp.json`);
    let new_ARR = JSON.stringify(temp);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Go(e) {
    let usr_qq = e.UserId;
    const Send = useSend(e);
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return 0;
    }
    let game_action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':game_action');
    if (game_action == 0) {
        Send(Text('修仙：游戏进行中...'));
        return 0;
    }
    let action = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = Math.floor((action_end_time - now_time) / 1000 / 60);
            let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return 0;
        }
    }
    return true;
}
async function Write_shop(shop) {
    let dir = path.join(__PATH.shop, `shop.json`);
    let new_ARR = JSON.stringify(shop);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Read_shop() {
    let dir = path.join(`${__PATH.shop}/shop.json`);
    let shop = fs.readFileSync(dir, 'utf8');
    const data = JSON.parse(shop);
    return data;
}
async function existshop(didian) {
    let shop = await Read_shop();
    let i;
    let thing = [];
    for (i = 0; i < shop.length; i++) {
        if (shop[i].name == didian) {
            break;
        }
    }
    for (let j = 0; j < shop[i].one.length; j++) {
        if (shop[i].one[j].数量 > 0) {
            thing.push(shop[i].one[j]);
        }
    }
    if (thing.length > 0) {
        return thing;
    }
    else {
        return false;
    }
}
async function zd_battle(AA_player, BB_player) {
    let A_player = JSON.parse(JSON.stringify(BB_player));
    let B_player = JSON.parse(JSON.stringify(AA_player));
    let cnt = 0;
    let cnt2;
    let A_xue = 0;
    let B_xue = 0;
    let t;
    let msg = [];
    let jineng1 = data.jineng1;
    let jineng2 = data.jineng2;
    let wuxing = ['金', '木', '土', '水', '火'];
    let type = ['武器', '护具', '法宝'];
    if (A_player.隐藏灵根 && A_player.id) {
        let buff = 1;
        let wx = [];
        let equ = await Read_equipment(A_player.id);
        for (let i of wuxing)
            if (A_player.隐藏灵根.name.includes(i))
                wx.push(i);
        for (let i of type) {
            if (equ[i].id > 0 && equ[i].id < 6)
                buff += kezhi(equ[i].id, wx);
        }
        A_player.攻击 = Math.trunc(A_player.攻击 * buff);
        A_player.防御 = Math.trunc(A_player.防御 * buff);
        A_player.当前血量 = Math.trunc(A_player.当前血量 * buff);
        msg.push(`${A_player.名号}与装备产生了共鸣,自身全属性提高${Math.trunc((buff - 1) * 100)}%`);
    }
    if (B_player.隐藏灵根 && B_player.id) {
        let wx = [];
        let buff = 1;
        let equ = await Read_equipment(B_player.id);
        for (let i of wuxing)
            if (B_player.隐藏灵根.name.includes(i))
                wx.push(i);
        for (let i of type) {
            if (equ[i].id > 0 && equ[i].id < 6)
                buff += kezhi(equ[i].id, wx);
        }
        B_player.攻击 = Math.trunc(B_player.攻击 * buff);
        B_player.防御 = Math.trunc(B_player.防御 * buff);
        B_player.当前血量 = Math.trunc(B_player.当前血量 * buff);
        msg.push(`${B_player.名号}与装备产生了共鸣,自身全属性提高${Math.trunc((buff - 1) * 100)}%`);
    }
    if (B_player.魔道值 > 999) {
        let buff = Math.trunc(B_player.魔道值 / 1000) / 100 + 1;
        if (buff > 1.3)
            buff = 1.3;
        if (B_player.灵根.name == '九重魔功')
            buff += 0.2;
        msg.push('魔道值为' +
            B_player.名号 +
            '提供了' +
            Math.trunc((buff - 1) * 100) +
            '%的增伤');
    }
    else if (B_player.魔道值 < 1 &&
        (B_player.灵根.type == '转生' || B_player.level_id > 41)) {
        let buff = B_player.神石 * 0.0015;
        if (buff > 0.3)
            buff = 0.3;
        if (B_player.灵根.name == '九转轮回体')
            buff += 0.2;
        msg.push('神石为' + B_player.名号 + '提供了' + Math.trunc(buff * 100) + '%的减伤');
    }
    if (A_player.魔道值 > 999) {
        let buff = Math.trunc(A_player.魔道值 / 1000) / 100 + 1;
        if (buff > 1.3)
            buff = 1.3;
        if (A_player.灵根.name == '九重魔功')
            buff += 0.2;
        msg.push('魔道值为' +
            A_player.名号 +
            '提供了' +
            Math.trunc((buff - 1) * 100) +
            '%的增伤');
    }
    else if (A_player.魔道值 < 1 &&
        (A_player.灵根.type == '转生' || A_player.level_id > 41)) {
        let buff = A_player.神石 * 0.0015;
        if (buff > 0.3)
            buff = 0.3;
        if (A_player.灵根.name == '九转轮回体')
            buff += 0.2;
        msg.push('神石为' + A_player.名号 + '提供了' + Math.trunc(buff * 100) + '%的减伤');
    }
    while (A_player.当前血量 > 0 && B_player.当前血量 > 0) {
        cnt2 = Math.trunc(cnt / 2);
        let Random = Math.random();
        let random = Math.random();
        let buff = 1;
        t = A_player;
        A_player = B_player;
        B_player = t;
        let baoji = baojishanghai(A_player.暴击率);
        if (isNotNull(A_player.仙宠)) {
            if (A_player.仙宠.type == '暴伤')
                baoji += A_player.仙宠.加成;
            else if (A_player.仙宠.type == '战斗') {
                let ran = Math.random();
                if (ran < 0.35) {
                    A_player.攻击 += Math.trunc(A_player.攻击 * A_player.仙宠.加成);
                    A_player.防御 += Math.trunc(A_player.防御 * A_player.仙宠.加成);
                    msg.push('仙宠【' +
                        A_player.仙宠.name +
                        '】辅佐了[' +
                        A_player.名号 +
                        ']，使其伤害增加了[' +
                        Math.trunc(A_player.仙宠.加成 * 100) +
                        '%]');
                }
            }
        }
        if (isNotNull(A_player.id)) {
            let equipment = await Read_equipment(A_player.id);
            let ran = Math.random();
            if (equipment.武器.name == '紫云剑' && ran > 0.7) {
                A_player.攻击 *= 3;
                msg.push(`${A_player.名号}触发了紫云剑被动,攻击力提高了200%`);
            }
            else if (equipment.武器.name == '炼血竹枪' && ran > 0.75) {
                A_player.攻击 *= 2;
                A_player.当前血量 = Math.trunc(A_player.当前血量 * 1.2);
                msg.push(`${A_player.名号}触发了炼血竹枪被动,攻击力提高了100%,血量回复了20%`);
            }
            else if (equipment.武器.name == '少阴玉剑' && ran > 0.85) {
                A_player.当前血量 = Math.trunc(A_player.当前血量 * 1.4);
                msg.push(`${A_player.名号}触发了少阴玉剑被动,血量回复了40%`);
            }
        }
        let 伤害 = Harm(A_player.攻击 * 0.85, B_player.防御);
        let 法球伤害 = Math.trunc(A_player.攻击 * A_player.法球倍率);
        伤害 = Math.trunc(baoji * 伤害 + 法球伤害 + A_player.防御 * 0.1);
        let count = 0;
        for (let i = 0; i < jineng1.length; i++) {
            if ((jineng1[i].class == '常驻' &&
                (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) &&
                Random < jineng1[i].pr) ||
                (A_player.学习的功法 &&
                    jineng1[i].class == '功法' &&
                    A_player.学习的功法.indexOf(jineng1[i].name) > -1 &&
                    (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) &&
                    Random < jineng1[i].pr) ||
                (A_player.灵根 &&
                    jineng1[i].class == '灵根' &&
                    A_player.灵根.name == jineng1[i].name &&
                    (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) &&
                    Random < jineng1[i].pr)) {
                if (jineng1[i].msg2 == '') {
                    msg.push(A_player.名号 + jineng1[i].msg1);
                }
                else {
                    msg.push(A_player.名号 + jineng1[i].msg1 + B_player.名号 + jineng1[i].msg2);
                }
                伤害 = 伤害 * jineng1[i].beilv + jineng1[i].other;
                count++;
            }
            if (count == 3)
                break;
        }
        for (let i = 0; i < jineng2.length; i++) {
            if ((B_player.学习的功法 &&
                jineng2[i].class == '功法' &&
                B_player.学习的功法.indexOf(jineng2[i].name) > -1 &&
                (cnt2 == jineng2[i].cnt || jineng2[i].cnt == -1) &&
                random < jineng2[i].pr) ||
                (B_player.灵根 &&
                    jineng2[i].class == '灵根' &&
                    B_player.灵根.name == jineng2[i].name &&
                    (cnt2 == jineng2[i].cnt || jineng2[i].cnt == -1) &&
                    random < jineng2[i].pr)) {
                if (jineng2[i].msg2 == '') {
                    msg.push(B_player.名号 + jineng2[i].msg1);
                }
                else {
                    msg.push(B_player.名号 + jineng2[i].msg1 + A_player.名号 + jineng2[i].msg2);
                }
                伤害 = 伤害 * jineng2[i].beilv + jineng2[i].other;
            }
        }
        if (A_player.魔道值 > 999) {
            buff += Math.trunc(A_player.魔道值 / 1000) / 100;
            if (buff > 1.3)
                buff = 1.3;
            if (A_player.灵根.name == '九重魔功')
                buff += 0.2;
        }
        if (B_player.魔道值 < 1 &&
            (B_player.灵根.type == '转生' || B_player.level_id > 41)) {
            let buff2 = B_player.神石 * 0.0015;
            if (buff2 > 0.3)
                buff2 = 0.3;
            if (B_player.灵根.name == '九转轮回体')
                buff2 += 0.2;
            buff -= buff2;
        }
        伤害 = Math.trunc(伤害 * buff);
        B_player.当前血量 -= 伤害;
        if (B_player.当前血量 < 0) {
            B_player.当前血量 = 0;
        }
        if (cnt % 2 == 0) {
            A_player.防御 = AA_player.防御;
            A_player.攻击 = AA_player.攻击;
        }
        else {
            A_player.攻击 = BB_player.攻击;
            A_player.防御 = BB_player.防御;
        }
        msg.push(`第${cnt2 + 1}回合：
  ${A_player.名号}攻击了${B_player.名号}，${ifbaoji(baoji)}造成伤害${伤害}，${B_player.名号}剩余血量${B_player.当前血量}`);
        cnt++;
    }
    if (cnt % 2 == 0) {
        t = A_player;
        A_player = B_player;
        B_player = t;
    }
    if (A_player.当前血量 <= 0) {
        AA_player.当前血量 = 0;
        msg.push(`${BB_player.名号}击败了${AA_player.名号}`);
        B_xue = B_player.当前血量 - BB_player.当前血量;
        A_xue = -AA_player.当前血量;
    }
    else if (B_player.当前血量 <= 0) {
        BB_player.当前血量 = 0;
        msg.push(`${AA_player.名号}击败了${BB_player.名号}`);
        B_xue = -BB_player.当前血量;
        A_xue = A_player.当前血量 - AA_player.当前血量;
    }
    let Data_nattle = { msg: msg, A_xue: A_xue, B_xue: B_xue };
    return Data_nattle;
}
function baojishanghai(baojilv) {
    if (baojilv > 1) {
        baojilv = 1;
    }
    let rand = Math.random();
    let bl = 1;
    if (rand < baojilv) {
        bl = baojilv + 1.5;
    }
    return bl;
}
function Harm(atk, def) {
    let x;
    let s = atk / def;
    let rand = Math.trunc(Math.random() * 11) / 100 + 0.95;
    if (s < 1) {
        x = 0.1;
    }
    else if (s > 2.5) {
        x = 1;
    }
    else {
        x = 0.6 * s - 0.5;
    }
    x = Math.trunc(x * atk * rand);
    return x;
}
function kezhi(equ, wx) {
    let wuxing = ['金', '木', '土', '水', '火', '金'];
    let equ_wx = wuxing[equ - 1];
    for (let j of wx) {
        if (j == equ_wx)
            return 0.04;
    }
    for (let j of wx)
        for (let i = 0; i < wuxing.length - 1; i++) {
            if (wuxing[i] == equ_wx && wuxing[i + 1] == j)
                return -0.02;
        }
    return 0;
}
function ifbaoji(baoji) {
    if (baoji == 1) {
        return '';
    }
    else {
        return '触发暴击，';
    }
}
async function Write_Exchange(wupin) {
    let dir = path.join(__PATH.Exchange, `Exchange.json`);
    let new_ARR = JSON.stringify(wupin);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Write_Forum(wupin) {
    let dir = path.join(__PATH.Exchange, `Forum.json`);
    let new_ARR = JSON.stringify(wupin);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Read_Exchange() {
    let dir = path.join(`${__PATH.Exchange}/Exchange.json`);
    let Exchange = fs.readFileSync(dir, 'utf8');
    Exchange = JSON.parse(Exchange);
    return Exchange;
}
async function Read_Forum() {
    let dir = path.join(`${__PATH.Exchange}/Forum.json`);
    let Forum = fs.readFileSync(dir, 'utf8');
    Forum = JSON.parse(Forum);
    return Forum;
}
async function get_supermarket_img(e, thing_class) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let Exchange_list;
    try {
        Exchange_list = await Read_Exchange();
    }
    catch {
        await Write_Exchange([]);
        Exchange_list = await Read_Exchange();
    }
    for (let i = 0; i < Exchange_list.length; i++) {
        Exchange_list[i].num = i + 1;
    }
    if (thing_class) {
        Exchange_list = Exchange_list.filter(item => item.name.class == thing_class);
    }
    Exchange_list.sort(function (a, b) {
        return b.now_time - a.now_time;
    });
    let supermarket_data = {
        user_id: usr_qq,
        Exchange_list: Exchange_list
    };
    let img = await puppeteer.screenshot('supermarket', e.UserId, supermarket_data);
    return img;
}
async function get_forum_img(e, thing_class) {
    let usr_qq = e.UserId;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) {
        return;
    }
    let Forum;
    try {
        Forum = await Read_Forum();
    }
    catch {
        await Write_Forum([]);
        Forum = await Read_Forum();
    }
    for (let i = 0; i < Forum.length; i++) {
        Forum[i].num = i + 1;
    }
    if (thing_class) {
        Forum = Forum.filter(item => item.class == thing_class);
    }
    Forum.sort(function (a, b) {
        return b.now_time - a.now_time;
    });
    let forum_data = {
        user_id: usr_qq,
        Forum: Forum
    };
    let img = await puppeteer.screenshot('forum', e.UserId, forum_data);
    return img;
}
async function openAU() {
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const random = Math.floor(Math.random() * data.xingge[0].one.length);
    const thing_data = data.xingge[0].one[random];
    const thing_value = Math.floor(thing_data.出售价);
    const thing_amount = 1;
    const now_time = new Date().getTime();
    const groupList = await redis.smembers(redisGlKey);
    const wupin = {
        thing: thing_data,
        start_price: thing_value,
        last_price: thing_value,
        amount: thing_amount,
        last_offer_price: now_time,
        last_offer_player: 0,
        groupList
    };
    await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(wupin));
    return wupin;
}
async function jindi(e, weizhi, addres) {
    let adr = addres;
    const Send = useSend(e);
    let msg = ['***' + adr + '***'];
    for (let i = 0; i < weizhi.length; i++) {
        msg.push(weizhi[i].name +
            '\n' +
            '等级：' +
            weizhi[i].Grade +
            '\n' +
            '极品：' +
            weizhi[i].Best[0] +
            '\n' +
            '灵石：' +
            weizhi[i].Price +
            '灵石' +
            '\n' +
            '修为：' +
            weizhi[i].experience +
            '修为');
    }
    Send(Text(msg.join('\n')));
}
async function Goweizhi(e, weizhi, addres) {
    let adr = addres;
    const Send = useSend(e);
    let msg = ['***' + adr + '***'];
    for (let i = 0; i < weizhi.length; i++) {
        msg.push(weizhi[i].name +
            '\n' +
            '等级：' +
            weizhi[i].Grade +
            '\n' +
            '极品：' +
            weizhi[i].Best[0] +
            '\n' +
            '灵石：' +
            weizhi[i].Price +
            '灵石');
    }
    Send(Text(msg.join('\n')));
}
async function setFileValue(user_qq, num, type) {
    let user_data = data.getData('player', user_qq);
    if (user_data === 'error' || Array.isArray(user_data)) {
        return;
    }
    const player = user_data;
    let current_num = player[type] || 0;
    let new_num = current_num + num;
    if (type == '当前血量' && new_num > player.血量上限) {
        new_num = player.血量上限;
    }
    player[type] = new_num;
    await data.setData('player', user_qq, player);
    return;
}
async function Synchronization_ASS(e) {
    if (!e.IsMaster) {
        return;
    }
    const Send = useSend(e);
    Send(Text('宗门开始同步'));
    let assList = [];
    let files = fs
        .readdirSync('./resources/data/association')
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        assList.push(file);
    }
    for (let ass_name of assList) {
        let ass = await data.getAssociation(ass_name);
        if (ass === 'error' || Array.isArray(ass)) {
            continue;
        }
        const association = ass;
        let playerData = data.getData('player', association.宗主);
        if (playerData === 'error' || Array.isArray(playerData)) {
            continue;
        }
        let player = playerData;
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id)
            ?.level_id || 1;
        if (!isNotNull(association.power)) {
            association.power = 0;
        }
        if (now_level_id < 42) {
            association.power = 0;
        }
        else {
            association.power = 1;
        }
        if (association.power == 1) {
            if (association.大阵血量 == 114514) {
                association.大阵血量 = 1145140;
            }
            let level = association.最低加入境界;
            if (level < 42) {
                association.最低加入境界 = 42;
            }
        }
        if (association.power == 0 && association.最低加入境界 > 41) {
            association.最低加入境界 = 41;
        }
        if (!isNotNull(association.宗门驻地)) {
            association.宗门驻地 = 0;
        }
        if (!isNotNull(association.宗门建设等级)) {
            association.宗门建设等级 = 0;
        }
        if (!isNotNull(association.宗门神兽)) {
            association.宗门神兽 = 0;
        }
        if (!isNotNull(association.副宗主)) {
            association.副宗主 = [];
        }
        await data.setAssociation(ass_name, association);
    }
    Send(Text('宗门同步结束'));
    return;
}
async function synchronization(e) {
    if (!e.IsMaster) {
        return;
    }
    const Send = useSend(e);
    Send(Text('存档开始同步'));
    let playerList = [];
    let files = fs
        .readdirSync('./resources/data/xiuxian_player')
        .filter(file => file.endsWith('.json'));
    for (let file of files) {
        file = file.replace('.json', '');
        playerList.push(file);
    }
    for (let player_id of playerList) {
        let usr_qq = player_id;
        let playerData = data.getData('player', usr_qq);
        if (playerData === 'error' || Array.isArray(playerData)) {
            continue;
        }
        let player = playerData;
        let najie = await Read_najie(usr_qq);
        let equipment = await Read_equipment(usr_qq);
        if (!najie || !equipment) {
            continue;
        }
        const ziduan = [
            '镇妖塔层数',
            '神魄段数',
            '魔道值',
            '师徒任务阶段',
            '师徒积分',
            'favorability',
            '血气',
            'lunhuiBH',
            'lunhui',
            '攻击加成',
            '防御加成',
            '生命加成',
            '幸运',
            '练气皮肤',
            '装备皮肤',
            'islucky',
            'sex',
            'addluckyNo',
            '神石'
        ];
        const ziduan2 = [
            'Physique_id',
            'linggenshow',
            'power_place',
            'occupation_level',
            '血量上限',
            '当前血量',
            '攻击',
            '防御'
        ];
        const ziduan3 = ['linggen', 'occupation', '仙宠'];
        const ziduan4 = ['材料', '草药', '仙宠', '仙宠口粮'];
        for (let k of ziduan) {
            if (!isNotNull(player[k])) {
                player[k] = 0;
            }
        }
        for (let k of ziduan2) {
            if (!isNotNull(player[k])) {
                player[k] = 1;
            }
        }
        for (let k of ziduan3) {
            if (!isNotNull(player[k])) {
                player[k] = [];
            }
        }
        for (let k of ziduan4) {
            if (!isNotNull(najie[k])) {
                najie[k] = [];
            }
        }
        if (!isNotNull(player.breakthrough)) {
            player.breakthrough = false;
        }
        if (!isNotNull(player.id)) {
            player.id = usr_qq;
        }
        if (!isNotNull(player.轮回点) || player.轮回点 > 10) {
            player.轮回点 = 10 - (player.lunhui || 0);
        }
        try {
            await Read_danyao(usr_qq);
        }
        catch {
            const arr = {
                biguan: 0,
                biguanxl: 0,
                xingyun: 0,
                lianti: 0,
                ped: 0,
                modao: 0,
                beiyong1: 0,
                beiyong2: 0,
                beiyong3: 0,
                beiyong4: 0,
                beiyong5: 0
            };
            await Write_danyao(usr_qq, arr);
        }
        const suoding = [
            '装备',
            '丹药',
            '道具',
            '功法',
            '草药',
            '材料',
            '仙宠',
            '仙宠口粮'
        ];
        for (let j of suoding) {
            const items = najie[j];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    if (!isNotNull(item.islockd)) {
                        item.islockd = 0;
                    }
                });
            }
        }
        if (player.仙宠?.id > 2930 && player.仙宠?.id < 2936) {
            player.仙宠.初始加成 = 0.002;
            player.仙宠.每级增加 = 0.002;
            player.仙宠.加成 = player.仙宠.每级增加 * (player.仙宠.等级 || 1);
            player.幸运 = (player.addluckyNo || 0) + player.仙宠.加成;
        }
        else {
            player.幸运 = player.addluckyNo || 0;
        }
        const najieXianchong = najie.仙宠;
        if (Array.isArray(najieXianchong)) {
            for (let j of najieXianchong) {
                if (j.id > 2930 && j.id < 2936) {
                    j.初始加成 = 0.002;
                    j.每级增加 = 0.002;
                }
            }
        }
        const wuqi = [
            '雾切之回光',
            '护摩之杖',
            '磐岩结绿',
            '三圣器·朗基努斯之枪'
        ];
        const wuqi2 = ['紫云剑', '炼血竹枪', '少阴玉剑', '纯阴金枪'];
        const najieEquipment = najie.装备;
        if (Array.isArray(najieEquipment)) {
            for (let j of najieEquipment) {
                for (let k in wuqi) {
                    if (j.name == wuqi[k]) {
                        j.name = wuqi2[k];
                    }
                    if (equipment.武器.name == wuqi[k])
                        equipment.武器.name = wuqi2[k];
                    if (equipment.法宝.name == wuqi[k])
                        equipment.法宝.name = wuqi2[k];
                }
            }
        }
        const najieKouliang = najie.仙宠口粮;
        if (Array.isArray(najieKouliang)) {
            for (let j of najieKouliang) {
                j.class = '仙宠口粮';
            }
        }
        const linggeng = data.talent_list.find(item => item.name == player.灵根?.name);
        if (linggeng)
            player.灵根 = linggeng;
        if (player.隐藏灵根) {
            const yincang = data.yincang.find(item => item.name == player.隐藏灵根?.name);
            if (yincang)
                player.隐藏灵根 = yincang;
        }
        const levelInfo = data.Level_list.find(item => item.level_id == player.level_id);
        const now_level_id = levelInfo?.level_id || 1;
        if (now_level_id < 42) {
            player.power_place = 1;
        }
        await Write_najie(usr_qq, najie);
        await Write_player(usr_qq, player);
        await Write_equipment(usr_qq, equipment);
    }
    Send(Text('存档同步结束'));
    return;
}
async function foundthing(thing_name) {
    let thing = [
        'equipment_list',
        'danyao_list',
        'daoju_list',
        'gongfa_list',
        'caoyao_list',
        'timegongfa_list',
        'timeequipmen_list',
        'timedanyao_list',
        'newdanyao_list',
        'xianchon',
        'xianchonkouliang',
        'duanzhaocailiao'
    ];
    for (let i of thing) {
        for (let j of data[i]) {
            if (j.name == thing_name)
                return j;
        }
    }
    let A;
    try {
        A = await Read_it();
    }
    catch {
        await Writeit([]);
        A = await Read_it();
    }
    for (let j of A) {
        if (j.name == thing_name)
            return j;
    }
    thing_name = thing_name.replace(/[0-9]+/g, '');
    thing = ['duanzhaowuqi', 'duanzhaohuju', 'duanzhaobaowu', 'zalei'];
    for (let i of thing) {
        for (let j of data[i]) {
            if (j.name == thing_name)
                return j;
        }
    }
    return false;
}

export { Add_HP, Add_najie_thing, Add_najie_灵石, Add_player_学习功法, Add_仙宠, Add_修为, Add_灵石, Add_职业经验, Add_血气, Add_魔道值, GetPower, Get_xiuwei, Go, Goweizhi, Harm, LevelTask, Read_Exchange, Read_Forum, Read_danyao, Read_equipment, Read_najie, Read_player, Read_qinmidu, Read_shitu, Read_shop, Read_temp, Read_updata_log, Reduse_player_学习功法, Synchronization_ASS, Write_Exchange, Write_Forum, Write_danyao, Write_equipment, Write_najie, Write_qinmidu, Write_shitu, Write_shop, Write_temp, __PATH, add_qinmidu, add_shitu, baojishanghai, bigNumberTransform, convert2integer, datachange, dataverification, dujie, exist_hunyin, exist_najie_thing, existplayer, existshop, find_qinmidu, find_shitu, find_tudi, fixed, foundthing, fstadd_qinmidu, fstadd_shitu, getLastsign, getPlayerAction, get_XianChong_img, get_adminset_img, get_association_img, get_danfang_img, get_danyao_img, get_daoju_img, get_equipment_img, get_forum_img, get_gongfa_img, get_najie_img, get_ningmenghome_img, get_player_img, get_power_img, get_random_fromARR, get_random_res, get_random_talent, get_ranking_money_img, get_ranking_power_img, get_state_img, get_statemax_img, get_statezhiye_img, get_supermarket_img, get_talent_img, get_tuzhi_img, get_valuables_img, get_wuqi_img, ifbaoji, instead_equipment, isNotBlank, isNotNull, jindi, kezhi, openAU, player_efficiency, re_najie_thing, setFileValue, setu, shijianc, sleep, sortBy, synchronization, timestampToTime, zd_battle };
