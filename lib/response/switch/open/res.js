import { useState, useMessage, Text } from 'alemonjs';
import { createRequire } from 'module';

const regular = /^(#|\/)?open:/;
const selects = onSelects(['message.create', 'private.message.create']);
const require = createRequire(import.meta.url);
const pkg = require('../../../../package.json');
var res = onResponse(selects, (event, next) => {
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
    message.send(format(Text('开启成功')));
    return;
});

export { res as default, regular, selects };
