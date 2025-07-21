import xiuxianCfg from './Config.js'

export default class Help2 {
  versionData: any

  static async shituhelp() {
    const html = new Help2()
    return await html.shituhelp()
  }

  async shituhelp() {
    const helpData = xiuxianCfg.getConfig('help', 'shituhelp')
    const v = xiuxianCfg.getConfig('version', 'version')
    return {
      version: v.version,
      helpData
    }
  }
}
