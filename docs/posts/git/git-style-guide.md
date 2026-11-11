---
title: Git 风格指南
date: 2025-10-01
categories: [Git]
tags: [Git, 代码规范, 工作流]
---

# Git 风格指南

## 目录

- [1. 前言](#_1-前言)
- [2. 基本规范](#_2-基本规范)
- [3. 分支管理规范](#_3-分支管理规范)
- [4. 提交规范](#_4-提交规范)
- [5. 代码审查规范](#_5-代码审查规范)
- [6. 版本管理规范](#_6-版本管理规范)
- [7. 高级工作流规范](#_7-高级工作流规范)
- [8. 安全与权限规范](#_8-安全与权限规范)
- [9. 工具与自动化](#_9-工具与自动化)
- [10. 异常处理规范](#_10-异常处理规范)

## 1. 前言

### 1.1 文档目的

本规范基于业界最佳实践（GitHub Flow、Conventional Commits、Trunk-Based Development等）和现代Git技术趋势制定，旨在提高代码管理质量，为大型企业级项目提供统一的Git操作标准。确保团队协作高效、代码历史清晰可追溯、发布流程标准化。

### 1.2 适用范围

适用于所有新开发的软件项目及现有项目的代码管理。所有开发人员必须遵守本规范。

### 1.3 原则说明

- **清晰性**：提交信息清晰表达变更意图
- **可追溯性**：每个变更都可追溯到具体任务或问题
- **协作效率**：分支策略和工作流优化团队协作
- **质量保障**：通过代码审查和自动化工具保障代码质量
- **现代化**：合理使用现代Git特性和工具链

## 2. 基本规范

### 2.1 仓库初始化

**规则：** 新项目必须使用 `README.md`、`.gitignore` 和 `LICENSE` 文件初始化仓库。

**示例：**

```bash
echo "# Project Name" >> README.md
curl https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore > .gitignore
git add README.md .gitignore
git commit -m "chore: initial project setup"
git push -u origin master
```

### 2.2 全局配置

**规则：** 所有开发人员必须正确配置全局用户信息。

**示例：**

```bash
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"
git config --global core.ignorecase false
git config --global pull.rebase true
```

## 3. 分支管理规范

### 3.1 分支命名约定

**规则：** 使用统一的命名前缀和短横线命名法(kebab-case)。

**示例：**

```bash
# 正确示例 ✅
git branch feature/user-authentication
git branch fix/login-validation-issue
git branch release/v2.3.0
git branch hotfix/critical-security-patch
git branch bugfix/issue-123

# 错误示例 ❌
git branch UserAuthentication
git branch fix_login_validation_issue
git branch release230
```

### 3.2 分支类型与用途

**规则：** 按功能划分明确的分支类型：

| 分支类型    | 前缀        | 用途说明           | 生命周期 |
| ----------- | ----------- | ------------------ | -------- |
| 主分支      | master/     | 记录上线版本的迭代 | 长期     |
| 开发分支    | develop/    | 记录相对稳定的版本 | 长期     |
| 功能分支    | feature/    | 新功能开发         | 短期     |
| 修复分支    | fix/        | 问题修复           | 短期     |
| 发布分支    | release/    | 版本发布准备       | 中期     |
| 热修复分支  | hotfix/     | 生产环境紧急修复   | 短期     |
| Bug修复分支 | bugfix/     | 测试环境问题修复   | 短期     |
| 实验分支    | experiment/ | 技术实验和探索     | 可变     |

### 3.3 分支策略选择

**规则：** 根据项目规模和团队结构选择合适的协作模型。

**示例：**

```bash
# 小型项目 - GitHub Flow
master（保护分支）
  ↳ feature/xxx（开发分支）
  ↳ fix/xxx（修复分支）

# 中型项目 - Git Flow
master（保护分支，生产版本）
develop（保护分支，集成分支）
  ↳ feature/xxx（功能开发）
  ↳ release/vx.x.x（发布准备）
  ↳ hotfix/xxx（紧急修复）
  ↳ bugfix/xxx（Bug修复）

# 大型项目 - Trunk-Based Development
master（保护分支，强制CI/CD）
  ↳ short-lived feature/xxx（短期特性分支）
```

## 4. 提交规范

### 4.1 提交消息格式

**规则：** 遵循Conventional Commits规范，结构清晰。

**示例：**

```bash
# 正确示例 ✅
<type>(<scope>): <subject>

<body>

<footer>

# 实际提交示例
git commit -m "feat(auth): add OAuth2 integration

- implement Google OAuth2 provider
- add token refresh mechanism
- update authentication middleware

Closes #123
BREAKING CHANGE: authentication API endpoints changed"
```

### 4.2 提交类型规范

**规则：** 使用标准化的提交类型。

**示例：**

```bash
# 主要类型
feat:     新增功能（对应MINOR版本）
fix:      修复bug（对应PATCH版本）
perf:     性能优化（对应PATCH版本）
docs:     文档更新
style:    代码格式调整（不影响功能）
refactor: 代码重构（对应PATCH版本）
test:     测试相关
chore:    构建过程或辅助工具变动

# 扩展类型
ci:       持续集成配置
build:    构建系统或外部依赖调整
revert:   回滚提交
```

### 4.3 破坏性变更标记

**规则：** 如果提交包含不向后兼容的变更，必须明确标记。

**示例：**

```bash
# 方式一：在类型/范围后追加!
git commit -m "feat(api)!: remove deprecated endpoint"

# 方式二：在脚注中写明BREAKING CHANGE
git commit -m "feat: update configuration format

BREAKING CHANGE: configuration file format has changed from XML to YAML"
```

### 4.4 提交内容规范

**规则：** 保持提交的原子性和一致性。

**示例：**

```bash
# 正确示例 ✅ - 原子性提交
git commit -m "feat(api): add user search endpoint"          # 添加新端点
git commit -m "test(api): add user search tests"             # 添加对应测试
git commit -m "docs(api): update user search documentation"  # 更新文档

# 错误示例 ❌ - 混合多个不相关变更
git commit -m "fix: various things"  # 包含多个不相关的修复
```

## 5. 代码审查规范

### 5.1 Pull Request规范

**规则：** PR描述应包含必要的信息和上下文。

**示例：**

```markdown
## 变更描述

添加用户个人资料编辑功能，包括：

- 基本信息编辑表单
- 头像上传功能
- 密码修改界面

## 相关Issue

Closes #456, #789

## 测试说明

- [ ] 单元测试已添加
- [ ] 集成测试通过
- [ ] UI测试已更新
- [ ] 文档已更新

## 截图/屏幕录制

## 备注

包含破坏性变更：用户API响应结构变化
```

### 5.2 审查流程规范

**规则：** 建立标准化的代码审查流程。

**示例：**

```bash
# 1. 创建功能分支
git checkout -b feature/user-profile-editing

# 2. 开发并提交更改
git add .
git commit -m "feat(profile): add basic edit form"
git commit -m "feat(profile): implement avatar upload"

# 3. 推送到远程
git push origin feature/user-profile-editing

# 4. 创建Pull Request
# - 目标分支：develop
# - 至少需要2个审核员批准
# - 所有CI检查必须通过

# 5. 根据反馈迭代
git commit -m "fix(profile): address review comments"
git push origin feature/user-profile-editing
```

## 6. 版本管理规范

### 6.1 标签管理

**规则：** 使用语义化版本标签。

**示例：**

```bash
# 创建带注释的标签
git tag -a v1.2.3 -m "Release version 1.2.3

- Feature: User profile editing
- Fix: Login validation issue
- Security: Update dependencies"

# 推送标签到远程
git push origin --tags

# 轻量标签（仅用于内部版本）
git tag build-1024
```

### 6.2 发布流程

**规则：** 标准化的发布流程。

**示例：**

```bash
# 1. 从develop创建release分支
git checkout -b release/v1.3.0 develop

# 2. 更新版本信息和变更日志
git commit -m "chore(release): update to version 1.3.0"

# 3. 合并到master和develop
git checkout master
git merge --no-ff release/v1.3.0
git tag -a v1.3.0

git checkout develop
git merge --no-ff release/v1.3.0

# 4. 删除release分支
git branch -d release/v1.3.0
```

## 7. 高级工作流规范

### 7.1 交互式变基

**规则：** 在推送前整理提交历史。

**示例：**

```bash
# 整理最近5个提交
git rebase -i HEAD~5

# 常用操作：
# pick - 使用提交
# reword - 使用提交但修改消息
# edit - 使用提交但暂停修改
# squash - 将提交合并到前一个提交
# fixup - 类似squash但丢弃提交消息
```

### 7.2 子模块管理

**规则：** 规范使用Git子模块。

**示例：**

```bash
# 添加子模块
git submodule add https://github.com/example/lib.git libs/external

# 初始化和更新子模块
git submodule init
git submodule update

# 更新子模块到最新提交
git submodule update --remote
```

## 8. 安全与权限规范

### 8.1 分支保护规则

**规则：** 实施适当的分支保护策略。

**示例：**

```yaml
# 分支保护配置示意（实际在仓库设置或 Rulesets 中配置）
master:
  required_status_checks:
    strict: true
    contexts:
      - ci/build
      - ci/test
      - security/scan
  required_pull_request_reviews:
    required_approving_review_count: 2
    dismiss_stale_reviews: true
  enforce_admins: false
  restrictions: null

develop:
  required_status_checks:
    strict: false
    contexts:
      - ci/test
  required_pull_request_reviews:
    required_approving_review_count: 1
```

### 8.2 提交签名验证

**规则：** 重要提交应使用GPG签名。

**示例：**

```bash
# 配置GPG签名
git config commit.gpgsign true
git config user.signingkey KEY_ID

# 创建签名提交
git commit -S -m "feat: important security feature"

# 验证提交签名
git log --show-signature -1
```

## 9. 工具与自动化

### 9.1 Git钩子配置

**规则：** 使用Git钩子自动化代码质量检查。

**示例：**

```bash
#!/bin/sh
# .git/hooks/pre-commit

# 运行代码检查
npm run lint
if [ $? -ne 0 ]; then
  echo "Lint failed, please fix errors before committing"
  exit 1
fi

# 运行测试
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed, please fix before committing"
  exit 1
fi
```

### 9.2 CI/CD集成

**规则：** Git操作与CI/CD流水线紧密集成。

**示例：**

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

code-quality:
  stage: test
  only:
    - merge_requests
  script:
    - npm run lint
    - npm test

build:
  stage: build
  only:
    - tags
  script:
    - npm run build
    - npm run package

deploy-prod:
  stage: deploy
  only:
    - master
  script:
    - npm run deploy:prod
```

### 9.3 提交信息校验

**规则：** 使用工具自动化验证提交信息格式。

**示例：**

```bash
# 安装commitlint和husky
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky

# 配置commitlint
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# 设置Git钩子
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

## 10. 异常处理规范

### 10.1 冲突解决流程

**规则：** 标准化的冲突解决流程。

**示例：**

```bash
# 1. 获取最新代码
git fetch origin

# 2. 使用合并策略解决冲突
git merge --no-ff origin/develop
# 或者使用rebase
git rebase origin/develop

# 3. 手动解决冲突后标记为已解决
git add resolved-file.js

# 4. 继续操作
git rebase --continue
# 或
git merge --continue
```

### 10.2 历史修改规范

**规则：** 谨慎修改已推送的历史记录。

**示例：**

```bash
# 仅限未推送的提交
git commit --amend
git rebase -i HEAD~3

# 如果已推送，使用复原操作
git revert COMMIT_HASH

# 强制推送仅限特性分支且团队知晓的情况下
git push --force-with-lease
```

**附录：常用命令参考**

```bash
# 初始化和配置
git init
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 分支操作
git branch -a                    # 查看所有分支
git checkout -b feature/xxx      # 创建并切换分支
git branch -d feature/xxx        # 删除本地分支

# 提交历史
git log --oneline --graph --all  # 图形化查看历史
git blame filename               # 查看文件修改历史

# 撤销操作
git reset --soft HEAD~1          # 撤销提交但保留更改
git reset --hard HEAD~1          # 彻底撤销提交
git clean -fd                    # 清理未跟踪文件
```
