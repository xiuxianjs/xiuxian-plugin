import fs from 'fs';
import config from './Config.js';
import path from 'path';
import ____ from '../resources/data/item/灵根列表.json.js';
import ____$1 from '../resources/data/item/怪物列表.json.js';
import ____$2 from '../resources/data/item/商品列表.json.js';
import ____$3 from '../resources/data/Level/练气境界.json.js';
import ____$4 from '../resources/data/item/积分商城.json.js';
import ____$5 from '../resources/data/Level/炼体境界.json.js';
import ____$6 from '../resources/data/item/装备列表.json.js';
import ____$7 from '../resources/data/item/丹药列表.json.js';
import _____ from '../resources/data/item/炼丹师丹药.json.js';
import ____$8 from '../resources/data/item/道具列表.json.js';
import ____$9 from '../resources/data/item/功法列表.json.js';
import ____$a from '../resources/data/item/草药列表.json.js';
import ____$b from '../resources/data/item/地点列表.json.js';
import ____$c from '../resources/data/item/洞天福地.json.js';
import ____$d from '../resources/data/item/宗门秘境.json.js';
import ____$e from '../resources/data/item/禁地列表.json.js';
import ____$f from '../resources/data/item/仙境列表.json.js';
import ____$g from '../resources/data/Timelimit/限定仙府.json.js';
import ____$h from '../resources/data/Timelimit/限定功法.json.js';
import ____$i from '../resources/data/Timelimit/限定装备.json.js';
import ____$j from '../resources/data/Timelimit/限定丹药.json.js';
import ____$k from '../resources/data/occupation/职业列表.json.js';
import experience from '../resources/data/occupation/experience.json.js';
import ____$l from '../resources/data/occupation/炼丹配方.json.js';
import ____$m from '../resources/data/occupation/装备图纸.json.js';
import __ from '../resources/data/item/八品.json.js';
import _______ from '../resources/data/item/星阁拍卖行列表.json.js';
import ___ from '../resources/data/item/天地堂.json.js';
import ____$n from '../resources/data/item/常驻仙宠.json.js';
import ____$o from '../resources/data/item/仙宠列表.json.js';
import ______ from '../resources/data/item/仙宠口粮列表.json.js';
import npc__ from '../resources/data/item/npc列表.json.js';
import shop__ from '../resources/data/item/shop列表.json.js';
import __$1 from '../resources/data/Timelimit/青龙.json.js';
import __$2 from '../resources/data/Timelimit/麒麟.json.js';
import ______$1 from '../resources/data/Timelimit/玄武朱雀白虎.json.js';
import ____$p from '../resources/data/item/魔界列表.json.js';
import ____$q from '../resources/data/item/兑换列表.json.js';
import ____$r from '../resources/data/item/神界列表.json.js';
import ____1 from '../resources/data/item/技能列表1.json.js';
import ____2 from '../resources/data/item/技能列表2.json.js';
import ____$s from '../resources/data/item/强化列表.json.js';
import ____$t from '../resources/data/item/锻造材料.json.js';
import ____$u from '../resources/data/item/锻造武器.json.js';
import ____$v from '../resources/data/item/锻造护具.json.js';
import ____$w from '../resources/data/item/锻造宝物.json.js';
import ____$x from '../resources/data/item/隐藏灵根.json.js';
import ____$y from '../resources/data/item/锻造杂类.json.js';
import ____$z from '../resources/data/item/技能列表.json.js';
import updateRecord from '../config/updateRecord.json.js';
import { __PATH } from './paths.js';

