import { __PATH } from './paths'

export const keys = {
  player: (id: string) => `${__PATH.player_path}:${id}`,
  equipment: (id: string) => `${__PATH.equipment_path}:${id}`,
  najie: (id: string) => `${__PATH.najie_path}:${id}`,
  occupation: (id: string) => `${__PATH.occupation}:${id}`,
  danyao: (id: string) => `${__PATH.danyao_path}:${id}`,
  lib: (id: string) => `${__PATH.lib_path}:${id}`,
  timelimit: (id: string) => `${__PATH.Timelimit}:${id}`,
  exchange: (id: string) => `${__PATH.Exchange}:${id}`,
  level: (id: string) => `${__PATH.Level}:${id}`,
  shop: (id: string) => `${__PATH.shop}:${id}`,
  log: (id: string) => `${__PATH.log_path}:${id}`,
  association: (id: string) => `${__PATH.association}:${id}`,
  tiandibang: (id: string) => `${__PATH.tiandibang}:${id}`,
  qinmidu: (id: string) => `${__PATH.qinmidu}:${id}`,
  backup: (id: string) => `${__PATH.backup}:${id}`,
  shitu: (id: string) => `${__PATH.shitu}:${id}`,
  duanlu: (id: string) => `${__PATH.duanlu}:${id}`,
  temp: (id: string) => `${__PATH.temp_path}:${id}`,
  custom: (id: string) => `${__PATH.custom}:${id}`,
  autoBackup: (id: string) => `${__PATH.auto_backup}:${id}`
}

export type RedisKeyGenerator = typeof keys
