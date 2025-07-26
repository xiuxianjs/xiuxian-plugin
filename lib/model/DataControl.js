import fs, { mkdirSync } from 'fs';
import path, { join } from 'path';
import { __PATH } from './paths.js';

const filePathMap = {
    player: __PATH.player_path,
    equipment: __PATH.equipment_path,
    najie: __PATH.najie_path,
    lib: __PATH.lib_path,
    Timelimit: __PATH.Timelimit,
    Level: __PATH.Level,
    association: __PATH.association,
    occupation: __PATH.occupation
};
const existDataByPath = (key, from, name) => {
    const dir = join(__PATH[key], from, `${name}.json`);
    return fs.existsSync(dir);
};
const readDataByPath = (key, from, name) => {
    try {
        const dir = join(__PATH[key], from, `${name}.json`);
        const data = fs.readFileSync(dir, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        logger.error('读取文件错误：' + error);
        return null;
    }
};
const writeDataByPath = (key, from, name, data) => {
    const dir = join(__PATH[key], from, `${name}.json`);
    const newData = JSON.stringify(data, null, '\t');
    if (fs.existsSync(dir)) {
        fs.writeFileSync(dir, newData, 'utf8');
    }
    else {
        mkdirSync(path.dirname(dir), { recursive: true });
        fs.writeFileSync(dir, newData, 'utf8');
    }
};
class DataControl {
    existData(file_path_type, file_name) {
        const dir = path.join(filePathMap[file_path_type] + '/' + file_name + '.json');
        if (fs.existsSync(dir)) {
            return true;
        }
        return false;
    }
    getData(file_name, user_qq) {
        let dir;
        if (user_qq) {
            dir = path.join(filePathMap[file_name] + '/' + user_qq + '.json');
        }
        else {
            dir = path.join(__PATH.lib_path + '/' + file_name + '.json');
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
    setData(file_name, user_qq, data) {
        let dir;
        if (user_qq) {
            dir = path.join(filePathMap[file_name] + '/' + user_qq + '.json');
        }
        else {
            dir = path.join(filePathMap.lib + '/' + file_name + '.json');
        }
        const new_ARR = JSON.stringify(data);
        if (fs.existsSync(dir)) {
            fs.writeFileSync(dir, new_ARR, 'utf-8');
        }
        return;
    }
}
var DataControl$1 = new DataControl();

export { DataControl$1 as default, existDataByPath, readDataByPath, writeDataByPath };
