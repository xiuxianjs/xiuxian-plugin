import { createPlayerRepository } from './repository/playerRepository.js';
import { createNajieRepository } from './repository/najieRepository.js';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';
import { readDanyao } from './danyao.js';
import { notUndAndNull } from './common.js';
import { readPlayer } from './xiuxiandata.js';

const experienceList = (await getDataList('experience'));
const playerRepo = createPlayerRepository(() => experienceList);
const najieRepo = createNajieRepository();
async function addExp4(usrid, exp = 0) {
    if (exp === 0 || isNaN(exp)) {
        return;
    }
    await playerRepo.addOccupationExp(usrid, exp);
}
async function addConFaByUser(usrid, gongfaName) {
    const player = await readPlayer(usrid);
    if (!player) {
        return;
    }
    if (!Array.isArray(player.学习的功法)) {
        player.学习的功法 = [];
    }
    player.学习的功法.push(gongfaName);
    await setDataJSONStringifyByKey(keys.player(usrid), player);
    void playerEfficiency(usrid);
}
async function addBagCoin(usrid, lingshi) {
    const delta = Math.trunc(Number(lingshi));
    if (delta === 0) {
        return;
    }
    await najieRepo.addLingShi(usrid, delta);
}
async function playerEfficiency(userId) {
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return null;
    }
    let Assoc_efficiency;
    let linggen_efficiency = 0;
    let gongfa_efficiency = 0;
    let xianchong_efficiency = 0;
    if (!notUndAndNull(player.宗门)) {
        Assoc_efficiency = 0;
    }
    else {
        const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
        if (ass.宗门驻地 === 0) {
            Assoc_efficiency = ass.宗门等级 * 0.05;
        }
        else if (ass) {
            const dongTan = (await getDataList('Bless')).find(item => item.name === ass.宗门驻地);
            try {
                Assoc_efficiency = ass.宗门等级 * 0.05 + dongTan.efficiency;
            }
            catch {
                Assoc_efficiency = ass.宗门等级 * 0.05 + 0.5;
            }
        }
    }
    linggen_efficiency = player.灵根.eff;
    label1: for (const i in player.学习的功法) {
        const gongfa = ['Gongfa', 'TimeGongfa'];
        for (const j of gongfa) {
            const ifexist = (await getDataList(j)).find(item => item.name === player.学习的功法[i]);
            if (ifexist) {
                gongfa_efficiency += ifexist.修炼加成;
                continue label1;
            }
        }
        player.学习的功法.splice(+i, 1);
    }
    if (player.仙宠.type === '修炼') {
        xianchong_efficiency = player.仙宠.加成;
    }
    const dy = await readDanyao(userId);
    const bgdan = dy.biguanxl || 0;
    const efficiency = linggen_efficiency + Assoc_efficiency + gongfa_efficiency + xianchong_efficiency;
    const add = efficiency + bgdan;
    player.修炼效率提升 = add;
    await setDataJSONStringifyByKey(keys.player(userId), player);
}
var xiuxian_m = { playerEfficiency };

export { addBagCoin, addConFaByUser, addExp4, xiuxian_m as default, playerEfficiency };
