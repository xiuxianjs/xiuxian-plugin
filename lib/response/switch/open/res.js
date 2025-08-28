import { useState, useMessage, Text } from 'alemonjs';
import { createRequire } from 'module';
import mw from '../../mw.js';

const regular = /^(#|\/)?open:/;
const selects = onSelects(['message.create', 'private.message.create']);
const require = createRequire(import.meta.url);
const pkg = require('../../../../package.json');
const res = onResponse(selects, (event, next) => {
    if (!event.IsMaster) {
        return;
    }
    const name = event.MessageText.replace(regular, '');
    if (!new RegExp(`^${pkg.name}:`).test(name)) {
        return;
    }
    const [state, setState] = useState(name);
    if (state) {
        next();
        return;
    }
    setState(true);
    const [message] = useMessage(event);
    void message.send(format(Text('开启成功')));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular, selects };
