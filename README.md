# 学习笔记

这是一个长期积累型笔记仓库，按“先记录，再整理，再复盘”的节奏维护。

## 首页导航

### 快速开始

- [00-索引.md](./00-索引.md)：按主题查找已有笔记
- [notes/00-Inbox/README.md](./notes/00-Inbox/README.md)：先记下来，后面再整理
- [templates/note-template.md](./templates/note-template.md)：新建笔记模板
- [reviews/README.md](./reviews/README.md)：周复盘和月复盘入口

### 主题入口

- [编程笔记](./notes/01-编程)
- [工具笔记](./notes/02-工具)
- [语言笔记](./notes/03-语言)

### 当前内容

- [Git 基础操作清单](./notes/01-编程/Git-基础操作清单.md)
- [终端常用命令整理](./notes/02-工具/终端常用命令整理.md)
- [Aliyun-Bridge 实践复盘](./notes/02-工具/Aliyun-Bridge-实践复盘.md)
- [英语学习记录](./notes/03-语言/英语学习记录.md)

## 推荐工作流

1. 临时想法先写到 [notes/00-Inbox/README.md](./notes/00-Inbox/README.md)。
2. 值得保留的内容，用 [templates/note-template.md](./templates/note-template.md) 整理成正式笔记。
3. 正式笔记放到对应主题目录，并在 [00-索引.md](./00-索引.md) 补链接。
4. 每周或每月到 [reviews/README.md](./reviews/README.md) 做回顾，把零散笔记抽成长期有效的结论。

## 目录结构

```text
.
├── 00-索引.md
├── README.md
├── assets/
├── notes/
│   ├── 00-Inbox/
│   ├── 01-编程/
│   ├── 02-工具/
│   └── 03-语言/
├── reviews/
│   ├── 月复盘/
│   └── 周复盘/
└── templates/
    └── note-template.md
```

## 命名建议

- 临时笔记：`YYYY-MM-DD-一句话主题.md`
- 正式笔记：`主题.md` 或 `YYYY-MM-DD-主题.md`
- 复盘文件：`YYYY-第NN周.md`、`YYYY-MM.md`
- 一篇笔记只解决一个具体问题，跨主题内容靠链接关联
