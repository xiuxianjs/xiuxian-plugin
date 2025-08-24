import { __PATH } from './keys.js'
import Association from './Association.js'
import DataControl from './DataControl.js'
import DataListx from './DataList.js'
import { getDataList, setDataList } from './DataList.js'

/**
 * 废弃
 * @deprecated
 */
export default {
  ...DataListx,
  // 注意：DataList 的默认导出已被移除，请使用 getDataList 和 setDataList 函数
  getDataList,
  setDataList,
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
