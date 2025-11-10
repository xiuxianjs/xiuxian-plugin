// 扩展 window
type API = {
  /**
   * 发送消息
   * @param data
   * @returns
   */
  postMessage: (data: any) => void
  /**
   * 监听消息
   * @param callback
   * @returns
   */
  onMessage: (callback: (data: any) => void) => void
}

declare global {
  interface Window {
    createDesktopAPI: () => API
  }
}
