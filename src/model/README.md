# 模块

所有标注废弃的方法解不可用。

## 行为

```ts
import { keysAction } from '.'
const redis = getIoRedis()
// 使用 keysAction 获取行为/ 相关 key
const data = await redis.get(keysAction.exchange('exchange'))
```

## 存档

```ts
import { keys } from '.'
const redis = getIoRedis()
// 获得存档
const data = await redis.get(keys.player(UserId))
```
