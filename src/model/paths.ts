import path, { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const dataPath = join(process.cwd(), 'data')

// 文件存放路径
const __PATH = {
  player_path: path.join(dataPath, '/alemonjs-xiuxian/xiuxian_player'),
  equipment_path: path.join(dataPath, '/alemonjs-xiuxian/xiuxian_equipment'),
  najie_path: path.join(dataPath, '/alemonjs-xiuxian/xiuxian_najie'),
  danyao_path: path.join(dataPath, '/alemonjs-xiuxian/xiuxian_danyao'),
  lib_path: path.join(dataPath, '/alemonjs-xiuxian/item'),
  Timelimit: path.join(dataPath, '/alemonjs-xiuxian/Timelimit'),
  Exchange: path.join(dataPath, '/alemonjs-xiuxian/Exchange'),
  Level: path.join(dataPath, '/alemonjs-xiuxian/Level'),
  shop: path.join(dataPath, '/alemonjs-xiuxian/shop'),
  log_path: path.join(dataPath, '/alemonjs-xiuxian/suduku'),
  association: path.join(dataPath, '/alemonjs-xiuxian/association'),
  tiandibang: path.join(dataPath, '/alemonjs-xiuxian/tiandibang'),
  qinmidu: path.join(dataPath, '/alemonjs-xiuxian/qinmidu'),
  backup: path.join(dataPath, '/resources/backup'),
  player_pifu_path: path.join(dataPath, '/resources/img/player_pifu'),
  shitu: path.join(dataPath, '/alemonjs-xiuxian/shitu'),
  equipment_pifu_path: path.join(dataPath, '/resources/img/equipment_pifu'),
  duanlu: path.join(dataPath, '/alemonjs-xiuxian/duanlu'),
  temp_path: path.join(dataPath, '/alemonjs-xiuxian/temp'),
  custom: path.join(dataPath, '/alemonjs-xiuxian/custom'),
  auto_backup: path.join(dataPath, '/alemonjs-xiuxian/auto_backup'),
  occupation: path.join(dataPath, '/alemonjs-xiuxian/occupation')
}

for (const key in __PATH) {
  if (!existsSync(__PATH[key])) {
    mkdirSync(__PATH[key], { recursive: true })
  }
}
export { __PATH }
