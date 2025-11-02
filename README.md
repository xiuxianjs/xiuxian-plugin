# 修仙机器人

必要环境 `nodejs` 、`redis` 、`chrome`

该扩展推荐使用 `@alemonjs/onebot` 进行连接，其他平台不保证稳定性。

该扩展推荐使用 [`alemongo`](https://github.com/lemonade-lab/alemongo) 作为生产环境。

如果你是一名非技术人员，可使用 [`alemondesk`](https://github.com/lemonade-lab/alemondesk) 桌面版。

https://github.com/lemonade-lab/alemongo

https://github.com/lemonade-lab/alemondesk

## 安装

地址

```sh
https://github.com/xiuxianjs/xiuxian-plugin.git
```

> 若访问受限，可使用如下加速地址

```sh
https://ghfast.top/https://github.com/xiuxianjs/xiuxian-plugin.git
```

分支

```sh
release
```

### Redis

将以默认配置连接本地redis,

如需调整，请阅读@alemonjs/db配置连接,

如需使用docker请参考[docker-compose.yml](./docker-compose.yml)

https://www.npmjs.com/package/@alemonjs/db

> 机器人全部使用redis存储，请务必启动redis持久化存储


## 使用

> 安装后使用 `/修仙帮助` 唤醒

主人专用指令 `/修仙扩展`


### 修仙管理

http://127.0.0.1:17117/apps/alemonjs-xiuxian/

默认账号密码 lemonade、123456

### 核心配置

```yaml
alemonjs-xiuxian:
  # 关闭验证码
  close_captcha: true
  # 关闭task
  task: false
  # 如果同时启动多个机器人，
  # 请务必填写机器人账号 !!!
  botId: ''
  # 关闭主动消息（用于主动消息被限制的平台）
  close_proactive_message: true
  # 当配置关闭时。推送的消息。
  # 玩家都可以使用 #我的消息 查看
  # 玩家可发送 #清理消息 来减少消息记录
  # 开启赠送功能（包括普通赠送和一键赠送）
  open_give: false
```

### 埋点

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

## 其他版本

| Project         | Status | Description            |
| --------------- | ------ | ---------------------- |
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
