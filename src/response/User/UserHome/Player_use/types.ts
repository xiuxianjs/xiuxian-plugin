// 品级映射
export const PINJI_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
};

// 指令类型
export type CommandType = '装备' | '消耗' | '服用' | '学习';

// 物品信息接口
export interface ThingInfo {
  name: string;
  type?: string;
  class?: string;
  HPp?: number;
  HP?: number;
  exp?: number;
  xueqi?: number;
  xingyun?: number;
  biguan?: number;
  gailv?: number;
  机缘?: number;
  lianshen?: number;
  概率?: number;
  天赋?: number;
  额外数量?: number;
  modao?: number;
}

// 解析结果接口
export interface ParseResult {
  thingName: string;
  quantity: number;
  pinji?: number;
  realThingName: string;
  thingExist: ThingInfo;
  thingClass: string;
}
