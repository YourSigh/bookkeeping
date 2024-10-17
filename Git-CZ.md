# 提交规范

 安装
```
npm install -g git-cz
```

 提交
```
git cz
```

## 安装cz

 安装
```
npm install -g commitizen
```

 安装cz-conventional-changelog
```
commitizen init cz-conventional-changelog --save --save-exact
```

 配置自定义路径
```
"config": {
    "commitizen": {
      "path": "./gitmessage.js"
    }
}
```

创建自定义配置文件
```
touch .cz-config.js
```
写入配置即可使用git cz
