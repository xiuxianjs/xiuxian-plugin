import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import data from '../../../../model/XiuxianData.js';
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
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?维护护宗大阵.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    const player = await data.getData('player', usr_qq);
    if (!notUndAndNull(player.宗门)) {
        Send(Text('你尚未加入宗门'));
        return false;
    }
    if (!['宗主', '副宗主', '长老'].includes(player.宗门.职位)) {
        Send(Text('只有宗主、副宗主或长老可以操作'));
        return false;
    }
    const msg = e.MessageText.replace(/^#维护护宗大阵/, '');
    const lingshi = await convert2integer(msg);
    const ass = await data.getAssociation(player.宗门.宗门名称);
    if (ass === 'error') {
        Send(Text('宗门数据异常'));
        return false;
    }
    const association = ass;
    if (association.灵石池 < lingshi) {
        Send(Text(`宗门灵石池只有${ass.灵石池}灵石,数量不足`));
        return false;
    }
    let xian = 5;
    if (association.power == 1) {
        xian = 2;
    }
    association.大阵血量 = (association.大阵血量 || 0) + lingshi * xian;
    association.灵石池 = (association.灵石池 || 0) - lingshi;
    await data.setAssociation(association.宗门名称, association);
    Send(Text(`维护成功,宗门还有${ass.灵石池}灵石,护宗大阵增加了${lingshi * xian}血量`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
