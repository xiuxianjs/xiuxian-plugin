import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import fs from "node:fs";
import Cachemonster from "../../model/cachemonster.js";
import { Gomini, isNotNull,Read_action, ForwardMsg, Read_battle, monsterbattle, Add_experiencemax, Add_experience, Add_lingshi,GenerateCD,Add_najie_thing, Read_najie, Write_najie } from '../Xiuxian/Xiuxian.js';


export class BattleSite extends plugin {
    constructor() {
        super({
            name: 'BattleSite',
            dsc: 'BattleSite',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#击杀.*$',
                    fnc: 'Kill'
                },
                {
                    reg: '^#探索怪物$',
                    fnc: 'Exploremonsters'
                }
            ]
        });
    };
    async Kill(e) {
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        const CDid = "10";
        const now_time = new Date().getTime();
        const CDTime = 5;
        const CD = await GenerateCD(usr_qq, CDid);
        if (CD != 0) {
            e.reply(CD);
            return ;
        };
        const name = e.msg.replace("#击杀", '');
        const action = await Read_action(usr_qq);
        //非安全区判断
        const p = await Cachemonster.monsters(action.x, action.y, action.z);
        if (p != -1) {
            await redis.set("xiuxian:player:" + usr_qq + ':' + CDid, now_time);
            await redis.expire("xiuxian:player:" + usr_qq + ':' + CDid, CDTime * 60);
            const monstersdata = await Cachemonster.monsterscache(p);
            const mon=monstersdata.find(item => item.name == name);
            if(!isNotNull(mon)){
                e.reply(`这里没有这样的怪物，去别处看看吧`);
                return ;
            }
            await Cachemonster.addKillNum(p,name,1);
            const LevelMax = data.LevelMax_list.find(item => item.id == mon.level);
            const monsters = {
                "nowblood": LevelMax.blood,
                "attack": LevelMax.attack,
                "defense": LevelMax.defense,
                "blood": LevelMax.blood,
                "burst": LevelMax.burst+LevelMax.id*5,
                "burstmax": LevelMax.burstmax+LevelMax.id*10,
                "speed": LevelMax.speed+5
            };
            if(mon.killNum >= 11){
                await Cachemonster.addKillNum(p,name,0);
                const random = Math.floor(Math.random() * 9) + 1;
                monsters.nowblood *= random;
                monsters.attack *= random;
                monsters.defense *= random;
                monsters.blood *= random;
                monsters.burst *= random;
                monsters.burstmax *= random;
                monsters.speed *= random;
                mon.level += 2 ;
            }
            e.reply(`周围传来阵阵嘶吼，竟然遇见了精英级别的${mon.name}！！！`);
            const battle=await Read_battle(usr_qq);
            const q=await monsterbattle(e,battle,monsters);
            if(q!=0){
                const msg = ["[击杀结果]"];
                msg.push(usr_qq+"击败了"+mon.name);
                const m=Math.floor((Math.random() * (100-1))) + Number(1);
                //获得装备
                if(m<mon.level*5){
                    const dropsItemList = JSON.parse(fs.readFileSync(`${data.all}/dropsItem.json`));
                    const length = dropsItemList.length;
                    const random = Math.floor(Math.random() * length);
                    let nacre = await Read_najie(usr_qq);
                    nacre = await Add_najie_thing(nacre, dropsItemList[random], 1);
                    await Write_najie(usr_qq, nacre);
                    msg.push(usr_qq+`得到了装备[${dropsItemList[random].name}]`);
                }
                //获得气血
                else if(m<mon.level*8){
                    msg.push(usr_qq+"得到99气血");
                    await Add_experiencemax(usr_qq,99);
                }
                //获得修为and灵石
                else if(m<mon.level*10){
                    msg.push(usr_qq+"得到99灵石和99修为");
                    await Add_experience(usr_qq,99);
                    await Add_lingshi(usr_qq,99);
                }else {
                    msg.push(usr_qq+"运气不好，什么也没得到");
                }
                await ForwardMsg(e, msg);
                return;
            };
            e.reply(`你被怪物杀死了！！！`);
            return;
        };
        return;
    };
    async Exploremonsters(e) {
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        const action = await Read_action(usr_qq);
        const p = await Cachemonster.monsters(action.x, action.y, action.z);
        if (p != -1) {
            const msg = [];
            const monster = await Cachemonster.monsterscache(p);
            monster.forEach((item) => {
                msg.push(
                    "怪名：" + item.name + "\n" +
                    "等级：" + item.level + "\n"
                );
            });
            await ForwardMsg(e, msg);
            return;
        }
        else{
            e.reply("修仙联盟的普通士兵:城里哪儿来的怪物？搞笑");
        }
        return;
    };
};