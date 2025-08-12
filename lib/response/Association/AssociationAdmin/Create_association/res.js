import { useMessage, Text, useSubscribe } from 'alemonjs';
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
import { notUndAndNull, timestampToTime } from '../../../../model/common.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import { setFileValue } from '../../../../model/cultivation.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?开宗立派$/;
var res = onResponse(selects, async (e) => {
    const usr_qq = e.UserId;
    const [message] = useMessage(e);
    const ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return;
    const player = await data.getData('player', usr_qq);
    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 22) {
        message.send(format(Text('修为达到化神再来吧')));
        return false;
    }
    if (notUndAndNull(player.宗门)) {
        message.send(format(Text('已经有宗门了')));
        return false;
    }
    if (player.灵石 < 10000) {
        message.send(format(Text('开宗立派是需要本钱的,攒到一万灵石再来吧')));
        return false;
    }
    message.send(format(Text('请发送宗门名字,一旦设立,无法再改,请慎重取名,(宗门名字最多6个中文字符)\n想改变主意请回复:【取消】')));
    const [subscribe] = useSubscribe(e, selects);
    const sub = subscribe.mount(async (event, next) => {
        const association_name = event.MessageText;
        if (/^(#|＃|\/)?取消$/.test(association_name)) {
            message.send(format(Text('已取消创建宗门')));
            clearTimeout(timeout);
            return;
        }
        if (!/^[\u4e00-\u9fa5]+$/.test(association_name)) {
            message.send(format(Text('宗门名字只能使用中文,请重新输入:\n想改变主意请回复:【取消】')));
            next();
            return;
        }
        if (association_name.length > 6) {
            message.send(format(Text('宗门名字最多只能设置6个字符,请重新输入:\n想改变主意请回复:【取消】')));
            next();
            return;
        }
        const ifexistass = await data.existData('association', association_name);
        if (ifexistass) {
            message.send(format(Text('该宗门已经存在,请重新输入:\n想改变主意请回复:【取消】')));
            next();
            return;
        }
        clearTimeout(timeout);
        const now = new Date();
        const nowTime = now.getTime();
        const date = timestampToTime(nowTime);
        const player = await data.getData('player', usr_qq);
        player.宗门 = {
            宗门名称: association_name,
            职位: '宗主',
            time: [date, nowTime]
        };
        data.setData('player', usr_qq, player);
        await new_Association(association_name, usr_qq, e);
        await setFileValue(usr_qq, -1e4, '灵石');
        message.send(format(Text('宗门创建成功')));
    }, ['UserId']);
    const timeout = setTimeout(() => {
        try {
            subscribe.cancel(sub);
            message.send(format(Text('创建宗门超时,已取消')));
        }
        catch (e) {
            logger.error('取消订阅失败', e);
        }
    }, 1000 * 60 * 1);
});
async function new_Association(name, holder_qq, e) {
    const usr_qq = e.UserId;
    const player = await data.getData('player', usr_qq);
    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    const isHigh = now_level_id > 41;
    const x = isHigh ? 1 : 0;
    const xian = isHigh ? 10 : 1;
    const dj = isHigh ? 42 : 1;
    const now = new Date();
    const nowTime = now.getTime();
    const date = timestampToTime(nowTime);
    const Association = {
        宗门名称: name,
        宗门等级: 1,
        创立时间: [date, nowTime],
        灵石池: 0,
        宗门驻地: 0,
        宗门建设等级: 0,
        宗门神兽: 0,
        宗主: holder_qq,
        副宗主: [],
        长老: [],
        内门弟子: [],
        外门弟子: [],
        所有成员: [holder_qq],
        药园: {
            药园等级: 1,
            作物: [{ name: '凝血草', start_time: nowTime, who_plant: holder_qq }]
        },
        维护时间: nowTime,
        大阵血量: 114514 * xian,
        最低加入境界: dj,
        power: x
    };
    data.setAssociation(name, Association);
    return;
}

export { res as default, regular };
