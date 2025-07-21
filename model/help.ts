import base from './base.js'
import xiuxianCfg from './Config.js'

export default class Help extends base {
  versionData: any
  constructor(e) {
    super(e)
    this.model = 'help'
    this.versionData = xiuxianCfg.getConfig('version', 'version')
  }

  static async get(e) {
    const html = new Help(e)
    return await html.getData()
  }

  static async gethelpcopy(e) {
    const html = new Help(e)
    return await html.getDatahelpcopy()
  }

  static async setup(e) {
    const html = new Help(e)
    return await html.Getset()
  }

  static async Association(e) {
    const html = new Help(e)
    return await html.GetAssociationt()
  }

  async getDatahelpcopy() {
    const helpData = xiuxianCfg.getConfig('help', 'helpcopy')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }

  async getData() {
    const helpData = xiuxianCfg.getConfig('help', 'help')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }

  async Getset() {
    const helpData = xiuxianCfg.getConfig('help', 'set')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }

  async GetAssociationt() {
    const helpData = xiuxianCfg.getConfig('help', 'Association')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }
}
