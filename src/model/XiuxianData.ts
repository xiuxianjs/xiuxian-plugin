import DataControl from './DataControl.js';
import DataListx from './DataList.js';

/**
 * 废弃
 * @deprecated
 */
export default {
  ...DataListx,
  /**
   * @deprecated
   */
  getData: DataControl.getData,
  /**
   * @deprecated
   */
  setData: DataControl.setData
};
