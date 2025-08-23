import { Level_up } from '../level.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?突破$/;
const res = onResponse(selects, async (e) => {
    Level_up(e, false);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
