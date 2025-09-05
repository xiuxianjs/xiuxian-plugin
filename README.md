# 修仙机器人

必要环境 `nodejs` 、`redis` 、`chrome`

该扩展推荐使用`@alemonjs/onebot`进行连接

该扩展推荐使用`alemongo`作为生产环境

https://github.com/lemonade-lab/alemongo

## 安装

> 安装后使用 `/修仙帮助` 唤醒

主人专用指令 `/修仙扩展`

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

### Redis

将以默认配置连接本地redis，如需调整，

请阅读@alemonjs/db配置连接,

https://www.npmjs.com/package/@alemonjs/db

> 机器人全部使用redis存储，请务必启动redis持久化存储

## 修仙管理

http://127.0.0.1:17117/apps/alemonjs-xiuxian/

默认账号密码 lemonade、123456

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

## 核心配置

```yaml
alemonjs-xiuxian:
  # 关闭验证码
  close_captcha: true
  # 关闭task
  task: false
  # 如果同时启动多个机器人，
  # 请务必填写机器人账号 !!!
  botId: ''
  # 关闭主动消息（用于主动被限制的平台）
  close_proactive_message: true
```

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
