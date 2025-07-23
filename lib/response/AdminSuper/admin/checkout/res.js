import { useSend, Text } from 'alemonjs';
import { exec } from 'child_process';
import { selects } from '../../../index.js';
import { createRequire } from 'module';
import { dirname } from 'path';

const regular = /^(#|\/)修仙更新/;
const require = createRequire(import.meta.url);
const mdDir = dirname(require.resolve('../../../../../README_DEV.md'));
var res = onResponse(selects, e => {
    const Send = useSend(e);
    exec('git  pull', { cwd: mdDir }, function (error, stdout) {
        if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
            Send(Text('目前已经是最新版了~'));
            return false;
        }
        if (error) {
            Send(Text('更新失败！\nError code: ' +
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
