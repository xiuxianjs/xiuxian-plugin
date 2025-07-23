import { useSend, Text } from 'alemonjs';
import { exec } from 'child_process';
import { selects } from '../../../index.js';

const regular = /^(#|\/)修仙更新/;
var res = onResponse(selects, e => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    exec('git  pull', { cwd: `${process.cwd()}` }, function (error, stdout) {
        if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
            Send(Text('目前已经是最新版xiuxian@1.3.0了~'));
            return false;
        }
        if (error) {
            Send(Text('xiuxian@1.3.0更新失败！\nError code: ' +
                error.code +
                '\n' +
                error.stack +
                '\n 请稍后重试。'));
            return false;
        }
        Send(Text('更新成功,请[#重启]'));
    });
    return false;
});

export { res as default, regular };
