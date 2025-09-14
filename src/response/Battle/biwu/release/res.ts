import { Text, useSend } from 'alemonjs';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';
import { keysAction } from '@src/model/keys';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';

export const regular = /^(#|＃|\/)?释放技能.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const actionRes = await getDataJSONParseByKey(keysAction.bisai(userId));

  if (!actionRes) {
    void Send(Text('你不在战斗中'));

    return false;
  }

  const action = actionRes as any;
  const msg = e.MessageText.replace(/^(#|＃|\/)?释放技能/, '');
  const jineng = Number(msg) - 1;

  if (!action.技能?.[jineng]) {
    void Send(Text('技能选择无效'));

    return false;
  }

  const jinengData = await getDataList('Jineng');
  const skillConfig = jinengData.find(item => item.name === action.技能[jineng].name);

  if (!skillConfig) {
    void Send(Text('技能配置不存在'));

    return false;
  }

  if (action.技能[jineng].cd < skillConfig.cd) {
    void Send(Text(`${action.技能[jineng].name}技能cd中`));

    return false;
  }

  action.use = jineng;
  await setDataJSONStringifyByKey(keysAction.bisai(userId), action);
  void Send(Text(`选择成功,下回合释放技能:${action.技能[jineng].name}`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
