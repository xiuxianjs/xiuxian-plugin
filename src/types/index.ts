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
  ExplorePhase,
  SecretPlaceAddress,
  TempMessage,
  DynamicShopItem,
  TiandibangRow,
  TiandibangRankEntry,
  ControlActionState,
  WorldBossStatus,
  WorldBossPlayerRecord,
  ShopMutableSlot,
  BackupTaskMeta
} from './task';
export { isRaidActionState, isExploreActionState, isSecretPlaceActionState, isOccupationActionState, isControlActionState } from './task';
