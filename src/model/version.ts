export default class Version {
  /** 生成版本信息图片 */
  async getData(versionData) {
    const version = versionData.version
    const data = {
      userId: version,
      quality: 100,
      saveId: version,
      versionData: versionData
    }
    return data
  }
}
