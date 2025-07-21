# 修仙机器人

开发文档 https://lvyjs.dev/

开发文档 [https://alemonjs.com/](https://alemonjs.com/)

## 使用指南

### 配置

> alemon.config.yaml

```yaml
apps:
  - 'alemonjs-xiuxian'

gui:
  port: 9602

pm2:
  name: 'gui'
  script: 'node index.js --login gui'

# 新增redis配置
redis:
  host: 'localhost'
  port: '6379'
  password: ''
  db: '1'
# 新增db配置
db:
  host: 'localhost'
  port: '3306'
  user: 'root'
  password: 'Mm002580!'
  database: 'xiuxian_test'
```

> 唤醒 `/帮助`

#### 本地模块

```sh
# clone
git clone --depth=1  git@github.com:lemonadejs/xiuxian-bot.git
cd xiuxian-bot
# build
npm install
npm run build
# link
npm link
```

> 在想要载入的机器人目录进行

```sh
npm link alemonjs-kuromc
```

> 如果你要本地立即开启

```sh
node index.js --login gui
```

## MySQL&Redis

> 必须安装mysql8才能运行

以下是docker如何立即数据库的指令

```sh
docker-compose up -d # 开启
docker-compose restart -d # 重启
docker-compose pause -d # 暂停
```

## Github自动化部署

[README_ACITON](./README_ACITON.md)

## 交流

QQ Group 806943302
