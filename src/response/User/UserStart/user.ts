import { Image, PrivateEventMessageCreate, EventsMessageCreateEnum, useSend, Text } from 'alemonjs';
import { existplayer } from '@src/model/index';
import { getPlayerImage } from '@src/model/image';

export async function Show_player(e: EventsMessageCreateEnum | PrivateEventMessageCreate) {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  if (!(await existplayer(usr_qq))) { return false; }
  try {
    const img = await getPlayerImage(e);

    if (Buffer.isBuffer(img)) {
      Send(Image(img));

      return false;
    }
    Send(Text('图片加载失败'));

    return false;
  } catch {
    Send(Text('角色卡生成失败'));

    return false;
  }
}
