import YAML from 'yaml';
import fs from 'fs';
import fileUrl$8 from '../config/Association.yaml.js';
import fileUrl$7 from '../config/help.yaml.js';
import fileUrl$6 from '../config/help2.yaml.js';
import fileUrl$5 from '../config/set.yaml.js';
import fileUrl$4 from '../config/shituhelp.yaml.js';
import fileUrl$3 from '../config/namelist.yaml.js';
import fileUrl$2 from '../config/task.yaml.js';
import fileUrl$1 from '../config/version.yaml.js';
import fileUrl from '../config/xiuxian.yaml.js';
import { join } from 'path';

const paths = {
    Association: fileUrl$8,
    help: fileUrl$7,
    help2: fileUrl$6,
    set: fileUrl$5,
    shituhelp: fileUrl$4,
    namelist: fileUrl$3,
    task: fileUrl$2,
    version: fileUrl$1,
    xiuxian: fileUrl
};
class Config {
    getConfig(_app, name) {
        const fileURL = paths[name];
        const data = YAML.parse(fs.readFileSync(fileURL, 'utf8'));
        const curPath = join(process.cwd(), 'config', 'alemonjs-xiuxian', `${name}.yaml`);
        if (fs.existsSync(curPath)) {
            const curData = YAML.parse(fs.readFileSync(curPath, 'utf8'));
            return {
                ...data,
                ...curData
            };
        }
        return data;
    }
}
var config = new Config();

export { config as default };
