import { type Message, plugin } from '../../../import.js'
import { getHelpComponent } from '../../image/index.js'
export class help extends plugin {
  constructor() {
    super({
      name: '帮助图片',
      dsc: '帮助图片',
      event: 'message',
      priority: 400,
      rule: [
        {
          reg: /^(#|\/)修仙帮助/,
          fnc: 'xiuxianHelp'
        }
      ]
    })
  }

  async xiuxianHelp(e: Message) {
    getHelpComponent('修仙帮助').then((img) => {
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}