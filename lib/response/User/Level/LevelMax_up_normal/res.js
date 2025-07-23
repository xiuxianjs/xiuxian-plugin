import { LevelMax_up } from '../level.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?破体$/;
var res = onResponse(selects, async (e) => {
    LevelMax_up(e, false);
});

export { res as default, regular };
