import { Text, useMessage, useState } from 'alemonjs';
import { createRequire } from 'module';
import mw from '@src/response/mw';
export const regular = /^(#|\/)?close:/;
export const selects = onSelects(['message.create', 'private.message.create']);
const require = createRequire(import.meta.url);
const pkg = require('../../../package.json') as {
  name: string;
};
const res = onResponse(selects, (event, next) => {
  if (!event.IsMaster) {
    return;
  }
  //  /close:login
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

  message.send(format(Text('关闭成功')));
});

export default onResponse(selects, [mw.current, res.current]);
