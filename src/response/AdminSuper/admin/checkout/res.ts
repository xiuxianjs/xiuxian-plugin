import { exec } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Text, useSend } from 'alemonjs';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';

const currentDir = dirname(fileURLToPath(import.meta.url));
const mdDir = join(currentDir, '../../../../../');

export const regular = /^(#|＃|\/)?修仙更新/;
const res = onResponse(selects, e => {
  const Send = useSend(e);
  if (!e.IsMaster) return;
  exec('git  pull', { cwd: mdDir }, function (error, stdout) {
    if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
      Send(Text('目前已经是最新版了~'));
      return;
    }
    if (error) {
      Send(Text('更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。'));
      return;
    }
    Send(Text('更新成功,请[#重启]'));
  });
});

export default onResponse(selects, [mw.current, res.current]);
