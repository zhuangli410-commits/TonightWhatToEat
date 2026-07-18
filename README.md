# 今晚吃什么 · AI 智能菜谱推荐 (Android版)

基于 React + Capacitor 构建的安卓应用，预留了国产主流大模型 API 接口。

## 功能特性

- **智能档案管理**：记录身高、体重、BMI、健康目标、基础病/禁忌、可用厨具
- **食材管理**：手动添加或拍照识别食材
- **AI 菜谱推荐**：基于个人档案和现有食材，智能推荐3道菜谱
- **多模型支持**：预留国产主流大模型 API 接口

## 支持的 AI 模型

| 模型 | 提供商 | 视觉识别 | 状态 |
|------|--------|----------|------|
| DeepSeek | 深度求索 | ❌ | 已预留 |
| 文心一言 | 百度 | ✅ | 已预留 |
| 通义千问 | 阿里云 | ✅ | 已预留 |
| ChatGLM | 智谱AI | ✅ | 已预留 |
| 豆包 | 字节跳动 | ✅ | 已预留 |
| 星火 | 科大讯飞 | ✅ | 已预留 |
| GPT-4o | OpenAI | ✅ | 已预留 |

## 构建 APK (三种方式)

### 方式一：GitHub Actions 自动构建 (推荐)

1. 将代码推送到 GitHub 仓库
2. GitHub Actions 会自动构建 APK
3. 在 Actions 页面下载 `app-debug.apk`

### 方式二：本地构建

**环境要求：**
- Node.js 18+
- Java 17
- Android SDK
- Gradle

**步骤：**

```bash
# 1. 安装依赖
npm install

# 2. 构建 Web 资源
npm run build

# 3. 同步 Capacitor
npx cap sync

# 4. 构建 APK
cd android
./gradlew assembleDebug

# APK 输出路径：android/app/build/outputs/apk/debug/app-debug.apk
```

### 方式三：Android Studio 构建

1. 完成上述步骤 1-3
2. 在 Android Studio 中打开 `android` 文件夹
3. 点击 Build → Build Bundle(s) / APK(s) → Build APK(s)

## 项目结构

```
TonightWhatToEat/
├── src/
│   ├── main.tsx              # 应用入口
│   ├── App.tsx               # 主应用组件
│   ├── data/
│   │   ├── recipes.ts        # 本地菜谱数据库
│   │   └── aiModels.ts       # AI 模型配置
│   ├── pages/
│   │   ├── ProfilePage.tsx   # 档案页面
│   │   ├── FoodPage.tsx      # 食材页面
│   │   ├── ResultPage.tsx    # 推荐结果页面
│   │   └── SettingsPage.tsx  # 设置页面
│   └── utils/
│       ├── storage.ts        # 本地存储工具
│       └── aiApi.ts          # AI API 调用
├── android/                   # Android 原生项目
├── capacitor.config.ts        # Capacitor 配置
└── package.json
```

## AI API 配置说明

在应用的**设置**页面中：

1. 选择你要使用的 AI 提供商
2. 填写对应的 API Key
3. 点击保存

**各平台 API Key 获取方式：**

- **DeepSeek**: [platform.deepseek.com](https://platform.deepseek.com)
- **百度文心一言**: [ai.baidu.com](https://ai.baidu.com)
- **阿里通义千问**: [bailian.aliyun.com](https://bailian.aliyun.com)
- **智谱AI**: [open.bigmodel.cn](https://open.bigmodel.cn)
- **字节豆包**: [console.volcengine.com/ark](https://console.volcengine.com/ark)
- **讯飞星火**: [xinghuo.xfyun.cn](https://xinghuo.xfyun.cn)

## 技术栈

- React 18 + TypeScript
- Capacitor 6 (原生桥接)
- Vite (构建工具)
- Lucide React (图标)

## 注意事项

1. 首次使用需要配置 AI API Key 才能启用拍照识别功能
2. 不配置 API Key 时，应用使用本地算法进行菜谱推荐
3. 所有数据存储在本地，保护隐私
