import { Go } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?修仙状态$/;

const res = onResponse(selects, e => {
  void Go(e);
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
