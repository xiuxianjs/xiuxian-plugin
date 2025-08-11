// 该文件已被精简：所有实现迁移至 xiuxian_impl.ts，仅保留统一导入与转发导出，避免外部引用变更。
// 如需修改逻辑，请前往同目录下的 xiuxian_impl.ts。

export { __PATH } from './paths.js'
export { readIt } from './duanzaofu.js'
export { writeIt, writePlayer } from './pub.js'
export type { Player, Equipment, Najie } from '../types/player.js'

// 直接转发原有模块功能
export { playerEfficiency } from './efficiency.js'
export {
  convert2integer,
  bigNumberTransform,
  GetPower,
  datachange
} from './utils/number.js'
export { addPet } from './pets.js'
export { setu } from './external/setu.js'
export { addCoin, addExp, addExp2, addExp3, addHP } from './economy.js'
export {
  updateBagThing,
  existNajieThing,
  addNajieThing,
  insteadEquipment
} from './najie.js'
export { zdBattle, baojishanghai, Harm, kezhi, ifbaoji } from './battle.js'
export { writeShop, readShop, existshop } from './shop.js'
export {
  writeExchange,
  writeForum,
  readExchange,
  readForum,
  openAU
} from './trade.js'
export {
  readQinmidu,
  writeQinmidu,
  fstaddQinmidu,
  addQinmidu,
  findQinmidu,
  existHunyin
} from './qinmidu.js'
export {
  writeShitu,
  readShitu,
  fstaddShitu,
  addShitu,
  findShitu,
  findTudi
} from './shitu.js'
export { readDanyao, writeDanyao } from './danyao.js'
export { readTemp, writeTemp } from './temp.js'
export {
  getRandomFromARR,
  sleep,
  timestampToTime,
  shijianc,
  getLastsign,
  getPlayerAction,
  dataverification,
  notUndAndNull,
  isNotBlank,
  Go
} from './common.js'
export {
  LevelTask,
  dujie,
  sortBy,
  getAllExp,
  getRandomTalent,
  getRandomRes,
  setFileValue,
  foundthing
} from './cultivation.js'
export {
  readEquipment as readEquipment,
  writeEquipment as writeEquipment
} from './equipment.js'

// 从实现文件导出原有逻辑函数
export {
  getPlayerDataSafe,
  getEquipmentDataSafe,
  existplayer,
  readPlayer,
  readNajie,
  Write_najie,
  addExp4,
  addConFaByUser,
  addBagCoin
} from './xiuxian_impl.js'
