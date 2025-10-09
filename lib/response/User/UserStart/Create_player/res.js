import { useSend, Image, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { keys, keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import { getAvatar } from '../../../../model/utils/utilsx.js';
import { getDataList } from '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import { writeEquipment } from '../../../../model/equipment.js';
import { writePlayer, writeNajie } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import { addHP } from '../../../../model/economy.js';
import 'svg-captcha';
import 'sharp';
import { getRandomTalent } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { writeDanyao } from '../../../../model/danyao.js';
import { getPlayerImage } from '../../../../model/image.js';
import 'crypto';
import 'lodash-es';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?(我|我的练气|个人信息|我的信息|踏入仙途)$/;
function normalizeTalent(t) {
    if (t && typeof t === 'object') {
        const obj = t;
        const eff = typeof obj.eff === 'number' ? obj.eff : 0;
        return { ...obj, eff };
    }
    return { eff: 0 };
}
async function pickEquip(name) {
    const equipmentData = await getDataList('Equipment');
    return equipmentData.find(i => i.name === name) || null;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ex = await redis.exists(keys.player(userId));
    if (ex > 0) {
        const img = await getPlayerImage(e);
        if (Buffer.isBuffer(img)) {
            void Send(Image(img));
            return;
        }
        void Send(Text('图片加载失败'));
        return;
    }
    const userList = await keysByPath(__PATH.player_path);
    const n = userList.length + 1;
    const talentRaw = await getRandomTalent();
    const talent = normalizeTalent(talentRaw);
    const newPlayer = {
        id: userId,
        sex: 0,
        名号: `路人甲${n}号`,
        宣言: '这个人很懒还没有写',
        avatar: e.UserAvatar ?? getAvatar('1715713638'),
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
        occupation: '',
        occupation_level: 1,
        镇妖塔层数: 0,
        神魄段数: 0,
        魔道值: 0,
        仙宠: {
            name: '',
            type: '',
            加成: 0,
            灵魂绑定: 0,
            等级: 0,
            每级增加: 0,
            等级上限: 0
        },
        练气皮肤: 0,
        装备皮肤: 0,
        幸运: 0,
        addluckyNo: 0,
        师徒任务阶段: 0,
        师徒积分: 0,
        血量上限: 0,
        攻击: 0,
        防御: 0,
        暴击率: 0,
        暴击伤害: 0,
        金银坊败场: 0,
        金银坊支出: 0,
        金银坊胜场: 0,
        金银坊收入: 0,
        occupation_exp: 0,
        锻造天赋: 0,
        隐藏灵根: undefined,
        神界次数: 0,
        法球倍率: 0
    };
    await writePlayer(userId, newPlayer);
    const newQquipment = {
        武器: await pickEquip('烂铁匕首'),
        护具: await pickEquip('破铜护具'),
        法宝: await pickEquip('廉价炮仗')
    };
    await writeEquipment(userId, newQquipment);
    const newNajie = {
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
        仙宠口粮: [],
        武器: null,
        护具: null,
        法宝: null
    };
    await writeNajie(userId, newNajie);
    await addHP(userId, 999999);
    const danyaoInit = {
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
    await writeDanyao(userId, danyaoInit);
    const img = await getPlayerImage(e);
    void Send(Text('发送‘新手引导’进入引导'));
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
        return false;
    }
    void Send(Text('图片加载失败'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
