import Config from './Config.js'

export default class Help {
  static async get() {
    const helpData = Config.getConfig('help', 'help')
    return {
      helpData
    }
  }

  static async gethelpcopy() {
    const helpData = Config.getConfig('help', 'help2')
    return {
      helpData
    }
  }

  static async setup() {
    const helpData = Config.getConfig('help', 'set')
    return {
      helpData
    }
  }

  static async Association() {
    const helpData = Config.getConfig('help', 'Association')
    return {
      helpData
    }
  }
}
