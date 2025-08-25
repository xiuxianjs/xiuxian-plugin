import { __PATH } from './keys'
import type { AssociationData } from '@src/types'
import { keys } from './keys'
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl'

/**
 * 获取宗门数据
 * @param file_name  宗门名称
 * @deprecated 请使用 redis + keys
 */
async function getAssociation(
  file_name: string
): Promise<AssociationData | 'error'> {
  const ass = await getDataJSONParseByKey(keys.association(file_name))
  if (!ass) {
    return 'error'
  }
  return ass
}

/**
 * 写入宗门数据
 * @param file_name  宗门名称
 * @param data
 * @deprecated
 */
async function setAssociation(
  file_name: string,
  data: AssociationData
): Promise<void> {
  await setDataJSONStringifyByKey(keys.association(file_name), data)
}

export default {
  getAssociation,
  setAssociation
}
