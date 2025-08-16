# 修仙机器人

必要环境 `nodejs` 、`redis` 、`chrome`

该扩展推荐使用`@alemonjs/onebot`进行连接

该扩展推荐使用`alemongo`作为生产环境

https://github.com/lemonade-lab/alemongo

## 安装

### alemongo

地址

```sh
https://github.com/xiuxianjs/xiuxian-plugin.git
```

分支

```sh
release
```

### 本地模板

```sh
git clone --depth=1 -b release  https://github.com/xiuxianjs/xiuxian-plugin.git ./packages/xiuxian-plugin
```

### 开发

开发环境 https://lvyjs.dev/

开发文档 https://alemonjs.com/

```
xiuxian-plugin/
├── frontend/          # 前端React应用
│   ├── src/
│   │   ├── api/       # API接口
│   │   ├── components/ # 通用组件
│   │   ├── contexts/   # React Context
│   │   ├── pages/      # 页面组件
│   │   └── ...
│   └── ...
├── src/               # 后端源码
│   ├── model/         # 数据模型
│   ├── route/         # API路由
│   └── ...
└── ...
```

```sh
git clone --depth=10  https://github.com/xiuxianjs/xiuxian-plugin.git
```

```sh
yarn install
```

```sh
yarn dev
```

> 可在vscode中安装alemonjs扩展以支持沙河环境登录

> [ALemonTestOne](https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone)

- 启动图片开发工具

> 请先触发图片对应指令，生产mock数据后进行

```sh
yarn view
```

- 启动管理端

```sh
yarn bundle-dev
```

## 运行配置

> alemon.config.yaml

```yaml
login: 'onebot'
redis:
  host: 'localhost'
  port: '6379'
  password: ''
  db: '1'
```

## 使用

> 唤醒 `/修仙帮助`

> 机器人全部使用redis存储，请务必启动redis持久化存储

## 埋点

我们将使用 postlog 记录用户的行为，

若有需要，可进行配置后重启机器人，即可推送行为数据

```yaml
alemonjs-xiuxian:
  postlog:
    api_key: ''
    options:
      host: 'https://us.i.posthog.com'
```

> 注意：开发模式下并不会发送数据

## 修仙管理

http://127.0.0.1:17117/apps/alemonjs-xiuxian/

> 请注意端口，如果是本地开发模式，可直接访问 http://127.0.0.1:17117/app/

默认账号密码 lemonade、123456

## 其他版本

| Project          | Status | Description            |
| ---------------- | ------ | ---------------------- |
| 👉[yunzaijs/1.2] |        | yunzaijs 版 修仙v1.2   |
| 👉[version/1.2]  |        | yunzai-bot 版 修仙v1.2 |
| 👉[version/1.3]  |        | yunzai-bot 版 修仙v1.3 |

[yunzaijs/1.2]: https://github.com/xiuxianjs/xiuxian-plugin/tree/yunzaijs/1.2
[version/1.2]: https://github.com/xiuxianjs/xiuxian-plugin/tree/version/1.2
[version/1.3]: https://github.com/xiuxianjs/xiuxian-plugin/tree/version/1.3

## 贡献

<a href="https://github.com/xiuxianjs/xiuxian-plugin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xiuxianjs/xiuxian-plugin" />
</a>
