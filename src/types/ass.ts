export interface ZongMenCrop {
  name: string;
  ts: number;
  desc: string;
  start_time: number;
  who_plant: string;
}

export interface YaoYuan {
  药园等级: number;
  作物: ZongMenCrop[];
}

export interface ZongMen {
  宗门名称: string;
  宗门等级: number;
  创立时间: [string, number];
  灵石池: number;
  宗门驻地: string;
  宗门建设等级: number;
  宗门神兽: number;
  宗主: string;
  副宗主: string[];
  长老: string[];
  内门弟子: string[];
  外门弟子: string[];
  所有成员: string[];
  药园: YaoYuan;
  维护时间: number;
  大阵血量: number;
  最低加入境界: number;
  power: number;
  需要审核?: boolean; // 是否开启宗门审核，默认false
}

// 宗门审核记录
export interface AssociationAuditRecord {
  userId: string; // 申请者QQ
  name: string; // 申请者名号
  level: string; // 申请时的练气境界
  physique: string; // 申请时的炼体境界
  applyTime: number; // 申请时间戳
}
