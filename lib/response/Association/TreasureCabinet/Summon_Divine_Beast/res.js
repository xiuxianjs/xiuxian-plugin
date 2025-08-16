import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/association.yaml.js';
import '../../../../config/help/base.yaml.js';
import '../../../../config/help/extensions.yaml.js';
import '../../../../config/help/admin.yaml.js';
import '../../../../config/help/professor.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import data from '../../../../model/XiuxianData.js';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { notUndAndNull } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
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
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?召唤神兽$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await data.existData('player', usr_qq)))
        return false;
    const player = (await data.getData('player', usr_qq));
    if (!player ||
        !notUndAndNull(player.宗门) ||
        !isPlayerGuildRef(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    if (player.宗门.职位 !== '宗主') {
        Send(Text('只有宗主可以操作'));
        return false;
    }
    const assRaw = await data.getAssociation(player.宗门.宗门名称);
    if (assRaw === 'error' || !isExtAss(assRaw)) {
        Send(Text('宗门数据不存在'));
        return false;
    }
    const ass = assRaw;
    const level = Math.max(0, Number(ass.宗门等级 || 0));
    const buildLevel = Math.max(0, Number(ass.宗门建设等级 || 0));
    const site = ass.宗门驻地;
    const pool = Math.max(0, Number(ass.灵石池 || 0));
    const beast = ass.宗门神兽;
    const cost = 2_000_000;
    if (level < 8) {
        Send(Text('宗门等级不足，尚不具备召唤神兽的资格'));
        return false;
    }
    if (buildLevel < 50) {
        Send(Text('宗门建设等级不足, 先提升建设度再来吧'));
        return false;
    }
    if (!site || site === 0) {
        Send(Text('驻地都没有，让神兽跟你流浪啊？'));
        return false;
    }
    if (pool < cost) {
        Send(Text('宗门就这点钱，还想神兽跟着你干活？'));
        return false;
    }
    if (beast && beast !== 0 && beast !== '0' && beast !== '无') {
        Send(Text('你的宗门已经有神兽了'));
        return false;
    }
    const r = Math.random();
    let newBeast;
    if (r > 0.8)
        newBeast = '麒麟';
    else if (r > 0.6)
        newBeast = '青龙';
    else if (r > 0.4)
        newBeast = '玄武';
    else if (r > 0.2)
        newBeast = '朱雀';
    else
        newBeast = '白虎';
    ass.宗门神兽 = newBeast;
    ass.灵石池 = pool - cost;
    await data.setAssociation(ass.宗门名称, ass);
    Send(Text(`召唤成功，神兽 ${newBeast} 投下一道分身，开始守护你的宗门，绑定神兽后不可更换哦`));
    return false;
});

export { res as default, regular };
