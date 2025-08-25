import Association from './Association.js';
import DataControl from './DataControl.js';
import DataListx, { setDataList, getDataList } from './DataList.js';

var data = {
    ...DataListx,
    getDataList,
    setDataList,
    existData: DataControl.existData,
    getData: DataControl.getData,
    setData: DataControl.setData,
    getAssociation: Association.getAssociation,
    setAssociation: Association.setAssociation
};

export { data as default };
