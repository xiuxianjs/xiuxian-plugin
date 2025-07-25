import path, { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import fileUrl$8 from '../config/Association.yaml.js';
import fileUrl$7 from '../config/help.yaml.js';
import fileUrl$6 from '../config/help2.yaml.js';
import fileUrl$5 from '../config/set.yaml.js';
import fileUrl$4 from '../config/shituhelp.yaml.js';
import fileUrl$3 from '../config/namelist.yaml.js';
import fileUrl$2 from '../config/task.yaml.js';
import fileUrl$1 from '../config/version.yaml.js';
import fileUrl from '../config/xiuxian.yaml.js';

const dataPath = join(process.cwd(), 'data');
const __PATH = {
    player_path: path.join(dataPath, '/alemonjs-xiuxian/player'),
    equipment_path: path.join(dataPath, '/alemonjs-xiuxian/equipment'),
    najie_path: path.join(dataPath, '/alemonjs-xiuxian/xiuxian_najie'),
    danyao_path: path.join(dataPath, '/alemonjs-xiuxian/xiuxian_danyao'),
    lib_path: path.join(dataPath, '/alemonjs-xiuxian/item'),
    Timelimit: path.join(dataPath, '/alemonjs-xiuxian/Timelimit'),
    Exchange: path.join(dataPath, '/alemonjs-xiuxian/Exchange'),
    Level: path.join(dataPath, '/alemonjs-xiuxian/Level'),
    shop: path.join(dataPath, '/alemonjs-xiuxian/shop'),
    log_path: path.join(dataPath, '/alemonjs-xiuxian/suduku'),
    association: path.join(dataPath, '/alemonjs-xiuxian/association'),
    tiandibang: path.join(dataPath, '/alemonjs-xiuxian/tiandibang'),
    qinmidu: path.join(dataPath, '/alemonjs-xiuxian/qinmidu'),
    backup: path.join(dataPath, '/alemonjs-xiuxian/backup'),
    shitu: path.join(dataPath, '/alemonjs-xiuxian/shitu'),
    duanlu: path.join(dataPath, '/alemonjs-xiuxian/duanlu'),
    temp_path: path.join(dataPath, '/alemonjs-xiuxian/temp'),
    custom: path.join(dataPath, '/alemonjs-xiuxian/custom'),
    auto_backup: path.join(dataPath, '/alemonjs-xiuxian/auto_backup'),
    occupation: path.join(dataPath, '/alemonjs-xiuxian/occupation')
};
for (const key in __PATH) {
    if (!existsSync(__PATH[key])) {
        mkdirSync(__PATH[key], { recursive: true });
    }
}
const __PATH_CONFIG = {
    Association: fileUrl$8,
    help: fileUrl$7,
    help2: fileUrl$6,
    set: fileUrl$5,
    shituhelp: fileUrl$4,
    namelist: fileUrl$3,
    task: fileUrl$2,
    version: fileUrl$1,
    xiuxian: fileUrl
};

export { __PATH, __PATH_CONFIG };
