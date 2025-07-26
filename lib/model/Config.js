import YAML from 'yaml';
import fs from 'fs';
import { join } from 'path';
import { __PATH_CONFIG } from './paths.js';
import { createRequire } from 'module';

const pkg = createRequire(import.meta.url)('../../package.json');
const configPath = join(process.cwd(), 'config');
function getConfig(_app, name) {
    const fileURL = __PATH_CONFIG[name];
    const data = YAML.parse(fs.readFileSync(fileURL, 'utf8'));
    const curPath = join(configPath, pkg.name, `${name}.yaml`);
    if (fs.existsSync(curPath)) {
        const curData = YAML.parse(fs.readFileSync(curPath, 'utf8'));
        return {
            ...data,
            ...curData
        };
    }
    return data;
}
class Config {
    getConfig = getConfig;
}
var config = new Config();

export { config as default, getConfig };
