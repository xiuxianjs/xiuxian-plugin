import { __PATH } from './keys.js'
import Association from './Association.js'
import DataControl from './DataControl.js'
import DataListx from './DataList.js'

/**
 * 废弃
 * @deprecated
 */
export default {
  ...DataListx,
  /**
   * @deprecated
   */
  existData: DataControl.existData,
  /**
   * @deprecated
   */
  getData: DataControl.getData,
  /**
   * @deprecated
   */
  setData: DataControl.setData,
  /**
   * @deprecated
   */
  getAssociation: Association.getAssociation,
  /**
   * @deprecated
   */
  setAssociation: Association.setAssociation
}
