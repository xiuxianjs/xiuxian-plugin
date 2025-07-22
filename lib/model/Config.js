import YAML from 'yaml';
import fs from 'fs';
import fileUrl$8 from '../config/help/Association.yaml.js';
import fileUrl$7 from '../config/help/help.yaml.js';
import fileUrl$6 from '../config/help/helpcopy.yaml.js';
import fileUrl$5 from '../config/help/set.yaml.js';
import fileUrl$4 from '../config/help/shituhelp.yaml.js';
import fileUrl$3 from '../config/parameter/namelist.yaml.js';
import fileUrl$2 from '../config/task/task.yaml.js';
import fileUrl$1 from '../config/version/version.yaml.js';
import fileUrl from '../config/xiuxian/xiuxian.yaml.js';

const paths = {
    Association: fileUrl$8,
    help: fileUrl$7,
    helpcopy: fileUrl$6,
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
        return data;
    }
}
var config = new Config();

export { config as default };
