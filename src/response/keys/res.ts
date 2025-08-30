import { getDataJSONParseByKey, isUserMonthCard, keys } from '@src/model';
import { useMessage, Text, expendCycle } from 'alemonjs';
import mw, { selects } from '../mw';
import _ from 'lodash';

export const regular = /^(#|＃|\/)?快捷\d+/;

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

  // 获取当前快捷指令列表
  const shortcuts = await getDataJSONParseByKey(keys.shortcut(e.UserId));

  if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
    void message.send(format(Text('您还没有设置任何快捷指令，请先使用"快捷帮助"查看使用方法')));

    return;
  }

  // 解析用户输入的编号
  const match = e.MessageText.match(/^(#|＃|\/)?快捷(\d+)$/);

  if (!match) {
    void message.send(format(Text('快捷指令格式错误，请使用"快捷+编号"的格式，例如：快捷1')));

    return;
  }

  const index = parseInt(match[2]);

  if (index < 1 || index > shortcuts.length) {
    void message.send(format(Text(`快捷指令编号无效，请输入1-${shortcuts.length}之间的数字`)));

    return;
  }

  // 获取对应的快捷指令
  const texts = shortcuts[index - 1];

  if (!Array.isArray(texts) || texts.length === 0) {
    void message.send(format(Text('该快捷指令为空，请重新设置')));

    return;
  }

  void message.send(format(Text(`开始执行快捷指令： ${texts.join('，')}`)));

  // 每3秒执行一个指令
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];

    setTimeout(
      () => {
        const event = _.cloneDeep(e);

        event.MessageText = text;

        // 当访问value的时候获取原始的data
        Object.defineProperty(event, 'value', {
          get() {
            return e.value;
          }
        });

        void expendCycle(event, e.name);
      },
      (i + 1) * 6000
    ); // 每6秒执行一个
  }
});

export default onResponse(selects, [mw.current, res.current]);
