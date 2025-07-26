import { useSend, Text, useSubscribe, useMessage } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import { __PATH } from '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { writePlayer } from '../../../../model/pub.js';
import { existplayer, Go, isNotNull, get_random_fromARR, getRandomTalent, writeEquipment, Write_najie, Add_HP, Write_danyao } from '../../../../model/xiuxian.js';
import 'dayjs';
import fs from 'fs';
import { selects } from '../../../index.js';
import { Show_player } from '../user.js';

const regular = /^(#|＃|\/)?再入仙途$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        Send(Text('没存档你转世个锤子!'));
        return false;
    }
    else {
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1);
    }
    let acount = await redis.get('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount');
    if (acount == undefined || acount == null || isNaN(acount) || acount <= 0) {
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1);
    }
    let player = await await data.getData('player', usr_qq);
    if (player.灵石 <= 0) {
        Send(Text(`负债无法再入仙途`));
        return false;
    }
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let now = new Date();
    let nowTime = now.getTime();
    let lastrestart_time = await redis.get('xiuxian@1.3.0:' + usr_qq + ':last_reCreate_time');
    lastrestart_time = parseInt(lastrestart_time);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.reborn;
    let rebornTime = Math.floor(60000 * time);
    if (nowTime < lastrestart_time + rebornTime) {
        let waittime_m = Math.trunc((lastrestart_time + rebornTime - nowTime) / 60 / 1000);
        let waittime_s = Math.trunc(((lastrestart_time + rebornTime - nowTime) % 60000) / 1000);
        Send(Text(`每${rebornTime / 60 / 1000}分钟只能转世一次` +
            `剩余cd:${waittime_m}分 ${waittime_s}秒`));
        return false;
    }
    await Send(Text('一旦转世一切当世与你无缘,你真的要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择'));
    const [subscribe] = useSubscribe(e, selects);
    const sub = subscribe.mount(async (event, next) => {
        const [message] = useMessage(event);
        let usr_qq = event.UserId;
        let choice = event.MessageText;
        let now = new Date();
        let nowTime = now.getTime();
        if (choice == '再继仙缘') {
            message.send(format(Text('重拾道心,继续修行')));
            clearTimeout(timeout);
            return;
        }
        else if (choice == '断绝此生') {
            clearTimeout(timeout);
            let acount = await redis.get('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount');
            if (+acount >= 15) {
                message.send(format(Text('灵魂虚弱，已不可转世！')));
                return;
            }
            acount = Number(acount);
            acount++;
            let player = await data.getData('player', usr_qq);
            if (isNotNull(player.宗门)) {
                if (player.宗门.职位 != '宗主') {
                    let ass = data.getAssociation(player.宗门.宗门名称);
                    ass[player.宗门.职位] = ass[player.宗门.职位].filter(item => item != usr_qq);
                    ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq);
                    await data.setAssociation(ass.宗门名称, ass);
                    delete player.宗门;
                    await data.setData('player', usr_qq, player);
                }
                else {
                    let ass = data.getAssociation(player.宗门.宗门名称);
                    if (ass.所有成员.length < 2) {
                        fs.rmSync(`${data.association}/${player.宗门.宗门名称}.json`);
                    }
                    else {
                        ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq);
                        let randmember_qq;
                        if (ass.长老.length > 0) {
                            randmember_qq = await get_random_fromARR(ass.长老);
                        }
                        else if (ass.内门弟子.length > 0) {
                            randmember_qq = await get_random_fromARR(ass.内门弟子);
                        }
                        else {
                            randmember_qq = await get_random_fromARR(ass.所有成员);
                        }
                        let randmember = await data.getData('player', randmember_qq);
                        ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(item => item != randmember_qq);
                        ass['宗主'] = randmember_qq;
                        randmember.宗门.职位 = '宗主';
                        data.setData('player', randmember_qq, randmember);
                        data.setAssociation(ass.宗门名称, ass);
                    }
                }
            }
            await redis.del(__PATH.player_path);
            await redis.del(__PATH.equipment_path);
            await redis.del(__PATH.najie_path);
            message.send(format(Text('当前存档已清空!开始重生')));
            message.send(format(Text('来世，信则有，不信则无，岁月悠悠，世间终会出现两朵相同的花，千百年的回眸，一花凋零，一花绽。是否为同一朵，任后人去评断！！')));
            await Create_player(e);
            await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_reCreate_time', nowTime);
            await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', acount);
        }
        else {
            message.send(format(Text('请回复:【断绝此生】或者【再继仙缘】进行选择')));
            next();
        }
    }, ['UserId']);
    const timeout = setTimeout(() => {
        subscribe.cancel(sub);
        Send(Text('超时自动取消'));
    }, 30 * 1000);
});
async function Create_player(e) {
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (ifexistplay) {
        this.Show_player(e);
        return false;
    }
    let File_msg = fs.readdirSync(__PATH.player_path);
    let n = File_msg.length + 1;
    let talent = await getRandomTalent();
    let new_player = {
        id: e.UserId,
        sex: 0,
        名号: `路人甲${n}号`,
        宣言: '这个人很懒还没有写',
        avatar: e.UserAvatar || 'https://s1.ax1x.com/2022/08/09/v8XV3q.jpg',
        level_id: 1,
        Physique_id: 1,
        race: 1,
        修为: 1,
        血气: 1,
        灵石: 10000,
        灵根: talent,
        神石: 0,
        favorability: 0,
        breakthrough: false,
        linggen: [],
        linggenshow: 1,
        学习的功法: [],
        修炼效率提升: talent.eff,
        连续签到天数: 0,
        攻击加成: 0,
        防御加成: 0,
        生命加成: 0,
        power_place: 1,
        当前血量: 8000,
        lunhui: 0,
        lunhuiBH: 0,
        轮回点: 10,
        occupation: [],
        occupation_level: 1,
        镇妖塔层数: 0,
        神魄段数: 0,
        魔道值: 0,
        仙宠: [],
        练气皮肤: 0,
        装备皮肤: 0,
        幸运: 0,
        addluckyNo: 0,
        师徒任务阶段: 0,
        师徒积分: 0
    };
    await writePlayer(usr_qq, new_player);
    let new_equipment = {
        武器: data.equipment_list.find(item => item.name == '烂铁匕首'),
        护具: data.equipment_list.find(item => item.name == '破铜护具'),
        法宝: data.equipment_list.find(item => item.name == '廉价炮仗')
    };
    await writeEquipment(usr_qq, new_equipment);
    let new_najie = {
        等级: 1,
        灵石上限: 5000,
        灵石: 0,
        装备: [],
        丹药: [],
        道具: [],
        功法: [],
        草药: [],
        材料: [],
        仙宠: [],
        仙宠口粮: []
    };
    await Write_najie(usr_qq, new_najie);
    await Add_HP(usr_qq, 999999);
    const arr = {
        biguan: 0,
        biguanxl: 0,
        xingyun: 0,
        lianti: 0,
        ped: 0,
        modao: 0,
        beiyong1: 0,
        beiyong2: 0,
        beiyong3: 0,
        beiyong4: 0,
        beiyong5: 0
    };
    await Write_danyao(usr_qq, arr);
    await Show_player(e);
}

export { res as default, regular };
