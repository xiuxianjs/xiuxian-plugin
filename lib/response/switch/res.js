import { useState, useMessage, Text } from 'alemonjs';
import { createRequire } from 'module';
import mw from '../mw-captcha.js';

const regular = /^(#|\/)?close:/;
const selects = onSelects(['message.create', 'private.message.create']);
const require$1 = createRequire(import.meta.url);
const pkg = require$1('../../../package.json');
const res = onResponse(selects, (event, next) => {
    if (!event.IsMaster) {
        return;
    }
    const name = event.MessageText.replace(regular, '');
    if (!new RegExp(`^${pkg.name}:`).test(name)) {
        return;
    }
    const [state, setState] = useState(name);
    if (!state) {
        next();
        return;
    }
    setState(false);
    const [message] = useMessage(event);
    void message.send(format(Text('关闭成功')));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular, selects };
