import { createPlayerRepository } from './repository/playerRepository.js';
import { createNajieRepository } from './repository/najieRepository.js';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';
import type { GongfaItem } from '../types/model.js';
import { readDanyao } from './danyao.js';
import { notUndAndNull } from './common.js';
import { readPlayer } from './xiuxiandata.js';

const experienceList = (await getDataList('experience')) as Array<{
  id: number;
  name: string;
  experience: number;
  rate: number;
}>;

const playerRepo = createPlayerRepository(() => experienceList);
const najieRepo = createNajieRepository();

export async function addExp4(usrid: string, exp = 0) {
  if (exp === 0 || isNaN(exp)) {
    return;
  }
  await playerRepo.addOccupationExp(usrid, exp);
}

export async function addConFaByUser(usrid: string, gongfaName: string) {
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

export async function addBagCoin(usrid: string, lingshi: number) {
  const delta = Math.trunc(Number(lingshi));

  if (delta === 0) {
    return;
  }
  await najieRepo.addLingShi(usrid, delta);
}

export async function playerEfficiency(userId: string): Promise<null | undefined> {
  // 这里有问题
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return null;
  }
  let Assoc_efficiency; // 宗门效率加成
  let linggen_efficiency = 0; // 灵根效率加成
  let gongfa_efficiency = 0; // 功法效率加成
  let xianchong_efficiency = 0; // 仙宠效率加成

  if (!notUndAndNull(player.宗门)) {
    // 是否存在宗门信息
    Assoc_efficiency = 0; // 不存在，宗门效率为0
  } else {
    const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

    if (ass.宗门驻地 === 0) {
      Assoc_efficiency = ass.宗门等级 * 0.05;
    } else if (ass) {
      const dongTan = (await getDataList('Bless')).find(item => item.name === ass.宗门驻地);

      try {
        Assoc_efficiency = ass.宗门等级 * 0.05 + dongTan.efficiency;
      } catch {
        Assoc_efficiency = ass.宗门等级 * 0.05 + 0.5;
      }
    }
  }

  linggen_efficiency = player.灵根.eff; // 灵根修炼速率
  label1: for (const i in player.学习的功法) {
    // 存在功法，遍历功法加成
    const gongfa = ['Gongfa', 'TimeGongfa'];

    // 这里是查看了功法表
    for (const j of gongfa) {
      const ifexist = ((await getDataList(j as 'Gongfa' | 'TimeGongfa')) as GongfaItem[]).find(item => item.name === player.学习的功法[i]);

      if (ifexist) {
        gongfa_efficiency += ifexist.修炼加成 as number;
        continue label1;
      }
    }
    player.学习的功法.splice(+i, 1);
  }
  if (player.仙宠.type === '修炼') {
    // 是否存在修炼仙宠
    xianchong_efficiency = player.仙宠.加成; // 存在修炼仙宠，仙宠效率为仙宠效率加成
  }
  const dy = await readDanyao(userId);
  const bgdan = dy.biguanxl || 0;

  const efficiency = linggen_efficiency + Assoc_efficiency + gongfa_efficiency + xianchong_efficiency;
  const add = efficiency + bgdan;

  player.修炼效率提升 = add; // 修炼效率综合

  await setDataJSONStringifyByKey(keys.player(userId), player);
}

export default { playerEfficiency };
