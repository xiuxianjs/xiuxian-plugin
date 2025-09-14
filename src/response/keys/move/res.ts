import { getDataJSONParseByKey, keys, setDataJSONStringifyByKey } from '@src/model';
import mw, { selects } from '../../mw-captcha';
import { Text, useMessage } from 'alemonjs';

export const regular = /^(#|＃|\/)?移除快捷/;

const res = onResponse(selects, async e => {
  const player = await getDataJSONParseByKey(keys.player(e.UserId));

  if (!player) {
    return;
  }

  const [message] = useMessage(e);

  // 获取当前快捷指令列表
  const shortcuts = await getDataJSONParseByKey(keys.shortcut(e.UserId));

  if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
    void message.send(format(Text('您还没有设置任何快捷指令')));

    return;
  }

  // 解析用户输入的索引
  const inputText = e.MessageText.replace(regular, '').trim();

  if (!inputText) {
    void message.send(format(Text('请输入要移除的快捷指令编号，例如：移除快捷1')));

    return;
  }

  // 验证输入是否为有效数字
  const index = parseInt(inputText);

  if (isNaN(index) || index < 1 || index > shortcuts.length) {
    void message.send(format(Text(`快捷指令编号无效，请输入1-${shortcuts.length}之间的数字`)));

    return;
  }

  // 移除指定索引的快捷指令（数组索引从0开始，用户输入从1开始）
  const removedShortcut = shortcuts.splice(index - 1, 1)[0];

  // 保存更新后的快捷指令列表
  await setDataJSONStringifyByKey(keys.shortcut(e.UserId), shortcuts);

  // 构建移除的指令显示文本
  const removedText = Array.isArray(removedShortcut) ? removedShortcut.join('，') : removedShortcut;

  void message.send(format(Text(`快捷指令移除成功！已移除：${removedText}`)));
});

export default onResponse(selects, [mw.current, res.current]);
