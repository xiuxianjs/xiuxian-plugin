import { redis } from '../api/api.js';
import data from './XiuxianData.js';
import { readIt } from './duanzaofu.js';
import { useSend, Text } from 'alemonjs';
import { __PATH } from './paths.js';
import { writePlayer, writeIt } from './pub.js';
import * as _ from 'lodash-es';
import { getDataByUserId } from './Redis.js';

async function getPlayerDataSafe(usr_qq) {
    const playerData = await data.getData('player', usr_qq);
    if (!playerData || Array.isArray(playerData)) {
        return null;
    }
    return playerData;
}
function setPlayerDataSafe(usr_qq, player) {
    data.setData('player', usr_qq, player);
}
async function getEquipmentDataSafe(usr_qq) {
    const equipmentData = await data.getData('equipment', usr_qq);
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
    const res = await redis.exists(`${__PATH.player_path}:${usr_qq}`);
    return res === 1;
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
async function readPlayer(usr_qq) {
    const player = await redis.get(`${__PATH.player_path}:${usr_qq}`);
    if (!player) {
        return null;
    }
    const playerData = JSON.parse(decodeURIComponent(player));
    return playerData;
}
async function LevelTask(e, power_n, power_m, power_Grade, aconut) {
    const usr_qq = e.UserId;
    const Send = useSend(e);
    const msg = [Number(usr_qq).toString()];
    const player = await readPlayer(usr_qq);
    if (!player) {
        Send(Text('玩家数据不存在'));
        return 0;
    }
    let power_distortion = await dujie(usr_qq);
    const yaocaolist = ['凝血草', '小吉祥草', '大吉祥草'];
    for (const j in yaocaolist) {
        const num = await existNajieThing(usr_qq, yaocaolist[j], '草药');
        if (num) {
            msg.push(`[${yaocaolist[j]}]为你提高了雷抗\n`);
            power_distortion = Math.trunc(power_distortion * (1 + 0.2 * Number(j)));
            await addNajieThing(usr_qq, yaocaolist[j], '草药', -1);
        }
        let variable = Math.random() * (power_m - power_n) + power_n;
        variable = variable + aconut / 10;
        variable = Number(variable);
        if (power_distortion >= variable) {
            if (aconut >= power_Grade) {
                player.power_place = 0;
                await writePlayer(usr_qq, player);
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
                await writePlayer(usr_qq, player);
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
            await writePlayer(usr_qq, player);
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
async function readEquipment(usr_qq) {
    let equipment = await redis.get(`${__PATH.equipment_path}:${usr_qq}`);
    if (!equipment) {
        return null;
    }
    const data = JSON.parse(equipment);
    return data;
}
async function writeEquipment(usr_qq, equipment) {
    let player = await readPlayer(usr_qq);
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
    await writePlayer(usr_qq, player);
    await addHP(usr_qq, 0);
    redis.set(`${__PATH.equipment_path}:${usr_qq}`, JSON.stringify(equipment));
    return;
}
async function readNajie(usr_qq) {
    let najieData;
    let najie = await redis.get(`${__PATH.najie_path}:${usr_qq}`);
    if (!najie) {
        return null;
    }
    najieData = JSON.parse(najie);
    return najieData;
}
async function fixed(usr_qq) {
    return;
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
    let najie = await readNajie(usr_qq);
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
    await redis.set(`${__PATH.najie_path}:${usr_qq}`, JSON.stringify(najie));
    return;
}
async function addCoin(usr_qq, 灵石数量 = 0) {
    let player = await readPlayer(usr_qq);
    if (!player)
        return;
    player.灵石 += Math.trunc(灵石数量);
    await writePlayer(usr_qq, player);
    return;
}
async function addExp(usr_qq, 修为数量 = 0) {
    let player = await readPlayer(usr_qq);
    if (!player)
        return;
    player.修为 += Math.trunc(修为数量);
    await writePlayer(usr_qq, player);
    return;
}
async function addExp3(usr_qq, 魔道值 = 0) {
    let player = await readPlayer(usr_qq);
    if (!player)
        return;
    player.魔道值 += Math.trunc(魔道值);
    await writePlayer(usr_qq, player);
    return;
}
async function addExp2(usr_qq, 血气 = 0) {
    let player = await readPlayer(usr_qq);
    if (!player)
        return;
    player.血气 += Math.trunc(血气);
    await writePlayer(usr_qq, player);
    return;
}
async function addHP(usr_qq, blood = 0) {
    let player = await readPlayer(usr_qq);
    if (!player)
        return;
    player.当前血量 += Math.trunc(blood);
    if (player.当前血量 > player.血量上限) {
        player.当前血量 = player.血量上限;
    }
    if (player.当前血量 < 0) {
        player.当前血量 = 0;
    }
    await writePlayer(usr_qq, player);
    return;
}
async function addExp4(usr_qq, exp = 0) {
    let player = await readPlayer(usr_qq);
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
    await writePlayer(usr_qq, player);
    return;
}
async function addBagCoin(usr_qq, lingshi) {
    let najie = await readNajie(usr_qq);
    najie.灵石 += Math.trunc(lingshi);
    await Write_najie(usr_qq, najie);
    return;
}
async function addConFaByUser(usr_qq, gongfa_name) {
    let player = await readPlayer(usr_qq);
    player.学习的功法.push(gongfa_name);
    data.setData('player', usr_qq, player);
    await playerEfficiency(usr_qq);
    return;
}
async function reduseGonfaByUser(usr_qq, gongfa_name) {
    let player = await readPlayer(usr_qq);
    player.学习的功法 = player.学习的功法.filter(item => item != gongfa_name);
    data.setData('player', usr_qq, player);
    await playerEfficiency(usr_qq);
    return;
}
async function playerEfficiency(usr_qq) {
    const player = await getPlayerDataSafe(usr_qq);
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
        ass = await await data.getAssociation(zongmenName);
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
    let dy = await readDanyao(usr_qq);
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
async function updateBagThing(usr_qq, thing_name, thing_class, thing_pinji, lock) {
    let najie = await readNajie(usr_qq);
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
async function existNajieThing(usr_qq, thing_name, thing_class, thing_pinji = 0) {
    let najie = await readNajie(usr_qq);
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
async function addNajieThing(usr_qq, name, thing_class, x, pinji) {
    if (x == 0)
        return;
    let najie = await readNajie(usr_qq);
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
                        let equ = _.cloneDeep(thing);
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
            const fb = najie[thing_class].find(item => item.name == name && item.pinji == pinji);
            if (fb) {
                fb.数量 += x;
            }
        }
        else {
            const fb = najie[thing_class].find(item => item.name == name.name && item.pinji == pinji);
            if (fb) {
                fb.数量 += x;
            }
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
                    thing = _.cloneDeep(thing);
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
            const fb = najie[thing_class].find(item => item.name == name);
            if (fb) {
                fb.数量 += x;
            }
        }
        else {
            const fb = najie[thing_class].find(item => item.name == name.name);
            if (fb) {
                fb.数量 += x;
            }
        }
        najie.仙宠 = najie.仙宠.filter(item => item.数量 > 0);
        await Write_najie(usr_qq, najie);
        return;
    }
    let exist = await existNajieThing(usr_qq, name, thing_class);
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
                const fb = najie[thing_class].find(item => item.name == name);
                if (fb) {
                    fb.数量 = x;
                    fb.islockd = 0;
                }
                await Write_najie(usr_qq, najie);
                return;
            }
        }
    }
    const fb = najie[thing_class].find(item => item.name == name);
    if (fb) {
        fb.数量 += x;
    }
    najie[thing_class] = najie[thing_class].filter(item => item.数量 > 0);
    await Write_najie(usr_qq, najie);
    return;
}
async function insteadEquipment(usr_qq, equipment_data) {
    await addNajieThing(usr_qq, equipment_data, '装备', -1, equipment_data.pinji);
    let equipment = await readEquipment(usr_qq);
    if (equipment_data.type == '武器') {
        await addNajieThing(usr_qq, equipment.武器, '装备', 1, equipment.武器.pinji);
        equipment.武器 = equipment_data;
        await writeEquipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == '护具') {
        await addNajieThing(usr_qq, equipment.护具, '装备', 1, equipment.护具.pinji);
        equipment.护具 = equipment_data;
        await writeEquipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == '法宝') {
        await addNajieThing(usr_qq, equipment.法宝, '装备', 1, equipment.法宝.pinji);
        equipment.法宝 = equipment_data;
        await writeEquipment(usr_qq, equipment);
        return;
    }
    return;
}
async function dujie(user_qq) {
    let usr_qq = user_qq;
    let player = await readPlayer(usr_qq);
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
async function getAllExp(usr_qq) {
    let player = await readPlayer(usr_qq);
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
async function getRandomTalent() {
    let talent;
    if (getRandomRes(体质概率)) {
        talent = data.talent_list.filter(item => item.type == '体质');
    }
    else if (getRandomRes(伪灵根概率 / (1 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == '伪灵根');
    }
    else if (getRandomRes(真灵根概率 / (1 - 伪灵根概率 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == '真灵根');
    }
    else if (getRandomRes(天灵根概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == '天灵根');
    }
    else if (getRandomRes(圣体概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率 - 天灵根概率))) {
        talent = data.talent_list.filter(item => item.type == '圣体');
    }
    else {
        talent = data.talent_list.filter(item => item.type == '变异灵根');
    }
    let newtalent = getRandomFromARR(talent);
    return newtalent;
}
function getRandomRes(P) {
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
function getRandomFromARR(ARR) {
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
    const time = await getDataByUserId(usr_qq, 'lastsign_time');
    if (time != null) {
        let data = await shijianc(parseInt(time));
        return data;
    }
    return false;
}
async function getPlayerAction(usr_qq) {
    let arr = {};
    let action = await getDataByUserId(usr_qq, 'action');
    action = JSON.parse(action);
    if (action != null) {
        arr.action = action.action;
        arr.time = action.time;
        arr.end_time = action.end_time;
        return arr;
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
async function readQinmidu() {
    const qinmidu = await redis.get(`${__PATH.qinmidu}:qinmidu`);
    if (!qinmidu) {
        return [];
    }
    const data = JSON.parse(qinmidu);
    return data;
}
async function writeQinmidu(qinmidu) {
    await redis.set(`${__PATH.qinmidu}:qinmidu`, JSON.stringify(qinmidu));
    return;
}
async function fstaddQinmidu(A, B) {
    let qinmidu = [];
    try {
        qinmidu = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    let player = {
        QQ_A: A,
        QQ_B: B,
        亲密度: 0,
        婚姻: 0
    };
    qinmidu.push(player);
    await writeQinmidu(qinmidu);
    return;
}
async function addQinmidu(A, B, qinmi) {
    let qinmidu = [];
    try {
        qinmidu = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    let i;
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) ||
            (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)) {
            break;
        }
    }
    if (i == qinmidu.length) {
        await fstaddQinmidu(A, B);
        qinmidu = await readQinmidu();
    }
    qinmidu[i].亲密度 += qinmi;
    await writeQinmidu(qinmidu);
    return;
}
async function findQinmidu(A, B) {
    let qinmidu = [];
    try {
        qinmidu = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
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
async function existHunyin(A) {
    let qinmidu = [];
    try {
        qinmidu = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
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
async function writeShitu(shitu) {
    await redis.set(`${__PATH.shitu}:shitu`, JSON.stringify(shitu));
    return;
}
async function readShitu() {
    const shitu = await redis.get(`${__PATH.shitu}:shitu`);
    return JSON.parse(shitu);
}
async function fstaddShitu(A) {
    let shitu = [];
    try {
        shitu = await readShitu();
    }
    catch {
        await writeShitu([]);
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
    await writeShitu(shitu);
    return;
}
async function addShitu(A, num) {
    let shitu = [];
    try {
        shitu = await readShitu();
    }
    catch {
        await writeShitu([]);
    }
    let i;
    for (i = 0; i < shitu.length; i++) {
        if (shitu[i].A == A) {
            break;
        }
    }
    if (i == shitu.length) {
        await fstaddShitu(A);
        shitu = await readShitu();
    }
    shitu[i].收徒 += num;
    await writeShitu(shitu);
    return;
}
async function findShitu(A) {
    let shitu = [];
    try {
        shitu = await readShitu();
    }
    catch {
        await writeShitu([]);
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
async function findTudi(A) {
    let shitu;
    shitu = await readShitu();
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
async function readDanyao(usr_qq) {
    let danyao = await redis.get(`${__PATH.danyao_path}:${usr_qq}`);
    if (!danyao) {
        return [];
    }
    const data = JSON.parse(danyao);
    return data;
}
async function writeDanyao(usr_qq, danyao) {
    await redis.set(`${__PATH.danyao_path}:${usr_qq}`, JSON.stringify(danyao));
    return;
}
async function readTemp() {
    let temp = await redis.get(`${__PATH.temp_path}:temp`);
    if (!temp) {
        return [];
    }
    const data = JSON.parse(temp);
    return data;
}
async function writeTemp(temp) {
    await redis.set(`${__PATH.temp_path}:temp`, JSON.stringify(temp));
    return;
}
async function Go(e) {
    let usr_qq = e.UserId;
    const Send = useSend(e);
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return 0;
    }
    let game_action = await getDataByUserId(usr_qq, 'game_action');
    if (game_action == 1) {
        Send(Text('修仙：游戏进行中...'));
        return 0;
    }
    let action = await getDataByUserId(usr_qq, 'action');
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
async function writeShop(shop) {
    await redis.set(`${__PATH.shop}:shop`, JSON.stringify(shop));
    return;
}
async function readShop() {
    let shop = await redis.get(`${__PATH.shop}:shop`);
    if (!shop) {
        return [];
    }
    const data = JSON.parse(shop);
    return data;
}
async function existshop(didian) {
    let shop = await readShop();
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
async function zdBattle(AA_player, BB_player) {
    let A_player = _.cloneDeep(BB_player);
    let B_player = _.cloneDeep(AA_player);
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
        let equ = await readEquipment(A_player.id);
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
        let equ = await readEquipment(B_player.id);
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
            let equipment = await readEquipment(A_player.id);
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
async function writeExchange(wupin) {
    await redis.set(`${__PATH.Exchange}:Exchange`, JSON.stringify(wupin));
    return;
}
async function writeForum(wupin) {
    await redis.set(`${__PATH.Exchange}:Forum`, JSON.stringify(wupin));
    return;
}
async function readExchange() {
    let Exchange = await redis.get(`${__PATH.Exchange}:Exchange`);
    if (!Exchange) {
        return [];
    }
    const data = JSON.parse(Exchange);
    return data;
}
async function readForum() {
    let Forum = await redis.get(`${__PATH.Exchange}:Forum`);
    if (!Forum) {
        return [];
    }
    const data = JSON.parse(Forum);
    return data;
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
async function setFileValue(user_qq, num, type) {
    let user_data = await data.getData('player', user_qq);
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
    let A = [];
    try {
        A = await readIt();
    }
    catch {
        await writeIt([]);
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

export { Add_仙宠, GetPower, Go, Harm, LevelTask, Write_najie, __PATH, addBagCoin, addCoin, addConFaByUser, addExp, addExp2, addExp3, addExp4, addHP, addNajieThing, addQinmidu, addShitu, baojishanghai, bigNumberTransform, convert2integer, datachange, dataverification, dujie, existHunyin, existNajieThing, existplayer, existshop, findQinmidu, findShitu, findTudi, fixed, foundthing, fstaddQinmidu, fstaddShitu, getAllExp, getEquipmentDataSafe, getLastsign, getPlayerAction, getPlayerDataSafe, getRandomFromARR, getRandomRes, getRandomTalent, ifbaoji, insteadEquipment, isNotBlank, isNotNull, kezhi, openAU, playerEfficiency, readDanyao, readEquipment, readExchange, readForum, readNajie, readPlayer, readQinmidu, readShitu, readShop, readTemp, reduseGonfaByUser, setFileValue, setPlayerDataSafe, setu, shijianc, sleep, sortBy, timestampToTime, updateBagThing, writeDanyao, writeEquipment, writeExchange, writeForum, writeQinmidu, writeShitu, writeShop, writeTemp, zdBattle };
