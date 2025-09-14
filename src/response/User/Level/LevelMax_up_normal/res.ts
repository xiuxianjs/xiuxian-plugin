import { userLevelMaxUp } from '../level';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?破体$/;

const res = onResponse(selects, e => {
  void userLevelMaxUp(e, false);
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
