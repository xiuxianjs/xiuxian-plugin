import { Text } from 'alemonjs';
import { addNajieThing } from '../../../../model/najie.js';
import { addExp3, addExp2, addExp, addHP } from '../../../../model/economy.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { writePlayer, readPlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { readAll } from '../../../../model/duanzaofu.js';
import '../../../../model/currency.js';
import { readDanyao, writeDanyao } from '../../../../model/danyao.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import { thingType, toNumber } from './utils.js';

const handleHP = async (userId, thingName, thingExist, quantity, message) => {
    const nowPlayer = await readPlayer(userId);
    if (!nowPlayer) {
        return;
    }
    const HPp = toNumber(thingExist.HPp) || 1;
    const HP = toNumber(thingExist.HP);
    const blood = Math.trunc(nowPlayer.血量上限 * HPp + HP);
    await addHP(userId, quantity * blood);
    await addNajieThing(userId, thingName, '丹药', -quantity);
    const after = await readPlayer(userId);
    if (!after) {
        return;
    }
    void message.send(format(Text(`服用成功,当前血量为:${after.当前血量} `)));
};
const handleExp = async (userId, thingName, thingExist, quantity, message) => {
    const exp = toNumber(thingExist.exp);
    await addExp(userId, quantity * exp);
    void message.send(format(Text(`服用成功,修为增加${quantity * exp}`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
};
const handleXueqi = async (userId, thingName, thingExist, quantity, message) => {
    const xq = toNumber(thingExist.xueqi);
    await addExp2(userId, quantity * xq);
    void message.send(format(Text(`服用成功,血气增加${quantity * xq}`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
};
const handleXingyun = async (userId, thingName, thingExist, player, quantity, message) => {
    if (player.islucky && player.islucky > 0) {
        void message.send(format(Text('目前尚有福源丹在发挥效果，身体无法承受更多福源')));
        return;
    }
    const xingyun = toNumber(thingExist.xingyun);
    player.islucky = 10 * quantity;
    player.addluckyNo = xingyun;
    player.幸运 = (player.幸运 ?? 0) + xingyun;
    await writePlayer(userId, player);
    void message.send(format(Text(`${thingName}服用成功，将在之后的 ${quantity * 10}次冒险旅途中为你提高幸运值！`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
};
const handleBiguan = async (userId, thingName, thingExist, quantity, message) => {
    const dy = await readDanyao(userId);
    dy.biguan = quantity;
    dy.biguanxl = toNumber(thingExist.biguan);
    void message.send(format(Text(`${thingName}提高了你的忍耐力,提高了下次闭关的效率,当前提高${dy.biguanxl * 100}%\n查看练气信息后生效`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
    await writeDanyao(userId, dy);
};
const handleXianyuan = async (userId, thingName, thingExist, player, quantity, message) => {
    const dy = await readDanyao(userId);
    dy.ped = 5 * quantity;
    dy.beiyong1 = toNumber(thingExist.gailv);
    void message.send(format(Text(`${thingName}赐予${player.名号}仙缘,${player.名号}得到了仙兽的祝福`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
    await writeDanyao(userId, dy);
};
const handleNingxian = async (userId, thingName, thingExist, quantity, message) => {
    const dy = await readDanyao(userId);
    const addTimes = toNumber(thingExist.机缘) * quantity;
    if (dy.biguan > 0) {
        dy.biguan += addTimes;
    }
    if (dy.lianti > 0) {
        dy.lianti += addTimes;
    }
    if (dy.ped > 0) {
        dy.ped += addTimes;
    }
    if (dy.beiyong2 > 0) {
        dy.beiyong2 += addTimes;
    }
    void message.send(format(Text(`丹韵入体,身体内蕴含的仙丹药效增加了${addTimes}次`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
    await writeDanyao(userId, dy);
};
const handleLianshen = async (userId, thingName, thingExist, quantity, message) => {
    const dy = await readDanyao(userId);
    dy.lianti = quantity;
    dy.beiyong4 = toNumber(thingExist.lianshen);
    void message.send(format(Text(`服用了${thingName},获得了炼神之力,下次闭关获得了炼神之力,当前炼神之力为${dy.beiyong4 * 100}%`)));
    await writeDanyao(userId, dy);
    await addNajieThing(userId, thingName, '丹药', -quantity);
};
const handleShenci = async (userId, thingName, thingExist, player, quantity, message) => {
    const dy = await readDanyao(userId);
    dy.beiyong2 = quantity;
    dy.beiyong3 = toNumber(thingExist.概率);
    void message.send(format(Text(`${player.名号}获得了神兽的恩赐,赐福的概率增加了,当前剩余次数${dy.beiyong2}`)));
    await writeDanyao(userId, dy);
    await addNajieThing(userId, thingName, '丹药', -quantity);
};
const handleLinggen = async (userId, thingName, player, message) => {
    const list = await readAll('隐藏灵根');
    const newIndex = Math.floor(Math.random() * list.length);
    const next = list[newIndex];
    const hidden = {
        name: next.name,
        type: next.type,
        法球倍率: next.法球倍率 ?? 1,
        eff: next.eff
    };
    player.隐藏灵根 = hidden;
    await writePlayer(userId, player);
    void message.send(format(Text(`神药入体,${player.名号}更改了自己的隐藏灵根,当前隐藏灵根为[${player.隐藏灵根.name}]`)));
    await addNajieThing(userId, thingName, '丹药', -1);
};
const handleQiling = async (userId, thingName, thingExist, player, quantity, message) => {
    if (!player.锻造天赋) {
        void message.send(format(Text('请先去#炼器师能力评测,再来更改天赋吧')));
        return;
    }
    const addTalent = toNumber(thingExist.天赋) * quantity;
    player.锻造天赋 = (player.锻造天赋 || 0) + addTalent;
    void message.send(format(Text(`服用成功,您额外获得了${addTalent}天赋上限,您当前炼器天赋为${player.锻造天赋}`)));
    await writePlayer(userId, player);
    await addNajieThing(userId, thingName, '丹药', -quantity);
};
const handleDuanzaoLimit = async (userId, thingName, thingExist, quantity, message) => {
    const dy = await readDanyao(userId);
    if (dy.beiyong5 > 0) {
        void message.send(format(Text('您已经增加了锻造上限,消耗完毕再接着服用吧')));
        return;
    }
    dy.xingyun = quantity;
    dy.beiyong5 = toNumber(thingExist.额外数量);
    void message.send(format(Text(`服用成功,您下一次的炼器获得了额外的炼器格子[${dy.beiyong5}]`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
    await writeDanyao(userId, dy);
};
const handleModao = async (userId, thingName, thingExist, quantity, message, isReduce) => {
    const md = toNumber(thingExist.modao);
    const expChange = isReduce ? -quantity * md : quantity * md;
    await addExp3(userId, expChange);
    const action = isReduce ? '降低' : '增加';
    const desc = isReduce ? '获得了转生之力' : `${quantity}道黑色魔气入体`;
    void message.send(format(Text(`${desc},${action}了${Math.abs(expChange)}魔道值`)));
    await addNajieThing(userId, thingName, '丹药', -quantity);
};
const handleBugeng = async (userId, thingName, player, message) => {
    player.灵根 = {
        name: '垃圾五灵根',
        type: '伪灵根',
        eff: 0.01,
        法球倍率: 0.01
    };
    await writePlayer(userId, player);
    void message.send(format(Text('服用成功,当前灵根为垃圾五灵根,你具备了称帝资格')));
    await addNajieThing(userId, thingName, '丹药', -1);
};
const handleButian = async (userId, thingName, player, message) => {
    player.灵根 = { name: '天五灵根', type: '圣体', eff: 0.2, 法球倍率: 0.12 };
    await writePlayer(userId, player);
    void message.send(format(Text('服用成功,当前灵根为天五灵根,你具备了称帝资格')));
    await addNajieThing(userId, thingName, '丹药', -1);
};
const handleTupo = async (userId, thingName, player, message) => {
    if (player.breakthrough === true) {
        void message.send(format(Text('你已经吃过破境丹了')));
        return;
    }
    player.breakthrough = true;
    await writePlayer(userId, player);
    void message.send(format(Text('服用成功,下次突破概率增加20%')));
    await addNajieThing(userId, thingName, '丹药', -1);
};
const handleDanyao = async (userId, thingName, thingExist, player, quantity, message) => {
    const tType = thingType(thingExist);
    switch (tType) {
        case '血量':
            await handleHP(userId, thingName, thingExist, quantity, message);
            break;
        case '修为':
            await handleExp(userId, thingName, thingExist, quantity, message);
            break;
        case '血气':
            await handleXueqi(userId, thingName, thingExist, quantity, message);
            break;
        case '幸运':
            await handleXingyun(userId, thingName, thingExist, player, quantity, message);
            break;
        case '闭关':
            await handleBiguan(userId, thingName, thingExist, quantity, message);
            break;
        case '仙缘':
            await handleXianyuan(userId, thingName, thingExist, player, quantity, message);
            break;
        case '凝仙':
            await handleNingxian(userId, thingName, thingExist, quantity, message);
            break;
        case '炼神':
            await handleLianshen(userId, thingName, thingExist, quantity, message);
            break;
        case '神赐':
            await handleShenci(userId, thingName, thingExist, player, quantity, message);
            break;
        case '灵根':
            await handleLinggen(userId, thingName, player, message);
            break;
        case '器灵':
            await handleQiling(userId, thingName, thingExist, player, quantity, message);
            break;
        case '锻造上限':
            await handleDuanzaoLimit(userId, thingName, thingExist, quantity, message);
            break;
        case '魔道值':
            await handleModao(userId, thingName, thingExist, quantity, message, true);
            break;
        case '入魔':
            await handleModao(userId, thingName, thingExist, quantity, message, false);
            break;
        case '补根':
            await handleBugeng(userId, thingName, player, message);
            break;
        case '补天':
            await handleButian(userId, thingName, player, message);
            break;
        case '突破':
            await handleTupo(userId, thingName, player, message);
            break;
        default:
            return false;
    }
    return true;
};

export { handleDanyao };
