import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import { notUndAndNull, getRandomFromARR } from '../../../../model/common.js';
import { redis } from '../../../../model/api.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { getConfig } from '../../../../model/Config.js';
import { readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import { isKeys } from '../../../../model/utils/isKeys.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?退出宗门$/;
function isPlayerGuildInfo(val) {
    return !!val && typeof val === 'object' && '宗门名称' in val && '职位' in val;
}
function getRoleList(ass, role) {
    const raw = ass[role];
    return Array.isArray(raw) ? raw.filter(i => typeof i === 'string') : [];
}
function setRoleList(ass, role, list) {
    ass[role] = list;
}
function ensureStringArray(v) {
    return Array.isArray(v) ? v.filter(i => typeof i === 'string') : [];
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    if (!notUndAndNull(player?.宗门)) {
        return;
    }
    if (!isKeys(player.宗门, ['宗门名称', '职位'])) {
        void Send(Text('宗门信息不完整'));
        return;
    }
    const guildInfo = player.宗门;
    const nowTime = Date.now();
    const cfg = await getConfig('xiuxian', 'xiuxian');
    const timeCfg = cfg.CD.joinassociation;
    const joinTuple = guildInfo.time || guildInfo.加入时间;
    if (joinTuple && Array.isArray(joinTuple) && joinTuple.length >= 2) {
        const addTime = joinTuple[1] + 60000 * timeCfg;
        if (addTime > nowTime) {
            void Send(Text(`加入宗门不满${timeCfg}分钟,无法退出`));
            return false;
        }
    }
    const role = guildInfo.职位;
    const ass = await getDataJSONParseByKey(keys.association(guildInfo.宗门名称));
    if (!ass) {
        return;
    }
    if (role !== '宗主') {
        const roleList = getRoleList(ass, role).filter(item => item !== userId);
        setRoleList(ass, role, roleList);
        ass.所有成员 = ensureStringArray(ass.所有成员).filter(i => i !== userId);
        void setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
        delete player.宗门;
        await writePlayer(userId, player);
        await playerEfficiency(userId);
        void Send(Text('退出宗门成功'));
    }
    else {
        ass.所有成员 = ensureStringArray(ass.所有成员);
        if (ass.所有成员.length < 2) {
            await redis.del(keys.association(guildInfo.宗门名称));
            delete player.宗门;
            player.favorability = 0;
            await writePlayer(userId, player);
            await playerEfficiency(userId);
            void Send(Text('退出宗门成功,退出后宗门空无一人。\n一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'));
        }
        else {
            ass.所有成员 = ass.所有成员.filter(item => item !== userId);
            delete player.宗门;
            player.favorability = 0;
            await writePlayer(userId, player);
            await playerEfficiency(userId);
            const fz = getRoleList(ass, '副宗主');
            const zl = getRoleList(ass, '长老');
            const nmdz = getRoleList(ass, '内门弟子');
            let randmemberId;
            if (fz.length > 0) {
                randmemberId = getRandomFromARR(fz);
            }
            else if (zl.length > 0) {
                randmemberId = getRandomFromARR(zl);
            }
            else if (nmdz.length > 0) {
                randmemberId = getRandomFromARR(nmdz);
            }
            else {
                randmemberId = getRandomFromARR(ass.所有成员);
            }
            const randmember = await readPlayer(randmemberId);
            if (!randmember || !isPlayerGuildInfo(randmember.宗门)) {
                void Send(Text('随机继任者数据错误'));
                return false;
            }
            const rGuild = randmember.宗门;
            const oldList = getRoleList(ass, rGuild.职位).filter(i => i !== randmemberId);
            setRoleList(ass, rGuild.职位, oldList);
            setRoleList(ass, '宗主', [randmemberId]);
            rGuild.职位 = '宗主';
            await writePlayer(randmemberId, randmember);
            await writePlayer(userId, player);
            void setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
            void Send(Text(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`));
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
