import 'yaml';
import 'fs';
import '../config/help/Association.yaml.js';
import '../config/help/help.yaml.js';
import '../config/help/helpcopy.yaml.js';
import '../config/help/set.yaml.js';
import '../config/help/shituhelp.yaml.js';
import '../config/parameter/namelist.yaml.js';
import '../config/task/task.yaml.js';
import '../config/version/version.yaml.js';
import '../config/xiuxian/xiuxian.yaml.js';
export { Read_it, Read_mytripod, Read_tripod, Restraint, Write_duanlu, alluser, getxuanze, jiaozheng, looktripod, mainyuansu, read_all, read_that, settripod } from './duanzaofu.js';
export { Add_HP, Add_najie_thing, Add_najie_灵石, Add_player_学习功法, Add_仙宠, Add_修为, Add_灵石, Add_职业经验, Add_血气, Add_魔道值, GetPower, Get_xiuwei, Go, Goweizhi, Harm, LevelTask, Read_Exchange, Read_Forum, Read_danyao, Read_equipment, Read_najie, Read_player, Read_qinmidu, Read_shitu, Read_shop, Read_temp, Read_updata_log, Reduse_player_学习功法, Synchronization_ASS, Write_Exchange, Write_Forum, Write_danyao, Write_equipment, Write_najie, Write_qinmidu, Write_shitu, Write_shop, Write_temp, add_qinmidu, add_shitu, baojishanghai, bigNumberTransform, convert2integer, datachange, dataverification, dujie, exist_hunyin, exist_najie_thing, existplayer, existshop, find_qinmidu, find_shitu, find_tudi, fixed, foundthing, fstadd_qinmidu, fstadd_shitu, getLastsign, getPlayerAction, get_XianChong_img, get_adminset_img, get_association_img, get_danfang_img, get_danyao_img, get_daoju_img, get_equipment_img, get_forum_img, get_gongfa_img, get_najie_img, get_ningmenghome_img, get_player_img, get_power_img, get_random_fromARR, get_random_res, get_random_talent, get_ranking_money_img, get_ranking_power_img, get_state_img, get_statemax_img, get_statezhiye_img, get_supermarket_img, get_talent_img, get_tuzhi_img, get_valuables_img, get_wuqi_img, ifbaoji, instead_equipment, isNotBlank, isNotNull, jindi, kezhi, openAU, player_efficiency, re_najie_thing, setFileValue, setu, shijianc, sleep, sortBy, synchronization, timestampToTime, zd_battle } from './xiuxian.js';
export { Write_player, Writeit } from './pub.js';
export { __PATH } from './paths.js';

function getTimeStr(timeStamp) {
    const options = {
        second: '2-digit',
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(timeStamp);
}

export { getTimeStr };
