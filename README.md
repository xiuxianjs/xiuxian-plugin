# 修仙机器人

开发文档 https://lvyjs.dev/

开发文档 [https://alemonjs.com/](https://alemonjs.com/)

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

> mock数据来源于开发时触发的指令，请先出发图片对应指令，生产mock数据后进行

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

## 使用

> 唤醒 `/帮助`

## 交流

QQ Group 806943302
