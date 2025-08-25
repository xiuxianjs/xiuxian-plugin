import { writePlayer } from './pub.js';
import { readPlayer } from './xiuxian_impl.js';
import { addHP } from './economy.js';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

async function readEquipment(usr_qq) {
    return await getDataJSONParseByKey(keys.equipment(usr_qq));
}
async function writeEquipment(usr_qq, equipment) {
    const player = await readPlayer(usr_qq);
    if (!player) {
        return;
    }
    const levelList = await getDataList('Level1');
    const physiqueList = await getDataList('Level2');
    const levelInfo = levelList.find(item => item.level_id == player.level_id);
    const physiqueInfo = physiqueList.find(item => item.level_id == player.Physique_id);
    player.攻击
        = Number(levelInfo?.基础攻击 ?? 0)
            + Number(player.攻击加成 ?? 0)
            + Number(physiqueInfo?.基础攻击 ?? 0);
    player.防御
        = Number(levelInfo?.基础防御 ?? 0)
            + Number(player.防御加成 ?? 0)
            + Number(physiqueInfo?.基础防御 ?? 0);
    player.血量上限
        = Number(levelInfo?.基础血量 ?? 0)
            + Number(player.生命加成 ?? 0)
            + Number(physiqueInfo?.基础血量 ?? 0);
    player.暴击率 = Number(levelInfo?.基础暴击 ?? 0) + Number(physiqueInfo?.基础暴击 ?? 0);
    const types = ['武器', '护具', '法宝'];
    for (const t of types) {
        const equipItem = equipment[t];
        if (!equipItem) {
            continue;
        }
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
    if (player.暴击伤害 > 2.5) {
        player.暴击伤害 = 2.5;
    }
    if (player.仙宠.type == '暴伤') {
        player.暴击伤害 += player.仙宠.加成;
    }
    await writePlayer(usr_qq, player);
    await addHP(usr_qq, 0);
    await setDataJSONStringifyByKey(keys.equipment(usr_qq), equipment);
}
var equipment = { readEquipment, writeEquipment };

export { equipment as default, readEquipment, writeEquipment };
