import fileUrl$5 from '../config/help/association.yaml.js';
import fileUrl$4 from '../config/help/base.yaml.js';
import fileUrl$3 from '../config/help/extensions.yaml.js';
import fileUrl$2 from '../config/help/admin.yaml.js';
import fileUrl$1 from '../config/help/professor.yaml.js';
import fileUrl from '../config/xiuxian.yaml.js';

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
const __PATH_CONFIG_MAP = {
    Association: '/help/association',
    help: '/help/base',
    help2: '/help/extensions',
    set: '/help/admin',
    shituhelp: '/help/professor',
    xiuxian: '/xiuxian'
};
const __PATH_CONFIG = {
    Association: fileUrl$5,
    help: fileUrl$4,
    help2: fileUrl$3,
    set: fileUrl$2,
    shituhelp: fileUrl$1,
    xiuxian: fileUrl
};

export { __PATH, __PATH_CONFIG, __PATH_CONFIG_MAP };
