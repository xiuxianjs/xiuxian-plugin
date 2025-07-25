import Config from './Config.js'

export default class Help2 {
  static async shituhelp() {
    const helpData = Config.getConfig('help', 'shituhelp')
    return {
      helpData
    }
  }
}
