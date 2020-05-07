##  Kiple Portal

### 目录结构
```
├── scripts                  # webpack配置目录 & 运行脚本
├── public                   # 不参与编译的资源文件
├── mock                     # mock接口目录
├── src                      # 项目目录
│   ├── assets               # 静态资源文件目录
│   │   ├── styles           # 全局样式
│   │   └── images           # 图片资源目录
│   ├── index.tsx            # 项目入口文件
│   ├── services             # 接口目录
│   ├── components           # 全局公共组件
│   ├── config               # 项目配置目录&多语言配置
│   ├── modles               # Model目录
│   ├── pages                # 各页面目录
│   │   ├── Admin            # Admin
│   │   ├── SMS              # SMS
│   │   ···
│   ├── routes               # 动态路由目录
│   │   └── index.tsx        # 路由配置文件
│   ├── services             # 存放异步请求文件
│   └── utils                # 项目帮助函数目录
├── .babelrc                 # babel配置文件
├── .eslintrc.js             # Eslint规则配置文件
├── package.json             # 包文件
├── yarn.lock                # 包版本锁定
└── README.md                # README文件
```

### 使用说明
```bash
# 安装依赖
$ yarn
# 开发环境启动 开环环境的登录注册使用了mock的登录接口，请先运行 yarn mock
$ yarn start
# 检测代码是否符合eslint规则
$ yarn lint
# 自动进行eslint修复
$ yarn fix
# 项目打包
$ yarn build
# 本地预览打包后项目
$ yarn start:prod
# 自定义mock接口数据返回
$ yarn mock
```
