import { LevelMax_up } from '../level.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?破体$/;
const res = onResponse(selects, async (e) => {
    LevelMax_up(e, false);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
