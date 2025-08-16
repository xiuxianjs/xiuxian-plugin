import sectHelpConfig from '../config/help/association.js';
import mainHelpConfig from '../config/help/base.js';
import advancedHelpConfig from '../config/help/extensions.js';
import helpConfig from '../config/help/admin.js';
import masterDiscipleHelpConfig from '../config/help/professor.js';
import xiuxian from '../config/xiuxian.js';

const __PATH = {
    player_path: 'data:alemonjs-xiuxian:player',
    equipment_path: 'data:alemonjs-xiuxian:equipment',
    najie_path: 'data:alemonjs-xiuxian:xiuxian_najie',
    danyao_path: 'data:alemonjs-xiuxian:xiuxian_danyao',
    lib_path: 'data:alemonjs-xiuxian:item',
    Timelimit: 'data:alemonjs-xiuxian:Timelimit',
    Exchange: 'data:alemonjs-xiuxian:Exchange',
    Level: 'data:alemonjs-xiuxian:Level',
    shop: 'data:alemonjs-xiuxian:shop',
    log_path: 'data:alemonjs-xiuxian:suduku',
    association: 'data:alemonjs-xiuxian:association',
    tiandibang: 'data:alemonjs-xiuxian:tiandibang',
    qinmidu: 'data:alemonjs-xiuxian:qinmidu',
    backup: 'data:alemonjs-xiuxian:backup',
    shitu: 'data:alemonjs-xiuxian:shitu',
    duanlu: 'data:alemonjs-xiuxian:duanlu',
    temp_path: 'data:alemonjs-xiuxian:temp',
    custom: 'data:alemonjs-xiuxian:custom',
    auto_backup: 'data:alemonjs-xiuxian:auto_backup',
    occupation: 'data:alemonjs-xiuxian:occupation'
};
const __PATH_CONFIG = {
    Association: sectHelpConfig,
    help: mainHelpConfig,
    help2: advancedHelpConfig,
    set: helpConfig,
    shituhelp: masterDiscipleHelpConfig,
    xiuxian
};

export { __PATH, __PATH_CONFIG };
