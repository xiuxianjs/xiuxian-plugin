import type { SetuOptions, SetuItem } from '../../types/model'

// 这里保留原本实现的占位，等待接入真实 API
export async function setu(_options: SetuOptions = {}): Promise<SetuItem[]> {
  // TODO: 从配置读取开关、频率限制、网络请求等
  return []
}

export default { setu }
