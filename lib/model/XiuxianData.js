import DataControl from './DataControl.js';
import DataListx from './DataList.js';

var data = {
    ...DataListx,
    getData: DataControl.getData,
    setData: DataControl.setData
};

export { data as default };
