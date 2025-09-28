import { migrate } from './versionManage.js';

const defaultsPlayer = {
    version: 1,
    value: {
        base: {
            name: '',
            physique_id: 0,
            level_id: 1,
            sect: {
                id: ''
            },
            favorability: 0
        },
        stats: {
            current_hp: 100,
            max_hp: 100,
            attack: 10,
            defense: 10,
            attack_bonus: 0,
            defense_bonus: 0,
            hp_bonus: 0,
            crit_rate: 0,
            crit_damage: 1.5
        },
        resources: {
            lingshi: 0,
            shenshi: 0,
            exp: 0,
            exp_xueqi: 0,
            modao: 0
        },
        progression: {
            zhenyaota_level: 0,
            shenpo_level: 0,
            train_bonus: 0,
            lucky: 0,
            islucky: 0,
            add_lucky_no: 0
        },
        systems: {
            linggen: { name: '', type: '', magnification: 0 },
            xianchong: { name: '', type: '', bonus: 0 },
            magic_ball_multiplier: 0
        },
        skills: []
    }
};
const versions = {
    0: oldData => {
        const { version: _, ...rest } = oldData;
        const value = {
            base: {
                name: rest?.名号 ?? defaultsPlayer.value.base.name,
                physique_id: rest?.Physique_id ?? defaultsPlayer.value.base.physique_id,
                level_id: rest?.level_id ?? defaultsPlayer.value.base.level_id,
                sect: rest?.宗门 ?? defaultsPlayer.value.base.sect,
                favorability: rest?.好感度 ?? defaultsPlayer.value.base.favorability
            },
            stats: {
                current_hp: rest?.当前血量 ?? defaultsPlayer.value.stats.current_hp,
                max_hp: rest?.血量上限 ?? defaultsPlayer.value.stats.max_hp,
                attack: rest?.攻击 ?? defaultsPlayer.value.stats.attack,
                defense: rest?.防御 ?? defaultsPlayer.value.stats.defense,
                attack_bonus: rest?.攻击加成 ?? defaultsPlayer.value.stats.attack_bonus,
                defense_bonus: rest?.防御加成 ?? defaultsPlayer.value.stats.defense_bonus,
                hp_bonus: rest?.生命加成 ?? defaultsPlayer.value.stats.hp_bonus,
                crit_rate: rest?.暴击率 ?? defaultsPlayer.value.stats.crit_rate,
                crit_damage: rest?.暴击伤害 ?? defaultsPlayer.value.stats.crit_damage
            },
            resources: {
                lingshi: rest?.灵石 ?? defaultsPlayer.value.resources.lingshi,
                shenshi: rest?.神石 ?? defaultsPlayer.value.resources.shenshi,
                exp: rest?.修为 ?? defaultsPlayer.value.resources.exp,
                exp_xueqi: rest?.血气 ?? defaultsPlayer.value.resources.exp_xueqi,
                modao: rest?.魔道值 ?? defaultsPlayer.value.resources.modao
            },
            progression: {
                zhenyaota_level: rest?.镇妖塔层数 ?? defaultsPlayer.value.progression.zhenyaota_level,
                shenpo_level: rest?.神魄段数 ?? defaultsPlayer.value.progression.shenpo_level,
                train_bonus: rest?.修炼效率提升 ?? defaultsPlayer.value.progression.train_bonus,
                lucky: rest?.幸运 ?? defaultsPlayer.value.progression.lucky,
                islucky: rest?.islucky ?? defaultsPlayer.value.progression.islucky,
                add_lucky_no: rest?.叠加幸运次数 ?? rest?.add_lucky_no ?? defaultsPlayer.value.progression.add_lucky_no
            },
            systems: {
                linggen: {
                    name: rest?.灵根?.name ?? defaultsPlayer.value.systems.linggen.name,
                    type: rest?.灵根?.type ?? defaultsPlayer.value.systems.linggen.type,
                    magnification: rest?.灵根?.法球倍率 ?? defaultsPlayer.value.systems.linggen.magnification
                },
                xianchong: {
                    name: rest?.仙宠?.name ?? defaultsPlayer.value.systems.xianchong.name,
                    type: rest?.仙宠?.type ?? defaultsPlayer.value.systems.xianchong.type,
                    bonus: rest?.仙宠?.加成 ?? defaultsPlayer.value.systems.xianchong.bonus
                },
                magic_ball_multiplier: rest?.法球倍率 ?? defaultsPlayer.value.systems.magic_ball_multiplier
            },
            skills: rest?.学习的功法 ?? defaultsPlayer.value.skills
        };
        return {
            value,
            version: 1
        };
    }
};
const parsePlayerData = (dataStr) => {
    return migrate(dataStr, defaultsPlayer, versions).value;
};

export { parsePlayerData };
