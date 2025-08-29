import { Image, useSend } from 'alemonjs';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { screenshot } from '@src/image';
import { getConfig } from '@src/model';
export const regular = /^(#|＃|\/)?师徒帮助(\d+)?$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const helpData = await getConfig('help', 'shituhelp');
  const page = e.MessageText.match(/(\d+)/)?.[1] ? parseInt(e.MessageText.match(/(\d+)/)?.[1] || '1') : 1;
  const pageSize = 2;
  const total = Math.ceil(helpData.length / pageSize);
  const data = helpData.slice((page - 1) * pageSize, page * pageSize);
  const img = await screenshot(
    'help',
    `shituhelp-${page}`,
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

export default onResponse(selects, [mw.current, res.current]);