class XiuxianData {
    configData;
    filePathMap;
    lib_path;
    Timelimit;
    Level;
    Occupation;
    talent_list;
    monster_list;
    commodities_list;
    Level_list;
    shitujifen;
    LevelMax_list;
    equipment_list;
    danyao_list;
    newdanyao_list;
    daoju_list;
    gongfa_list;
    caoyao_list;
    didian_list;
    bless_list;
    guildSecrets_list;
    forbiddenarea_list;
    Fairyrealm_list;
    timeplace_list;
    timegongfa_list;
    timeequipmen_list;
    timedanyao_list;
    occupation_list;
    occupation_exp_list;
    danfang_list;
    tuzhi_list;
    bapin;
    xingge;
    tianditang;
    changzhuxianchon;
    xianchon;
    xianchonkouliang;
    npc_list;
    shop_list;
    qinlong;
    qilin;
    xuanwu;
    mojie;
    duihuan;
    shenjie;
    jineng1;
    jineng2;
    qianghua;
    duanzhaocailiao;
    duanzhaowuqi;
    duanzhaohuju;
    duanzhaobaowu;
    yincang;
    zalei;
    jineng;
    updateRecord;
    constructor() {
        this.configData = config.getConfig('version', 'version');
        this.filePathMap = {
            player: __PATH.player_path,
            equipment: __PATH.equipment_path,
            najie: __PATH.najie_path,
            lib: __PATH.lib_path,
            Timelimit: __PATH.Timelimit,
            Level: __PATH.Level,
            association: __PATH.association,
            occupation: __PATH.occupation
        };
        this.lib_path = __PATH.lib_path;
        this.Timelimit = __PATH.Timelimit;
        this.Level = __PATH.Level;
        this.Occupation = __PATH.occupation;
        this.talent_list = ____;
        this.monster_list = ____$1;
        this.commodities_list = ____$2;
        this.Level_list = ____$3;
        this.shitujifen = ____$4;
        this.LevelMax_list = ____$5;
        this.equipment_list = ____$6;
        this.danyao_list = ____$7;
        this.newdanyao_list = _____;
        this.daoju_list = ____$8;
        this.gongfa_list = ____$9;
        this.caoyao_list = ____$a;
        this.didian_list = ____$b;
        this.bless_list = ____$c;
        this.guildSecrets_list = ____$d;
        this.forbiddenarea_list = ____$e;
        this.Fairyrealm_list = ____$f;
        this.timeplace_list = ____$g;
        this.timegongfa_list = ____$h;
        this.timeequipmen_list = ____$i;
        this.timedanyao_list = ____$j;
        this.occupation_list = ____$k;
        this.occupation_exp_list = experience;
        this.danfang_list = ____$l;
        this.tuzhi_list = ____$m;
        this.bapin = __;
        this.xingge = _______;
        this.tianditang = ___;
        this.changzhuxianchon = ____$n;
        this.xianchon = ____$o;
        this.xianchonkouliang = ______;
        this.npc_list = npc__;
        this.shop_list = shop__;
        this.qinlong = __$1;
        this.qilin = __$2;
        this.xuanwu = ______$1;
        this.mojie = ____$p;
        this.duihuan = ____$q;
        this.shenjie = ____$r;
        this.jineng1 = ____1;
        this.jineng2 = ____2;
        this.qianghua = ____$s;
        this.duanzhaocailiao = ____$t;
        this.duanzhaowuqi = ____$u;
        this.duanzhaohuju = ____$v;
        this.duanzhaobaowu = ____$w;
        this.yincang = ____$x;
        this.zalei = ____$y;
        this.jineng = ____$z;
        this.updateRecord = updateRecord;
    }
    existData(file_path_type, file_name) {
        let file_path;
        file_path = this.filePathMap[file_path_type];
        let dir = path.join(file_path + '/' + file_name + '.json');
        if (fs.existsSync(dir)) {
            return true;
        }
        return false;
    }
    getData(file_name, user_qq) {
        let file_path;
        let dir;
        let data;
        if (user_qq) {
            file_path = this.filePathMap[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        }
        else {
            file_path = __PATH.lib_path;
            dir = path.join(file_path + '/' + file_name + '.json');
        }
        try {
            data = fs.readFileSync(dir, 'utf8');
        }
        catch (error) {
            logger.error('读取文件错误：' + error);
            return 'error';
        }
        const parsedData = JSON.parse(data);
        return parsedData;
    }
    setData(file_name, user_qq, data) {
        let file_path;
        let dir;
        if (user_qq) {
            file_path = this.filePathMap[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        }
        else {
            file_path = this.filePathMap.lib;
            dir = path.join(file_path + '/' + file_name + '.json');
        }
        let new_ARR = JSON.stringify(data);
        if (fs.existsSync(dir)) {
            fs.writeFileSync(dir, new_ARR, 'utf-8');
        }
        return;
    }
    getAssociation(file_name) {
        let file_path;
        let dir;
        let data;
        file_path = __PATH.association;
        dir = path.join(file_path + '/' + file_name + '.json');
        try {
            data = fs.readFileSync(dir, 'utf8');
        }
        catch (error) {
            logger.error('读取文件错误：' + error);
            return 'error';
        }
        const parsedData = JSON.parse(data);
        return parsedData;
    }
    setAssociation(file_name, data) {
        let file_path;
        let dir;
        file_path = __PATH.association;
        dir = path.join(file_path + '/' + file_name + '.json');
        let new_ARR = JSON.stringify(data);
        fs.writeFileSync(dir, new_ARR, 'utf-8');
        return;
    }
}
var data = new XiuxianData();

export { data as default };
