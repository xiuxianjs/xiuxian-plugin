import Association from './Association.js';
import DataControl from './DataControl.js';
import DataList from './DataList.js';

var data = {
    ...DataList,
    existData: DataControl.existData,
    getData: DataControl.getData,
    setData: DataControl.setData,
    getAssociation: Association.getAssociation,
    setAssociation: Association.setAssociation
};

export { data as default };
