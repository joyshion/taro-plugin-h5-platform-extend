# @joyshion/taro-plugin-h5-platform-extend
## Taro3 H5平台扩展编译插件
由于Taro框架的H5编译无法扩展，目前该插件采用入侵修改Taro源码来实现基于H5的平台扩展编译。

### 安装
```bash
yarn add @joyshion/taro-plugin-h5-platform-extend --dev
```

### 配置
 修改项目目录下的package.json文件
- 增加`h5Extend`配置，根据要扩展H5平台的名称来配置，平台名称需唯一（包括Taro已支持的平台），扩展平台的编译参数需为已配置的平台名称
    ```bash
    "h5Extend": [
        "yunshanfu",
        "yizhifu",
    ],
    ```
- `scripts`增加h5扩展平台编译及参数
    ```bash
    "scripts": {
        "build:yunshanfu": "taro build --type yunshanfu",
        "dev:yunshanfu": "npm run build:yunshanfu -- --watch",
        "build:yizhifu": "taro build --type yizhifu",
        "dev:yizhifu": "npm run build:yizhifu -- --watch",
        ...
    }
    ```
- `scripts`增加`h5extend`方法
    ```bash
    "scripts": {
        "h5extend:enabled": "node ./node_modules/@joyshion/taro-plugin-h5-platform-extend/dist/expand.js --type enabled",
        "h5extend:disabled": "node ./node_modules/@joyshion/taro-plugin-h5-platform-extend/dist/expand.js --type disabled",
        ...
    }
    ```
### 开启&关闭H5扩展平台
每次修改`h5Extend`参数，都需要关闭扩展平台功能，修改后再开启
- 开启H5扩展平台编译
    ```bash
    yarn h5extend:enabled
    ```
- 关闭h5扩展平台编译
    ```bash
    yarn h5extend:disabled
    ```

### 开发&打包
根据已配置的平台编译参数进行开发及打包
```bash
// 开发
yarn dev:yunshanfu
// 打包
yarn build:yunshanfu
```

### 使用
基于该插件实现的扩展平台，使用同官方跨平台开发一致。
- 支持内置环境变量，通过`process.env.TARO_ENV`判断编译平台类型
- 支持多端组件
- 支持多端脚本逻辑
- 支持多端页面路由
