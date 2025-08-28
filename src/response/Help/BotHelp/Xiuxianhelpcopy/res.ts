import { Image, useSend } from 'alemonjs';
import { selects } from '@src/response/mw';
import { getConfig } from '@src/model';
import { screenshot } from '@src/image';
export const regular = /^(#|＃|\/)?修仙扩展(\d+)?$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const helpData = await getConfig('help', 'help2');
  const page = e.MessageText.match(/(\d+)/)?.[1]
    ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1')
    : 1;
  const pageSize = 2;
  const total = Math.ceil(helpData.length / pageSize);
  const data = helpData.slice((page - 1) * pageSize, page * pageSize);
  const img = await screenshot(
    'help',
    `help2-${page}`,
    {
      helpData: data,
      page: page,
      pageSize: pageSize,
      total: total
    },
    true
  );

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));
  }
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
