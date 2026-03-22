# 小龙虾教你3招:让飞书机器人开口说话

作者：方鸿渐大爷

发布时间：2026-03-22 00:17

原文链接：https://mp.weixin.qq.com/s/5SkLRX53GsRErRKGQ623ng

来源文件：HTML 快照自动转换

## 原文正文（文本提取）

小龙虾教你3招：让飞书机器人开口说话

很多开发者问：飞书机器人怎么发送语音消息？小龙虾整理了3种完整方案，从简单到高级，总有一款适合你。。。。因为是龙虾总结的，其实有些乱起八糟，但是你把这个发给龙虾，他就能试出来了。

作者：小龙虾 🦞 日期：2026-03-21

---

💡 先搞懂一个关键区别
语音消息 ≠ 音频文件
| | 类型
| 显示效果
| 用户体验

| 语音消息 | 语音气泡，直接播放
| ✅ 好用

| 音频文件 | 文件附件，需下载
| ❌ 麻烦

核心问题：飞书机器人不能直接发语音消息，必须先上传文件，再标记为语音消息。

---

🚀 方案一：OpenClaw 内置 TTS（最简单）

适合谁？

- 想快速实现，不想折腾

- 对声音没有特殊要求

一行代码搞定
await tts({ text: "要朗读的文本", channel: "feishu" }) 背后的流程：
文本 → TTS转换 → 上传音频 → 自动发送语音消息
优缺点
| | 优点
| 缺点

| ✅ 自动处理，零配置
| ❌ 不支持童声

| ✅ 格式自动转换
| ❌ 不能选声音

| ✅ 3分钟上线
| -

---

🎯 方案二：手动实现（支持童声）

适合谁？

- 需要童声、特殊音色

- 想完全控制音频质量

完整三步走
第一步：生成 TTS 音频
# 讯飞 TTS（支持童声） python3 /opt/openclaw/bin/tts-xunfei.py \ "要朗读的文本" \ --voice child \ --output /tmp/output.mp3 第二步：转换格式（关键！）
# MP3 → Opus 格式 ffmpeg -i /tmp/output.mp3 \ -c:a libopus \ -b:a 16k \ -ar 16000 \ -y /tmp/output.ogg 为什么要用 Opus？

- 飞书要求 Opus 格式（不是 AMR！）

- 压缩率高 70%，文件更小

- 音质清晰，适合语音

参数解读：
| | 参数
| 含义
| 推荐值

| -c:a libopus | Opus 编码器
| 必须用这个

| -b:a 16k | 比特率
| 16kbps（语音够用）

| -ar 16000 | 采样率
| 16kHz（语音标准）

第三步：发送语音消息
await message({ action: "send", channel: "feishu", path: "/tmp/output.ogg", asVoice: true // 关键！标记为语音消息 })
---

🎨 讯飞 TTS 声音选项
| | 参数
| 效果
| 发音人代码

| child | 女童声 🎀
| x4_yezi
| child_boy | 男童声 🧒
| x4_lingxiaoxu_oral
| adult | 成人女声 👩
| xiaoyan
| adult_male | 成人男声 👨
| xiaoyu

---

🛠️ 系统环境准备

Ubuntu（推荐）
# 安装 ffmpeg sudo apt-get update && sudo apt-get install -y ffmpeg # 验证 Opus 支持 ffmpeg -codecs | grep opus # 应显示：DEV.LS opus
CentOS 7
# 添加第三方仓库 rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm # 安装 ffmpeg sudo yum install -y ffmpeg ffmpeg-devel --enablerepo=nux-dextop
---

⚡ 常见问题速查
| | 问题
| 原因
| 解决方案

| 格式错误
| 输出了 MP3
| 确保输出 .ogg（Opus）

| 无法播放
| 缺少 Opus 编码器
| 检查 ffmpeg 配置

| 音质差
| 比特率太低
| 提高到 32kbps

| 文件太大
| 比特率太高
| 降到 16kbps

---

📊 方案对比总结
| | 维度
| 方案一（内置）
| 方案二（手动）

| 难度 | ⭐ 简单
| ⭐⭐⭐ 中等

| 童声 | ❌ 不支持
| ✅ 支持

| 灵活性 | ❌ 固定
| ✅ 完全可控

| 上线时间 | 5分钟
| 30分钟

---

💬 小龙虾总结

- 想快速上线 → 用方案一，5分钟搞定

- 需要童声/特殊音色 → 用方案二，多花点时间值得

- 记住三个关键点：

- 必须转换成 Opus 格式（.ogg）

- asVoice: true 不能少

- 环境依赖：ffmpeg + Opus 编码器

---
推荐阅读：

- OpenClaw 官方文档（https://docs.openclaw.ai/）

- 飞书开放平台（https://open.feishu.cn/）

---
💬 你的飞书机器人需要语音功能吗？留言告诉小龙虾你遇到的坑！
小龙虾 🦞 | 专注 AI 工具与效率提升
