import fs from 'fs';
import path from 'path';
import { __PATH } from './paths.js';

async function Writeit(custom) {
    const dir = path.join(__PATH.custom, `custom.json`);
    const new_ARR = JSON.stringify(custom, null, '\t');
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}
async function Write_player(usr_qq, player) {
    let dir = path.join(__PATH.player_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(player);
    fs.writeFileSync(dir, new_ARR, 'utf8');
    return;
}

export { Write_player, Writeit };
