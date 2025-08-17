import { useSend, Text } from 'alemonjs';
import { __PATH } from '../../../../model/keys.js';
import { notUndAndNull, getRandomFromARR } from '../../../../model/common.js';
import { playerEfficiency } from '../../../../model/efficiency.js';
import { redis } from '../../../../model/api.js';
import { selects } from '../../../index.js';
import { getConfig } from '../../../../model/Config.js';
import '@alemonjs/db';
import data from '../../../../model/XiuxianData.js';
import '../../../../model/repository/playerRepository.js';
import '../../../../model/repository/najieRepository.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?退出宗门$/;
function isPlayerGuildInfo(val) {
    return !!val && typeof val === 'object' && '宗门名称' in val && '职位' in val;
}
function getRoleList(ass, role) {
    const raw = ass[role];
    return Array.isArray(raw)
        ? raw.filter(i => typeof i === 'string')
        : [];
}
function setRoleList(ass, role, list) {
    ass[role] = list;
}
function ensureStringArray(v) {
    return Array.isArray(v)
        ? v.filter(i => typeof i === 'string')
        : [];
}
function serializePlayer(p) {
    const result = {};
    for (const [k, v] of Object.entries(p)) {
        if (typeof v === 'function')
            continue;
        if (v && typeof v === 'object') {
            if (Array.isArray(v)) {
                result[k] = v.filter(x => typeof x !== 'function');
            }
            else {
                const obj = {};
                for (const [ik, iv] of Object.entries(v)) {
                    if (typeof iv === 'function')
                        continue;
                    if (iv && typeof iv === 'object') {
                        obj[ik] = JSON.parse(JSON.stringify(iv));
                    }
                    else
                        obj[ik] = iv;
                }
                result[k] = obj;
            }
        }
        else {
            result[k] = v;
        }
    }
    return result;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player)
        return false;
    if (!notUndAndNull(player.宗门))
        return false;
    if (!isPlayerGuildInfo(player.宗门))
        return false;
    const guildInfo = player.宗门;
    const nowTime = Date.now();
    const timeCfg = (await getConfig('xiuxian', 'xiuxian')).CD.joinassociation;
    const joinTuple = guildInfo.time || guildInfo.加入时间;
    if (joinTuple && Array.isArray(joinTuple) && joinTuple.length >= 2) {
        const addTime = joinTuple[1] + 60000 * timeCfg;
        if (addTime > nowTime) {
            Send(Text(`加入宗门不满${timeCfg}分钟,无法退出`));
            return false;
        }
    }
    const role = guildInfo.职位;
    const assRaw = await data.getAssociation(guildInfo.宗门名称);
    if (assRaw === 'error') {
        Send(Text('宗门数据错误'));
        return false;
    }
    const ass = assRaw;
    if (role !== '宗主') {
        const roleList = getRoleList(ass, role).filter(item => item !== usr_qq);
        setRoleList(ass, role, roleList);
        ass.所有成员 = ensureStringArray(ass.所有成员).filter(i => i !== usr_qq);
        await data.setAssociation(ass.宗门名称, ass);
        delete player.宗门;
        await data.setData('player', usr_qq, serializePlayer(player));
        await playerEfficiency(usr_qq);
        Send(Text('退出宗门成功'));
    }
    else {
        ass.所有成员 = ensureStringArray(ass.所有成员);
        if (ass.所有成员.length < 2) {
            await redis.del(`${__PATH.association}:${guildInfo.宗门名称}`);
            delete player.宗门;
            await data.setData('player', usr_qq, serializePlayer(player));
            await playerEfficiency(usr_qq);
            Send(Text('退出宗门成功,退出后宗门空无一人。\n一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'));
        }
        else {
            ass.所有成员 = ass.所有成员.filter(item => item !== usr_qq);
            delete player.宗门;
            await data.setData('player', usr_qq, serializePlayer(player));
            await playerEfficiency(usr_qq);
            const fz = getRoleList(ass, '副宗主');
            const zl = getRoleList(ass, '长老');
            const nmdz = getRoleList(ass, '内门弟子');
            let randmember_qq;
            if (fz.length > 0)
                randmember_qq = await getRandomFromARR(fz);
            else if (zl.length > 0)
                randmember_qq = await getRandomFromARR(zl);
            else if (nmdz.length > 0)
                randmember_qq = await getRandomFromARR(nmdz);
            else
                randmember_qq = await getRandomFromARR(ass.所有成员);
            const randmember = (await data.getData('player', randmember_qq));
            if (!randmember || !isPlayerGuildInfo(randmember.宗门)) {
                Send(Text('随机继任者数据错误'));
                return false;
            }
            const rGuild = randmember.宗门;
            const oldList = getRoleList(ass, rGuild.职位).filter(i => i !== randmember_qq);
            setRoleList(ass, rGuild.职位, oldList);
            setRoleList(ass, '宗主', [randmember_qq]);
            rGuild.职位 = '宗主';
            await data.setData('player', randmember_qq, serializePlayer(randmember));
            await data.setData('player', usr_qq, serializePlayer(player));
            await data.setAssociation(ass.宗门名称, ass);
            Send(Text(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`));
        }
    }
    player.favorability = 0;
    await data.setData('player', usr_qq, serializePlayer(player));
});

export { res as default, regular };
