// 统一聚合导出 types 目录下的类型，供外部以 @src/types 导入
// 说明：
// 1. model.ts 与 task.ts 中存在同名类型（ExchangeEntry / ForumEntry / NajieCategory）。
//    - model.ts 主要用于 Image / 视图等场景，这里以 ImageExchangeEntry / ImageForumEntry / CoreNajieCategory 区分。
//    - task.ts 保留原名供任务逻辑使用。
// 2. 启用 isolatedModules 时，纯类型需要使用 export type 语法重新导出。

export * from './action';
export * from './data';
export * from './message';

// data_extra 纯类型集合
export type {
  AuctionItem,
  DanyaoFullItem,
  EquipmentItem,
  ExchangeItem,
  ForgingEquipItem,
  HiddenTalentItem,
  MonsterItem,
  NPCGroupItem,
  OccupationItem,
  PlaceItem,
  RealmShopGroupItem,
  ScoreShopItem,
  SecretAreaItem,
  ShopItem,
  StrengthenItem,
  DanfangItem
} from './data_extra';

export * from './domain';

// model.ts 选择性导出并做别名避免与 task.ts 冲突
export type {
  DataControlAPI,
  NajieCategory as CoreNajieCategory,
  NajieServiceAPI,
  ExchangeThingSnapshot,
  ExchangeRecord,
  ForumRecord,
  ExchangeView,
  ForumView,
  IDataList,
  JSONPrimitive,
  JSONValue,
  JSONData,
  ShopThing,
  ShopSlot,
  ShopData,
  ScreenshotResult,
  NamedItem,
  PlayerStatus,
  SendFn,
  AssociationInfo,
  FoundThing,
  ExchangeEntry as ImageExchangeEntry,
  ForumEntry as ImageForumEntry
} from './model';

export * from './player';

// task.ts：拆分类型与运行时守卫函数导出
export type {
  AuctionThing,
  AuctionSession,
  NajieCategory,
  ExchangeEntry,
  ForumEntry,
  RaidPhase,
  RaidLoot,
  RaidActionState,
  ExplorePhase,
  ExploreActionState,
  SecretPlaceAddress,
  SecretPlaceActionState,
  OccupationActionState,
  TempMessage,
  DynamicShopItem,
  TiandibangRow,
  TiandibangRankEntry,
  ControlActionState,
  WorldBossStatus,
  WorldBossPlayerRecord,
  ShopMutableSlot,
  BackupTaskMeta,
  AnyTaskActionState
} from './task';
export {
  isRaidActionState,
  isExploreActionState,
  isSecretPlaceActionState,
  isOccupationActionState,
  isControlActionState
} from './task';
