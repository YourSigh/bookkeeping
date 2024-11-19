# 记账小助手
![Static Badge](https://img.shields.io/badge/node-%3E%3D18-green)
## 简介
这是一款基于 React Native 开发的记账小助手，支持 iOS 和 Android 平台。

在现代社会，消费方式的多样化和快节奏的生活使得个人理财变得尤为重要。许多人发现自己在日常开销中容易失去控制，导致月底常常入不敷出。因此，使用记账应用来跟踪和管理财务状况成为一种流行的选择。

本项目的组件大多由开发者自行编写，极少依赖第三方库，以确保应用的轻量化和定制化。
## 功能列表
| **功能** |                                    **描述**                                    |
|----------|:------------------------------------------------------------------------------|
|   日历   | 独立开发的日历组件，支持左右滑动丝滑切换月份，点击日期可以查看当日的消费记录。 |
|   扫雷   |                        扫雷小游戏，可以选择不同的难度。                        |
## 启动项目
- 1.安装依赖

  ```shell
  npm install
  ```
- 2.启动项目

  ```shell
  npm run start
  ```
## 打包流程
- 1.安装eas cli

  ```shell
  npm install -g eas-cli
  ```

- 2.登录

  ```shell
  eas login
  ```

- 3.生成配置文件

  ```shell
  eas build:configure
  ```

- 4.修改 eas.json
  ```javascript
  "production": {
    "android": {
      "buildType": "apk"
    },
    "ios": {
      "resourceClass": "m1-medium"
    }
  }
  ```

- 5.打包

  ```shell
  eas build --platform ios
  ```

  ```shell
  eas build --platform android
  ```
## 常见问题及解决方案
1. 添加作者好友QQ：```S6666LJ```(QID)
2. 提交一个issues：<https://github.com/YourSigh/bookeeping/issues>
