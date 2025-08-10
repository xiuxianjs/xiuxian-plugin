export interface SetuOptions {
  r18?: boolean
  keyword?: string
  num?: number
}

export interface SetuItem {
  pid: number
  title: string
  author: string
  url: string
  tags: string[]
  r18: boolean
}

// 这里保留原本实现的占位，等待接入真实 API
export async function setu(options: SetuOptions = {}): Promise<SetuItem[]> {
  // TODO: 从配置读取开关、频率限制、网络请求等
  return []
}

export default { setu }
