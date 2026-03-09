# Git 基础操作清单

## 核心结论

- 先看状态，再操作。
- 提交前先确认变更范围。
- 拉取和推送前确认当前分支。

## 常用命令

```bash
git status
git add <file>
git commit -m "feat: ..."
git pull --ff-only
git push
```

## 易错点

- 没看 `git status` 就直接提交。
- 在错误分支上提交代码。
- 用过于模糊的提交信息。
