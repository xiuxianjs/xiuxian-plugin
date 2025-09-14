import { Text, useMessage, Image } from 'alemonjs';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { screenshot } from '@src/image';
import { getDataList } from '@src/model/DataList';
export const regular = /^(#|＃|\/)?禁地$/;

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const image = await screenshot('jindi', e.UserId, {
    didian_list: await getDataList('ForbiddenArea')
  });

  if (!image) {
    void message.send(format(Text('图片生成失败')));

    return;
  }
  void message.send(format(Image(image)));
});

export default onResponse(selects, [mw.current, res.current]);
