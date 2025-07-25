import { __PATH } from './paths'
import Association from './Association.js'
import DataControl from './DataControl.js'
import { DataList } from './DataList.js'

/**
 * 废弃
 * @deprecated Use `new DataList()` instead
 */
class XiuxianData extends DataList {
  constructor() {
    super()
  }
  /**
   * 废弃
   * @deprecated Use DataControl.existData instead
   */
  existData = DataControl.existData
  /**
   * 废弃
   * @deprecated Use DataControl.getData instead
   */
  getData = DataControl.getData
  /**
   * 废弃
   * @deprecated Use DataControl.setData instead
   */
  setData = DataControl.setData
  /**
   * 废弃
   * @deprecated Use Association.getAssociation instead
   */
  getAssociation = Association.getAssociation
  /**
   * 废弃
   * @deprecated Use Association.setAssociation instead
   */
  setAssociation = Association.setAssociation
}
/**
 * 废弃
 * @deprecated Use `new DataList()` instead
 */
export default new XiuxianData()
