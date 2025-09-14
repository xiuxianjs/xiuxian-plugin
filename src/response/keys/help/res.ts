import { getDataJSONParseByKey, keys } from '@src/model';
import mw, { selects } from '../../mw-captcha';
import { Text, useMessage } from 'alemonjs';
import { cmdMax, lengthMax } from '../config';

export const regular = /^(#|＃|\/)?快捷帮助/;

const res = onResponse(selects, async e => {
  const player = await getDataJSONParseByKey(keys.player(e.UserId));

  if (!player) {
    return;
  }

  const [message] = useMessage(e);

  // 获取当前快捷指令列表
  const shortcuts = await getDataJSONParseByKey(keys.shortcut(e.UserId));

  let helpText = '📋 快捷指令使用说明：\n\n';

  helpText += '🔧 添加快捷指令：\n';
  helpText += '格式：添加快捷 指令1,指令2,指令3\n';
  helpText += '示例：添加快捷 修炼,打坐,炼丹\n\n';

  helpText += '🗑️ 移除快捷指令：\n';
  helpText += '格式：移除快捷 编号\n';
  helpText += '示例：移除快捷1\n\n';

  helpText += '⚡ 使用快捷指令：\n';
  helpText += '格式：快捷+编号\n';
  helpText += '示例：快捷1\n\n';

  helpText += '📊 当前快捷指令列表：\n';

  if (Array.isArray(shortcuts) && shortcuts.length > 0) {
    shortcuts.forEach((shortcut, index) => {
      const shortcutText = Array.isArray(shortcut) ? shortcut.join('，') : shortcut;

      helpText += `${index + 1}. ${shortcutText}\n`;
    });
  } else {
    helpText += '暂无快捷指令\n';
  }

  helpText += '\n💡 提示：\n';
  helpText += `- 最多可设置${lengthMax}个快捷指令\n`;
  helpText += `- 每个快捷指令最多包含${cmdMax}个命令\n`;
  helpText += '- 命令之间用逗号分隔\n';
  helpText += '- 指令按前后顺序执行';

  void message.send(format(Text(helpText)));
});

export default onResponse(selects, [mw.current, res.current]);
