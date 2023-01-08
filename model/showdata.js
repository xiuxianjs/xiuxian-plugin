import Show from './show.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js';
import config from './Config.js'
import { talentname, Read_battle, Read_player, Read_wealth, Read_talent, Read_equipment, Read_level, Read_najie, Read_Life, existplayer } from './public.js';
export const get_map_img = async (usr_qq) => {
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    const myData = {};
    const data1 = await  Show.get_Data('map', 'map', myData);
    const img = await puppeteer.screenshot('map', {
        ...data1,
    });
    return img;
};
export const get_updata_img = async (usr_qq) => {
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    const updata = config.getdefSet('version', 'version');
    const myData = {
        version: updata
    };
    const data1 = await  Show.get_Data('updata', 'updata', myData);
    const img = await puppeteer.screenshot('updata', {
        ...data1,
    });
    return img;
};
export const get_config_img = async (usr_qq) => {
    const xiuxain = config.getConfig('xiuxian', 'xiuxian');
    const myData = {
        xiuxain: xiuxain
    };
    const data1 = await  Show.get_Data('config', 'config', myData);
    const img = await puppeteer.screenshot('config', {
        ...data1,
    });
    return img;
};
export const get_bulletin_img = async (usr_qq) => {
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    const bulletin = config.getdefSet('version', 'bulletin');
    const myData = {
        version: bulletin
    };
    const data1 = await  Show.get_Data('updata', 'updata', myData);
    const img = await puppeteer.screenshot('updata', {
        ...data1,
    });
    return img;
};
export const get_player_img = async (usr_qq) => {
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    const player = await Read_player(usr_qq);
    const wealt = await Read_wealth(usr_qq);
    const equipment = await Read_equipment(usr_qq);
    const talent = await Read_talent(usr_qq);
    const level = await Read_level(usr_qq);
    const battle = await Read_battle(usr_qq);
    const linggenname = await talentname(talent);
    let life = await Read_Life();
    life = life.find(item => item.qq == usr_qq);
    let name = '';
    for (var i = 0; i < linggenname.length; i++) {
        name = name + linggenname[i];
    };
    let size = Math.trunc(talent.talentsize);
    if (await talent.talentshow != 0) {
        size = '未知';
        name = '未知';
    } else {
        size = `+${size}%`;
    };
    const myData = {
        user_id: usr_qq,
        life: life,
        player: player,
        level: level,
        linggenname: name,
        battle: battle,
        equipment: equipment,
        lingshi: Math.trunc(wealt.lingshi),
        xianshi: Math.trunc(wealt.xianshi),
        talent: talent,
        talentsize: size
    };
    const data1 = await  Show.get_Data('User/player', 'player', myData);
    const img = await puppeteer.screenshot('player', {
        ...data1,
    });
    return img;
};
export const get_equipment_img = async (usr_qq) => {
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    const battle = await Read_battle(usr_qq);
    const equipment = await Read_equipment(usr_qq);
    let life = await Read_Life();
    life = life.find(item => item.qq == usr_qq);
    const myData = {
        user_id: usr_qq,
        battle: battle,
        life: life,
        equipment: equipment
    };
    const data1 = await  Show.get_Data('User/equipment', 'equipment', myData);
    const img = await puppeteer.screenshot('equipment', {
        ...data1,
    });
    return img;
};
export const get_najie_img = async (usr_qq) => {
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    let life = await Read_Life();
    life = life.find(item => item.qq == usr_qq);
    const player = await Read_player(usr_qq);
    const battle = await Read_battle(usr_qq);
    const najie = await Read_najie(usr_qq);
    const thing = najie.thing;
    const thing_list = [];
    const danyao_list = [];
    const daoju_list = [];
    thing.forEach((item, index) => {
        let id = item.id.split('-');
        if (id[0] == 4) {
            danyao_list.push(item);
        } else if (id[0] == 6) {
            daoju_list.push(item);
        } else {
            thing_list.push(item);
        };
    });
    const myData = {
        user_id: usr_qq,
        player: player,
        life: life,
        battle: battle,
        najie: najie,
        thing: thing_list,
        daoju_list: daoju_list,
        danyao_list: danyao_list
    };
    const data1 = await  Show.get_Data('User/najie', 'najie', myData);
    const img = await puppeteer.screenshot('najie', {
        ...data1,
    });
    return img;
};
export const get_toplist_img = async (usr_qq, list) => {
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    const myData = {
        list: list,
    };
    const data1 = await  Show.get_Data('toplist', 'toplist', myData);
    const img = await puppeteer.screenshot('toplist', {
        ...data1,
    });
    return img;
};