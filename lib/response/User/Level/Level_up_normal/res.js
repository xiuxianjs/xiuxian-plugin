import { Level_up } from '../level.js';
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?突破$/;
var res = onResponse(selects, async (e) => {
    Level_up(e, false);
});

export { res as default, regular };
