// 通用领域模型类型声明，逐步替换 any

// 玩家宗门职位
export type GuildRole =
  | '宗主'
  | '副宗主'
  | '长老'
  | '弟子'
  | '外门弟子'
  | string

// 宗门数据（简化，可继续扩展）
export interface AssociationData {
  宗门名称: string
  职位?: GuildRole
  power?: number
  最低加入境界?: number
}

// 运行期实际使用到的更完整的宗门数据结构（增量类型，避免大量 any）
export interface AssociationDetailData extends AssociationData {
  灵石池?: number
  大阵血量?: number
  所有成员?: string[]
  副宗主?: string[]
  长老?: string[]
  内门弟子?: string[]
}

// 关卡/境界等级条目
export interface LevelItem {
  level_id: number
  level: string
}

// 玩家部分信息（按需补充）
export interface PlayerData {
  UserId?: string
  宗门?: AssociationData
}

// 数据访问接口（从 data 对象推测）
export interface DataAPI {
  Level_list: LevelItem[]
  getData<T = unknown>(type: string, id: string): Promise<T>
  getAssociation(name: string): Promise<AssociationData>
  setAssociation(name: string, data: AssociationData): Promise<void>
}
