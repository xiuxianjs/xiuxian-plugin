import Association from '@src/config/Association.yaml'
import help from '@src/config/help.yaml'
import help2 from '@src/config/help2.yaml'
import set from '@src/config/set.yaml'
import shituhelp from '@src/config/shituhelp.yaml'
import namelist from '@src/config/namelist.yaml'
import task from '@src/config/task.yaml'
import version from '@src/config/version.yaml'
import xiuxian from '@src/config/xiuxian.yaml'

// 存档存放路径
const __PATH = {
  player_path: 'data:alemonjs-xiuxian:player',
  equipment_path: 'data:alemonjs-xiuxian:equipment',
  najie_path: 'data:alemonjs-xiuxian:xiuxian_najie',
  danyao_path: 'data:alemonjs-xiuxian:xiuxian_danyao',
  lib_path: 'data:alemonjs-xiuxian:item',
  Timelimit: 'data:alemonjs-xiuxian:Timelimit',
  Exchange: 'data:alemonjs-xiuxian:Exchange',
  Level: 'data:alemonjs-xiuxian:Level',
  shop: 'data:alemonjs-xiuxian:shop',
  log_path: 'data:alemonjs-xiuxian:suduku',
  association: 'data:alemonjs-xiuxian:association',
  tiandibang: 'data:alemonjs-xiuxian:tiandibang',
  qinmidu: 'data:alemonjs-xiuxian:qinmidu',
  backup: 'data:alemonjs-xiuxian:backup',
  shitu: 'data:alemonjs-xiuxian:shitu',
  duanlu: 'data:alemonjs-xiuxian:duanlu',
  temp_path: 'data:alemonjs-xiuxian:temp',
  custom: 'data:alemonjs-xiuxian:custom',
  auto_backup: 'data:alemonjs-xiuxian:auto_backup',
  occupation: 'data:alemonjs-xiuxian:occupation'
}

export { __PATH }

export const __PATH_CONFIG = {
  Association,
  help,
  help2,
  set,
  shituhelp,
  namelist,
  task,
  version,
  xiuxian
}
