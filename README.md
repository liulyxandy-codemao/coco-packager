# coco-packager

一个用于将 [CoCo编辑器](https://coco.codemao.cn/editor) 作品手动打包成Android APK应用的自动化工具。

## 📖 项目简介

coco-packager 是一个Node.js工具，可以帮助你将CoCo作品自动打包成独立的Android应用程序。该工具会自动获取作品数据，替换应用图标和启动画面，并生成签名后的APK文件。

## 🛠️ 系统要求

- Node.js 16+ (支持ES Modules)
- Java 8+ (用于运行apktool和apksigner)
- pnpm (包管理器)

## 📦 安装

1. 克隆项目到本地：
```bash
git clone https://github.com/liulyxandy-codemao/coco-packager.git
cd coco-packager
```

2. 安装依赖：
```bash
pnpm install
```

3. 准备必要文件：
   - 准备应用图标文件 `icon.png`
   - 准备启动画面文件 `splash.png`

## 🚀 使用方法

运行打包工具：
```bash
pnpm start
```

或者：
```bash
node scripts/main.js
```

运行后按照提示操作：

1. **输入作品ID**：输入你要打包的编程猫作品的ID
2. **输入应用名称**：设置生成的Android应用的名称
3. **密钥设置**（首次运行）：如果没有密钥文件，工具会自动生成并要求你设置密码
4. **输入密钥密码**：输入之前设置的密钥密码

## 📁 项目结构

```
coco-packager/
├── scripts/
│   └── main.js          # 主要的打包脚本
├── apktool.jar          # APK反编译工具
├── apktool.bat          # APK工具批处理文件
├── apksigner.jar        # APK签名工具
├── demo.apk             # 基础APK模板
├── icon.png             # 应用图标文件
├── splash.png           # 启动画面文件
├── package.json         # 项目配置文件
└── README.md            # 项目说明文档
```

## 📤 输出文件

运行完成后，会在项目根目录生成：

- `release.apk` - 未签名的APK文件
- `release_signed.apk` - 已签名的APK文件（可安装）
- `key.jks` - 生成的密钥文件

与其他临时文件。

## ⚠️ 注意事项

**仅支持打包经过H5发布后的CoCo作品。**

## 📄 许可证

本项目使用 GNU Affero General Public License v3.0 许可证。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。