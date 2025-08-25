import { Level_up } from '../level';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?突破$/;

const res = onResponse(selects, async e => {
  Level_up(e, false);
});

export default onResponse(selects, [mw.current, res.current]);
