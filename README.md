# 修仙机器人

开发文档 https://lvyjs.dev/

开发文档 [https://alemonjs.com/](https://alemonjs.com/)

必要环境 `nodejs` 、`redis` 、`chrome`

该扩展推荐使用`@alemonjs/onebot`进行连接

该推荐推荐使用`alemongo`作为生产环境

https://github.com/lemonade-lab/alemongo

## 安装

- alemongo

地址

```sh
https://github.com/xiuxianjs/xiuxian-plugin.git
```

分支

```sh
release
```

- 本地模板

```sh
git clone --depth=1 -b release  https://github.com/xiuxianjs/xiuxian-plugin.git ./packages/xiuxian-plugin
```

## 开发

```sh
git clone --depth=1 -b alemonjs/1.3  https://github.com/xiuxianjs/xiuxian-plugin.git
```

```sh
yarn install
```

```sh
yarn dev --login gui
```

> 可在vscode中安装alemonjs扩展以支持沙河环境登录

## 配置

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

> 唤醒 `/帮助`

## 交流

QQ Group 806943302
