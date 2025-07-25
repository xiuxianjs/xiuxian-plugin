import Association from './Association.js';
import DataControl from './DataControl.js';
import { DataList } from './DataList.js';

class XiuxianData extends DataList {
    constructor() {
        super();
    }
    existData = DataControl.existData;
    getData = DataControl.getData;
    setData = DataControl.setData;
    getAssociation = Association.getAssociation;
    setAssociation = Association.setAssociation;
}
var data = new XiuxianData();

export { data as default };
