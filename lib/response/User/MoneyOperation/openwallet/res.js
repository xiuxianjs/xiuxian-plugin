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
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { addCoin } from '../../../../model/economy.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?打开钱包$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await await data.getData('player', usr_qq);
    const thing_name = '水脚脚的钱包';
    const acount = await existNajieThing(usr_qq, thing_name, '装备');
    if (!acount) {
        Send(Text(`你没有[${thing_name}]这样的装备`));
        return false;
    }
    await addNajieThing(usr_qq, thing_name, '装备', -1);
    const x = 0.4;
    const random1 = Math.random();
    const y = 0.3;
    const random2 = Math.random();
    const z = 0.2;
    const random3 = Math.random();
    const p = 0.1;
    const random4 = Math.random();
    let m = '';
    let lingshi = 0;
    if (random1 < x) {
        if (random2 < y) {
            if (random3 < z) {
                if (random4 < p) {
                    lingshi = 2000000;
                    m =
                        player.名号 +
                            '打开了[' +
                            thing_name +
                            ']金光一现！' +
                            lingshi +
                            '颗灵石！';
                }
                else {
                    lingshi = 1000000;
                    m =
                        player.名号 +
                            '打开了[' +
                            thing_name +
                            ']金光一现!' +
                            lingshi +
                            '颗灵石！';
                }
            }
            else {
                lingshi = 400000;
                m =
                    player.名号 +
                        '打开了[' +
                        thing_name +
                        ']你很开心的得到了' +
                        lingshi +
                        '颗灵石！';
            }
        }
        else {
            lingshi = 180000;
            m =
                player.名号 +
                    '打开了[' +
                    thing_name +
                    ']你很开心的得到了' +
                    lingshi +
                    '颗灵石！';
        }
    }
    else {
        lingshi = 100000;
        m =
            player.名号 +
                '打开了[' +
                thing_name +
                ']你很开心的得到了' +
                lingshi +
                '颗灵石！';
    }
    await addCoin(usr_qq, lingshi);
    Send(Text(m));
    return false;
});

export { res as default, regular };
