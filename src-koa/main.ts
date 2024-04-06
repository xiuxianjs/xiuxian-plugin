import './utils/env.js'
import Koa from 'koa'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import router from './router'
import { authMiddleware } from './utils/jwt.js'

// new
const app = new Koa()
const PORT = Number(process.env?.APP_SERVER_PORT ?? 9090)

// static
app.use(KoaStatic('resources'))
// 允许跨域
app.use(cors())
// 使用 koa-bodyparser 中间件
app.use(bodyParser())

// 此后的api受到jwt保护
app.use(authMiddleware)

// 允许跨域
app.use(cors())
// 使用 koa-bodyparser 中间件
app.use(bodyParser())

// routes
app.use(router.routes())
// listen
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
  console.log('http://localhost:' + PORT)
})
