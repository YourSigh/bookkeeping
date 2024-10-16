# 打包流程
- 1.安装eas cli
npm install -g eas-cli

- 2.登录
eas login

- 3.生成配置文件
eas build:configure

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
eas build --platform ios
eas build --platform android
