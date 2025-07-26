import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, existNajieThing, find_qinmidu, fstadd_qinmidu, add_qinmidu, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?^赠予百合花篮$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0) {
        return;
    }
    const User = Mentions.find(item => !item.IsBot);
    if (!User) {
        return;
    }
    let B = User.UserId;
    let A = e.UserId;
    let ifexistplay = await existplayer(A);
    if (!ifexistplay)
        return false;
    if (A == B) {
        Send(Text('精神分裂?'));
        return false;
    }
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    let ishavejz = await existNajieThing(A, '百合花篮', '道具');
    if (!ishavejz) {
        Send(Text('你没有[百合花篮]'));
        return false;
    }
    let pd = await find_qinmidu(A, B);
    if (pd == false) {
        await fstadd_qinmidu(A, B);
    }
    else if (pd == 0) {
        Send(Text(`对方已有道侣`));
        return false;
    }
    await add_qinmidu(A, B, 60);
    await addNajieThing(A, '百合花篮', '道具', -1);
    Send(Text(`你们的亲密度增加了60`));
});

export { res as default, regular };
