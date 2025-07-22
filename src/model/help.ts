import xiuxianCfg from './Config.js'

export default class Help {
  versionData: any = {}

  static async get() {
    const html = new Help()
    return await html.getData()
  }

  static async gethelpcopy() {
    const html = new Help()
    return await html.getDatahelpcopy()
  }

  static async setup() {
    const html = new Help()
    return await html.Getset()
  }

  static async Association() {
    const html = new Help()
    return await html.GetAssociationt()
  }

  async getDatahelpcopy() {
    const helpData = xiuxianCfg.getConfig('help', 'help2')
    return {
      version: this.versionData.version,
      helpData
    }
  }

  async getData() {
    const helpData = xiuxianCfg.getConfig('help', 'help')
    return {
      version: this.versionData.version,
      helpData
    }
  }

  async Getset() {
    const helpData = xiuxianCfg.getConfig('help', 'set')
    return {
      version: this.versionData.version,
      helpData
    }
  }

  async GetAssociationt() {
    const helpData = xiuxianCfg.getConfig('help', 'Association')
    return {
      version: this.versionData.version,
      helpData
    }
  }
}
