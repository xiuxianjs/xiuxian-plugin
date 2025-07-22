import path, { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const MyDirPath = join(process.cwd(), 'src');
const __PATH = {
    updata_log_path: path.join(MyDirPath, 'vertion.txt'),
    player_path: path.join(MyDirPath, '/resources/data/xiuxian_player'),
    equipment_path: path.join(MyDirPath, '/resources/data/xiuxian_equipment'),
    najie_path: path.join(MyDirPath, '/resources/data/xiuxian_najie'),
    danyao_path: path.join(MyDirPath, '/resources/data/xiuxian_danyao'),
    lib_path: path.join(MyDirPath, '/resources/data/item'),
    Timelimit: path.join(MyDirPath, '/resources/data/Timelimit'),
    Exchange: path.join(MyDirPath, '/resources/data/Exchange'),
    Level: path.join(MyDirPath, '/resources/data/Level'),
    shop: path.join(MyDirPath, '/resources/data/shop'),
    log_path: path.join(MyDirPath, '/resources/data/suduku'),
    association: path.join(MyDirPath, '/resources/data/association'),
    tiandibang: path.join(MyDirPath, '/resources/data/tiandibang'),
    qinmidu: path.join(MyDirPath, '/resources/data/qinmidu'),
    backup: path.join(MyDirPath, '/resources/backup'),
    player_pifu_path: path.join(MyDirPath, '/resources/img/player_pifu'),
    shitu: path.join(MyDirPath, '/resources/data/shitu'),
    equipment_pifu_path: path.join(MyDirPath, '/resources/img/equipment_pifu'),
    duanlu: path.join(MyDirPath, '/resources/data/duanlu'),
    temp_path: path.join(MyDirPath, '/resources/data/temp'),
    custom: path.join(MyDirPath, '/resources/data/custom'),
    auto_backup: path.join(MyDirPath, '/resources/data/auto_backup'),
    occupation: path.join(MyDirPath, '/resources/data/occupation')
};
for (const key in __PATH) {
    if (!existsSync(__PATH[key])) {
        mkdirSync(__PATH[key], { recursive: true });
    }
}

export { __PATH };
