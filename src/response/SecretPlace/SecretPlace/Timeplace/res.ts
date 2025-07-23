import { Text, useSend } from 'alemonjs'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)仙府$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  Send(Text('仙府乃民间传说之地,请自行探索'))
})
