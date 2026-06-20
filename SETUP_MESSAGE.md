# 🚀 "Leave me a message" 功能设置指南

## 已创建的文件

✅ `message.html` - 留言表单页面  
✅ `functions/create-issue.js` - Netlify 云函数  
✅ `netlify.toml` - Netlify 配置文件  
✅ `.env.example` - 环境变量示例  

## 设置步骤

### 1️⃣ 生成 GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置 Token 名称，例如 "mysite-message"
4. 选择权限：仅勾选 **`repo`** (完整控制)
5. 点击 "Generate token" 并复制 Token（只显示一次！）

### 2️⃣ 在 Netlify 中添加环境变量

1. 进入 Netlify 项目设置
2. 前往 **Site settings** → **Build & deploy** → **Environment**
3. 点击 "Edit variables"
4. 添加新变量：
   - **Key**: `GITHUB_TOKEN`
   - **Value**: 粘贴你刚才复制的 Token
5. 保存

### 3️⃣ 部署到 Netlify

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 在项目根目录登录
netlify login

# 部署
netlify deploy --prod
```

或者直接连接 GitHub 仓库到 Netlify，自动部署。

### 4️⃣ 测试功能

1. 访问你的网站
2. 点击 "Leave me a message" 按钮
3. 填写表单并提交
4. 如果成功，会在你的 GitHub 仓库的 **Issues** 中看到新留言

## 🔒 安全说明

- Token 存储在 Netlify 环境变量中，不会暴露给用户
- 云函数验证了所有输入数据
- 留言长度限制（5-1000 字符）防止滥用
- 邮箱格式验证

## 📝 留言会自动标记为 "message" 标签

你可以在 GitHub Issues 中：
- 查看所有留言
- 回复用户
- 标记为已解决
- 分类管理

## ❓ 常见问题

**Q: 如果没有设置 Token 会怎样？**  
A: 提交时会显示"提交失败"的错误提示

**Q: Token 会过期吗？**  
A: Classic Token 不会过期，但建议定期检查权限

**Q: 用户会看到我的 Token 吗？**  
A: 不会，Token 只在服务器端使用，用户看不到

**Q: 能限制留言数量吗？**  
A: 可以在函数中添加频率限制（基于 IP 或邮箱）

---

💡 **提示**: 设置完成后，中国大陆用户就可以直接给你留言了！
