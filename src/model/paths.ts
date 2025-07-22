import path, { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const MyDirPath = join(process.cwd(), 'data')

// 文件存放路径
const __PATH = {
  //更新日志
  updata_log_path: path.join(MyDirPath, 'vertion.txt'),
  //用户数据
  player_path: path.join(MyDirPath, '/resources/data/xiuxian_player'),
  //装备
  equipment_path: path.join(MyDirPath, '/resources/data/xiuxian_equipment'),
  //纳戒
  najie_path: path.join(MyDirPath, '/resources/data/xiuxian_najie'),
  //丹药
  danyao_path: path.join(MyDirPath, '/resources/data/xiuxian_danyao'),
  //源数据
  lib_path: path.join(MyDirPath, '/resources/data/item'),
  Timelimit: path.join(MyDirPath, '/resources/data/Timelimit'),
  Exchange: path.join(MyDirPath, '/resources/data/Exchange'),
  shop: path.join(MyDirPath, '/resources/data/shop'),
  log_path: path.join(MyDirPath, '/resources/data/suduku'),
  association: path.join(MyDirPath, '/resources/data/association'),
  tiandibang: path.join(MyDirPath, '/resources/data/tiandibang'),
  qinmidu: path.join(MyDirPath, '/resources/data/qinmidu'),
  backup: path.join(MyDirPath, '/resources/backup'),
  player_pifu_path: path.join(MyDirPath, '/resources/img/player_pifu'),
  shitu: path.join(MyDirPath, '/resources/data/shitu'),
  equipment_pifu_path: path.join(MyDirPath, '/resources/img/equipment_pifu'),
  duanlu: path.join(MyDirPath, '/resources/data/duanlu'),
  temp_path: path.join(MyDirPath, '/resources/data/temp'),
  custom: path.join(MyDirPath, '/resources/data/custom'),
  auto_backup: path.join(MyDirPath, '/resources/data/auto_backup')
}
for (const key in __PATH) {
  if (!existsSync(__PATH[key])) {
    mkdirSync(__PATH[key], { recursive: true })
  }
}
export { __PATH }
