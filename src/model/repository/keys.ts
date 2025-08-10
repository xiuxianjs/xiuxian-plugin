// 统一管理 Redis Key 生成，避免散落与硬编码
export const keys = {
  player: (id: string) => `data:alemonjs-xiuxian:player:${id}`,
  equipment: (id: string) => `data:alemonjs-xiuxian:equipment:${id}`,
  najie: (id: string) => `data:alemonjs-xiuxian:xiuxian_najie:${id}`,
  occupation: (id: string) => `data:alemonjs-xiuxian:occupation:${id}`
}

export type RedisKeyGenerator = typeof keys
