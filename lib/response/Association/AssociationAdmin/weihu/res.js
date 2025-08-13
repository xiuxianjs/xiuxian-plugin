import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { notUndAndNull } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
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
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?维护护宗大阵.*$/;
var res = onResponse(selects, async (e) => {
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

export { res as default, regular };
