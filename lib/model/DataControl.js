import fs from 'fs';
import path from 'path';
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
class DataControl {
    existData(file_path_type, file_name) {
        let file_path = filePathMap[file_path_type];
        let dir = path.join(file_path + '/' + file_name + '.json');
        if (fs.existsSync(dir)) {
            return true;
        }
        return false;
    }
    getData(file_name, user_qq) {
        let file_path;
        let dir;
        let data;
        if (user_qq) {
            file_path = filePathMap[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        }
        else {
            file_path = __PATH.lib_path;
            dir = path.join(file_path + '/' + file_name + '.json');
        }
        try {
            data = fs.readFileSync(dir, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData;
        }
        catch (error) {
            logger.error('读取文件错误：' + error);
            return 'error';
        }
    }
    setData(file_name, user_qq, data) {
        let file_path;
        let dir;
        if (user_qq) {
            file_path = filePathMap[file_name];
            dir = path.join(file_path + '/' + user_qq + '.json');
        }
        else {
            file_path = filePathMap.lib;
            dir = path.join(file_path + '/' + file_name + '.json');
        }
        const new_ARR = JSON.stringify(data);
        if (fs.existsSync(dir)) {
            fs.writeFileSync(dir, new_ARR, 'utf-8');
        }
        return;
    }
}
var DataControl$1 = new DataControl();

export { DataControl$1 as default };
