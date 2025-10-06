import { readQinmidu } from '@src/model/qinmidu';
import type { QinmiduRecord } from './model';
import XianChong from '@src/resources/html/xianchong';

export interface TalentInfo {
  type: number;
  class: string;
  name: string;
  法球倍率: number | string;
  eff?: number;
  控火: number;
  控器: number;
}

export type XianchongInfo = XianChong;

interface LingGen {
  name: string;
  type: string;
  eff: number;
  法球倍率: number;
}

export interface XianChong {
  id: number;
  name: string;
  type: string;
  加成: number;
  等级: number;
  每级增加: number;
  灵魂绑定?: number;
  等级上限: number;
  品级: string;
}

export interface HiddenLingGen {
  name: string;
  class: string;
  type: number;
  控火: number;
  控器: number;
}

export interface ZongMen {
  宗门名称: string;
  职位: string;
  time: [string, number];
  所有成员: any;
  宗门等级: number;
  药园: undefined;
  宗门建设等级?: number;
  灵石池?: number;
  power?: number;
  lingshi_donate?: number;
}

export interface Player {
  id: string;
  sex: number;
  名号: string;
  宣言: string;
  avatar: string;
  level_id: number;
  Physique_id: number;
  race: number;
  修为: number;
  血气: number;
  灵石: number;
  灵根: LingGen;
  神石: number;
  favorability: number;
  breakthrough: boolean;
  breakthroughBody?: boolean; // 破体丹效果，增加炼体突破概率
  linggen: any[]; // 未知类型，留空数组
  linggenshow: number;
  学习的功法: string[];
  修炼效率提升: number;
  连续签到天数: number;
  攻击加成: number;
  防御加成: number;
  生命加成: number;
  power_place: number;
  当前血量: number;
  lunhui: number;
  lunhuiBH: number;
  轮回点: number;
  occupation: string;
  occupation_level: number;
  镇妖塔层数: number;
  神魄段数: number;
  魔道值: number;
  仙宠: XianChong;
  练气皮肤: number;
  装备皮肤: number;
  幸运: number;
  addluckyNo: number;
  师徒任务阶段: number;
  师徒积分: number;
  攻击: number;
  防御: number;
  血量上限: number;
  暴击率: number;
  暴击伤害: number;
  金银坊败场: number;
  金银坊支出: number;
  金银坊胜场: number;
  金银坊收入: number;
  occupation_exp: number;
  锻造天赋: number;
  隐藏灵根?: HiddenLingGen;
  神界次数: number;
  宗门?: ZongMen;
  法球倍率: number;
  newbie?: number;
  islucky?: number;
}

export interface Equipment {
  武器: EquipmentItem;
  护具: EquipmentItem;
  法宝: EquipmentItem;
}

export interface EquipmentItem {
  atk: number;
  def: number;
  HP: number;
  bao: number;
  name?: string;
  grade?: string;
  pinji?: number;
}

export interface NajieItem {
  name: string;
  class: string;
  acount?: number;
  grade?: string;
  pinji?: number;
  出售价?: number;
  数量?: number;
  islockd?: number;
  atk?: number;
  def?: number;
  HP?: number;
  bao?: number;
  type?: string;
}

export interface Najie {
  仙宠: NajieItem[];
  道具: NajieItem[];
  丹药: NajieItem[];
  功法: NajieItem[];
  武器: NajieItem[];
  护具: NajieItem[];
  法宝: NajieItem[];
  材料: NajieItem[];
  草药: NajieItem[];
  装备: NajieItem[];
  仙宠口粮: NajieItem[];
  灵石: number;
  灵石上限?: number;
  等级?: number;
}

// 锻造炉相关类型
export interface Tripod {
  qq: string;
  煅炉: number;
  容纳量: number;
  材料: string[];
  数量: number[];
  TIME: number;
  时长: number;
  状态: number;
  预计时长: number;
}

export interface StrandResult {
  style: { width: string };
  num: string;
}

export interface DanyaoStatus {
  biguan: number;
  biguanxl: number;
  xingyun: number;
  lianti: number;
  ped: number;
  modao: number;
  beiyong1: number;
  beiyong2: number;
  beiyong3: number;
  beiyong4: number;
  beiyong5: number;
}

export async function findQinmidu(A: string, B: string) {
  const list: QinmiduRecord[] = await readQinmidu();

  let i: number;
  const QQ: string[] = [];

  for (i = 0; i < list.length; i++) {
    if (list[i].QQ_A === A || list[i].QQ_A === B) {
      if (list[i].婚姻 !== 0) {
        // 原逻辑是错误地把 push 当作属性赋值，这里直接 push
        QQ.push(list[i].QQ_B);
        break;
      }
    } else if (list[i].QQ_B === A || list[i].QQ_B === B) {
      if (list[i].婚姻 !== 0) {
        QQ.push(list[i].QQ_A);
        break;
      }
    }
  }
  for (i = 0; i < list.length; i++) {
    if ((list[i].QQ_A === A && list[i].QQ_B === B) || (list[i].QQ_A === B && list[i].QQ_B === A)) {
      break;
    }
  }
  if (i === list.length) {
    return false;
  } else if (QQ.length !== 0) {
    return 0;
  } else {
    return list[i].亲密度;
  }
}
