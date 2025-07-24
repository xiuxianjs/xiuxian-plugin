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

```sh
git clone --depth=10  https://github.com/xiuxianjs/xiuxian-plugin.git
```

```sh
yarn install
```

```sh
yarn dev --login gui
```

> 可在vscode中安装alemonjs扩展以支持沙河环境登录

- 启动图片开发工具

> 请先触发图片对应指令，生产mock数据后进行

```sh
yarn view
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

## 修仙配置

如果自定义修仙配置 ？

请 [点击打开配置文件](./src/config/xiuxian.yaml) 了解配置

并在机器人目录下新建 `./config/alemonjs-xiuxian` 目录

该目录下新建与之对应的配置文件

即 `/config/alemonjs-xiuxian/xiuxian.yaml` 覆盖 `./src/config/xiuxian.yaml`

> 若使用alemongo，其内部bot在work/resources/bots 目录，可借助于vscode或vscode的ssh编辑进行

## 使用

> 唤醒 `/修仙帮助`

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
