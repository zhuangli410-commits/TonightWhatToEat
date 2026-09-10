# 今晚吃什么 · AI 智能菜谱推荐 (Android)

[English](#english) | [中文](#中文)

<a id="中文"></a>

基于 React + TypeScript + Capacitor 构建的安卓应用：告诉它你有什么食材、身体状况和厨具，AI 帮你决定今晚吃什么。

## 功能特性

- **智能档案管理**：记录身高、体重、BMI、健康目标、基础病/禁忌、可用厨具
- **食材管理**：手动添加或拍照识别食材
- **AI 菜谱推荐**：基于个人档案和现有食材，智能推荐 3 道菜谱
- **多模型支持**：内置国产主流大模型与 GPT-4o 的请求格式适配，用户自带 API Key

## 支持的 AI 模型

| 模型 | 提供商 | 视觉识别 | 状态 |
|------|--------|----------|------|
| DeepSeek | 深度求索 | ❌ | ✅ 适配 |
| 文心一言 | 百度 | ✅ | ✅ 适配 |
| 通义千问 | 阿里云 | ✅ | ✅ 适配 |
| ChatGLM | 智谱AI | ✅ | ✅ 适配 |
| 豆包 | 字节跳动 | ✅ | ✅ 适配 |
| 星火 | 科大讯飞 | ✅ | ✅ 适配 |
| GPT-4o | OpenAI | ✅ | ✅ 适配 |

所有 API Key 仅存储在本机，请求直连各模型官方端点，无任何中间服务器。

## 构建 APK

**环境要求**：Node.js 18+、Java 17、Android SDK

```bash
npm install
npm run build
npx cap add android   # 首次
npx cap sync android
cd android && ./gradlew assembleDebug
```

APK 输出：`android/app/build/outputs/apk/debug/app-debug.apk`

## 技术栈

React 18 · TypeScript · Vite · Capacitor 6

## License

MIT

---

<a id="english"></a>

# WhatToEatTonight · AI Recipe Recommender (Android)

An Android app built with React + TypeScript + Capacitor: tell it what ingredients you have, your health profile and kitchen tools, and AI decides what you should eat tonight.

## Features

- **Smart profile**: height, weight, BMI, health goals, dietary restrictions, available cookware
- **Ingredient management**: manual input or photo recognition
- **AI recipe recommendation**: 3 personalized recipes based on your profile and available ingredients
- **Multi-model support**: request adapters for mainstream Chinese LLMs and GPT-4o, bring-your-own API key

## Supported Models

| Model | Provider | Vision | Status |
|-------|----------|--------|--------|
| DeepSeek | DeepSeek | ❌ | ✅ Ready |
| ERNIE Bot | Baidu | ✅ | ✅ Ready |
| Qwen | Alibaba | ✅ | ✅ Ready |
| ChatGLM | Zhipu AI | ✅ | ✅ Ready |
| Doubao | ByteDance | ✅ | ✅ Ready |
| Spark | iFlytek | ✅ | ✅ Ready |
| GPT-4o | OpenAI | ✅ | ✅ Ready |

All API keys are stored locally on your device. Requests go directly to each provider's official endpoint — no intermediate servers.

## Build

**Requirements**: Node.js 18+, Java 17, Android SDK

```bash
npm install
npm run build
npx cap add android   # first time
npx cap sync android
cd android && ./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

## License

MIT
