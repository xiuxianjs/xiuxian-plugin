export { addConFaByUser } from './xiuxian_impl.js';
import { getDataList } from './DataList.js';
import { readDanyao } from './danyao.js';
import { notUndAndNull } from './common.js';
import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

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
    player.修炼效率提升 =
        linggen_efficiency + Assoc_efficiency + gongfa_efficiency + xianchong_efficiency + bgdan;
    await setDataJSONStringifyByKey(keys.player(userId), player);
}
var efficiency = { playerEfficiency };

export { efficiency as default, playerEfficiency };
