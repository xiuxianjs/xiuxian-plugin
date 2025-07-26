import fs from 'fs';
import path from 'path';
import { __PATH } from './paths.js';

class Association {
    getAssociation(file_name) {
        const dir = path.join(__PATH.association + '/' + file_name + '.json');
        if (!fs.existsSync(dir)) {
            return 'error';
        }
        try {
            const data = fs.readFileSync(dir, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            logger.error('读取文件错误：' + error);
            return 'error';
        }
    }
    setAssociation(file_name, data) {
        const dir = path.join(__PATH.association + '/' + file_name + '.json');
        const new_ARR = JSON.stringify(data);
        fs.writeFileSync(dir, new_ARR, 'utf-8');
        return;
    }
}
var Association$1 = new Association();

export { Association$1 as default };
