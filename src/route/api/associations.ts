import { Context } from 'koa'
import { validateToken } from '@src/route/core/auth'
import { parseJsonBody } from '@src/route/core/bodyParser'
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from '@src/model/paths'

const redis = getIoRedis()

// 获取宗门列表（支持分页）
export const GET = async (ctx: Context) => {
  try {
    // 验证管理员权限
    const token = ctx.request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '需要登录',
        data: null
      }
      return
    }

    const user = await validateToken(token)
    if (!user || user.role !== 'admin') {
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '权限不足',
        data: null
      }
      return
    }

    // 获取分页参数
    const page = parseInt(ctx.request.query.page as string) || 1
    const pageSize = parseInt(ctx.request.query.pageSize as string) || 20
    const search = (ctx.request.query.search as string) || ''

    const associations = []
    let total = 0

    // 使用SCAN命令获取所有宗门keys
    const scanPattern = `${__PATH.association}:*`
    let cursor = 0
    const allKeys = []

    do {
      const result = await redis.scan(
        cursor,
        'MATCH',
        scanPattern,
        'COUNT',
        100
      )
      cursor = parseInt(result[0])
      allKeys.push(...result[1])
    } while (cursor !== 0)

    // 如果需要搜索，需要遍历所有数据
    if (search) {
      for (const key of allKeys) {
        const associationName = key.replace(`${__PATH.association}:`, '')
        const associationData = await redis.get(key)

        if (associationData) {
          try {
            const association = JSON.parse(associationData)
            const associationWithName = {
              name: associationName,
              ...association
            }

            // 应用搜索过滤
            const matchesSearch =
              !search ||
              associationWithName.宗门名称
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              associationName.toLowerCase().includes(search.toLowerCase())

            if (matchesSearch) {
              total++
              // 只添加当前页的数据
              const startIndex = (page - 1) * pageSize
              if (associations.length < pageSize && total > startIndex) {
                associations.push(associationWithName)
              }
            }
          } catch (error) {
            logger.error(`解析宗门数据失败 ${associationName}:`, error)
          }
        }
      }
    } else {
      // 无搜索，直接分页获取数据
      total = allKeys.length

      // 计算分页范围
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedKeys = allKeys.slice(startIndex, endIndex)

      // 只获取当前页的数据
      for (const key of paginatedKeys) {
        const associationName = key.replace(`${__PATH.association}:`, '')
        const associationData = await redis.get(key)

        if (associationData) {
          try {
            const association = JSON.parse(associationData)
            const associationWithName = {
              name: associationName,
              ...association
            }
            associations.push(associationWithName)
          } catch (error) {
            logger.error(`解析宗门数据失败 ${associationName}:`, error)
          }
        }
      }
    }

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '获取宗门列表成功',
      data: {
        list: associations,
        pagination: {
          current: page,
          pageSize: pageSize,
          total: total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    }
  } catch (error) {
    logger.error('获取宗门列表错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}

// 获取单个宗门详情
export const POST = async (ctx: Context) => {
  try {
    // 验证管理员权限
    const token = ctx.request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '需要登录',
        data: null
      }
      return
    }

    const user = await validateToken(token)
    if (!user || user.role !== 'admin') {
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '权限不足',
        data: null
      }
      return
    }

    const body = await parseJsonBody(ctx)
    const { associationName } = body as { associationName?: string }

    if (!associationName) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '宗门名称不能为空',
        data: null
      }
      return
    }

    const associationData = await redis.get(
      `${__PATH.association}:${associationName}`
    )

    if (!associationData) {
      ctx.status = 404
      ctx.body = {
        code: 404,
        message: '宗门不存在',
        data: null
      }
      return
    }

    const association = JSON.parse(associationData)

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '获取宗门详情成功',
      data: {
        name: associationName,
        ...association
      }
    }
  } catch (error) {
    logger.error('获取宗门详情错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}

// 获取宗门统计信息
export const PUT = async (ctx: Context) => {
  try {
    // 验证管理员权限
    const token = ctx.request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '需要登录',
        data: null
      }
      return
    }

    const user = await validateToken(token)
    if (!user || user.role !== 'admin') {
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '权限不足',
        data: null
      }
      return
    }

    // 获取统计参数
    const search = (ctx.request.query.search as string) || ''

    // 使用SCAN命令获取所有宗门keys
    const scanPattern = `${__PATH.association}:*`
    let cursor = 0
    const allKeys = []

    do {
      const result = await redis.scan(
        cursor,
        'MATCH',
        scanPattern,
        'COUNT',
        100
      )
      cursor = parseInt(result[0])
      allKeys.push(...result[1])
    } while (cursor !== 0)

    let total = 0
    let totalMembers = 0
    let totalPower = 0
    let totalLingshi = 0
    let xianjieCount = 0
    let fanjieCount = 0

    // 如果需要搜索，需要遍历所有数据
    if (search) {
      for (const key of allKeys) {
        const associationName = key.replace(`${__PATH.association}:`, '')
        const associationData = await redis.get(key)

        if (associationData) {
          try {
            const association = JSON.parse(associationData)
            const associationWithName = {
              name: associationName,
              ...association
            }

            // 应用搜索过滤
            const matchesSearch =
              !search ||
              associationWithName.宗门名称
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              associationName.toLowerCase().includes(search.toLowerCase())

            if (matchesSearch) {
              total++
              totalMembers += association.所有成员?.length || 0
              totalPower += association.power || 0
              totalLingshi += association.灵石池 || 0

              if (association.power > 0) {
                xianjieCount++
              } else {
                fanjieCount++
              }
            }
          } catch (error) {
            logger.error(`解析宗门数据失败 ${associationName}:`, error)
          }
        }
      }
    } else {
      // 无搜索，直接统计总数
      total = allKeys.length

      // 获取部分数据进行资源统计（避免性能问题）
      const sampleKeys = allKeys.slice(0, Math.min(50, allKeys.length))
      for (const key of sampleKeys) {
        const associationName = key.replace(`${__PATH.association}:`, '')
        const associationData = await redis.get(key)

        if (associationData) {
          try {
            const association = JSON.parse(associationData)
            totalMembers += association.所有成员?.length || 0
            totalPower += association.power || 0
            totalLingshi += association.灵石池 || 0
            if (association.power > 0) {
              xianjieCount++
            } else {
              fanjieCount++
            }
          } catch (error) {
            logger.error(`解析宗门数据失败 ${associationName}:`, error)
          }
        }
      }

      // 根据样本比例估算总数
      if (sampleKeys.length > 0) {
        const ratio = allKeys.length / sampleKeys.length
        totalMembers = Math.round(totalMembers * ratio)
        totalPower = Math.round(totalPower * ratio)
        totalLingshi = Math.round(totalLingshi * ratio)
        xianjieCount = Math.round(xianjieCount * ratio)
        fanjieCount = Math.round(fanjieCount * ratio)
      }
    }

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '获取统计信息成功',
      data: {
        total,
        totalMembers,
        totalPower,
        totalLingshi,
        xianjieCount,
        fanjieCount
      }
    }
  } catch (error) {
    logger.error('获取统计信息错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}
