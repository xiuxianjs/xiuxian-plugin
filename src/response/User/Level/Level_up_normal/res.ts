import { useLevelUp } from '../level';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?突破$/;

const res = onResponse(selects, e => {
  void useLevelUp(e, false);
});

export default onResponse(selects, [mw.current, res.current]);
