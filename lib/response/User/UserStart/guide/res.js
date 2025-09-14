import mw, { selects } from '../../../mw-captcha.js';
import { useMessage, Text, useSubscribe } from 'alemonjs';

const regular = /^(#|＃|\/)?新手引导$/;
const texts = ['1.新手可发送‘#新手礼包’领取新手礼包', '2.发送‘#修仙帮助’查看帮助图', '3.发送‘我’查看个人信息', '4.发送‘#我的纳戒’查看纳戒'];
const res = onResponse(selects, e => {
    const [message] = useMessage(e);
    void message.send(format(Text('新手引导开始，可发送‘退出新手引导’退出，发送其他任意内容进入下一步')));
    const [subscribe] = useSubscribe(e, selects);
    let num = 0;
    const sub = subscribe.mount((event, next) => {
        const [message] = useMessage(event);
        if (event.MessageText === '退出新手引导') {
            void message.send(format(Text('新手引导结束')));
            clearTimeout(timeout);
        }
        else {
            void message.send(format(Text(texts[num])));
            num++;
            if (num === texts.length) {
                void message.send(format(Text('新手引导结束')));
                clearTimeout(timeout);
            }
            else {
                next();
            }
        }
    }, ['UserId']);
    const timeout = setTimeout(() => {
        subscribe.cancel(sub);
        void message.send(format(Text('超时自动取消操作')));
    }, 1000 * 60 * 5);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
