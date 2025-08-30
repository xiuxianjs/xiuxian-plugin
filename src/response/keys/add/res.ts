import { getDataJSONParseByKey, isUserMonthCard, keys, setDataJSONStringifyByKey } from '@src/model';
import mw, { selects } from '../../mw';
import { Text, useMessage } from 'alemonjs';

export const regular = /^(#|＃|\/)?添加快捷/;

const max = 9;
const cmdMax = 3;

const res = onResponse(selects, async e => {
  const player = await getDataJSONParseByKey(keys.player(e.UserId));

  if (!player) {
    return;
  }

  const [message] = useMessage(e);

  const isCardUser = await isUserMonthCard(e.UserId);

  if (!isCardUser) {
    void message.send(format(Text('暂无该权益')));

    return;
  }

  const shortcuts = await getDataJSONParseByKey(keys.shortcut(e.UserId));

  if (Array.isArray(shortcuts) && shortcuts?.length >= max) {
    void message.send(format(Text('快捷指令已满，无法添加新快捷指令')));

    return;
  }

  const cmds = Array.isArray(shortcuts) ? shortcuts : [];

  // 按,切割
  const texts = e.MessageText.replace(regular, '')
    .split(/[,，]/)
    .map(v => v.trim())
    .filter(v => !!v);

  if (texts.length < 1 || texts.length > cmdMax) {
    void message.send(format(Text(`指令数量不合法，必须为1-${cmdMax}个`)));

    return;
  }

  if (texts.some(text => /快捷/.test(text))) {
    void message.send(format(Text('非法指令')));

    return;
  }

  cmds.push(texts);

  await setDataJSONStringifyByKey(keys.shortcut(e.UserId), cmds);

  void message.send(format(Text(`快捷指令添加成功:${texts.join('，')}`)));
});

export default onResponse(selects, [mw.current, res.current]);
