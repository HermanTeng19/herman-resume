# 🚀 简历网站部署指南

本指南将帮助你将Herman简历网站部署到公网上，提供Vercel和GitHub Pages两种方案。

## 📋 部署前准备

### 文件清单
确保你有以下文件：
- `herman-cover-page.html` - 落地页
- `herman-resume-website.html` - 完整简历
- `herman-resume-print.html` - 打印版简历
- `1.-Cover-e1727463705113.jpeg` - TD Centre夜景图片
- `README.md` - 项目说明
- `DEPLOYMENT-GUIDE.md` - 本部署指南

## 🎯 方案一：Vercel部署（推荐）

### 为什么选择Vercel？
- ⚡ **极速访问**：全球CDN，无论HR在哪里都能快速访问
- 🔒 **自动HTTPS**：专业安全的访问体验
- 🚀 **快速部署**：几秒钟完成部署
- 📱 **移动优化**：自动优化移动端体验
- 🆓 **免费使用**：100GB月流量，个人网站完全够用

### 部署步骤

#### 1. 创建GitHub仓库
```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "feat: add professional resume website

- Add interactive cover page with TD Bank branding
- Add comprehensive resume website with navigation
- Add print-friendly resume version
- Implement responsive design for all devices"

# 连接到GitHub仓库
git remote add origin https://github.com/你的用户名/herman-resume-website.git

# 推送到GitHub
git push -u origin main
```

#### 2. 连接Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign up" 使用GitHub账号登录
3. 点击 "New Project"
4. 选择你的 `herman-resume-website` 仓库
5. 项目设置：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: 留空（纯静态HTML）
   - **Output Directory**: 留空
6. 点击 "Deploy"

#### 3. 配置自定义域名（可选）
1. 在Vercel项目设置中点击 "Domains"
2. 添加你的域名，如：`herman-resume.com`
3. 按照提示配置DNS记录

#### 4. 设置首页
为了让访问者直接看到cover page，可以：
1. 将 `herman-cover-page.html` 重命名为 `index.html`
2. 或在Vercel设置中配置重定向规则

### 最终访问地址
- **Vercel域名**: `herman-resume-website.vercel.app`
- **自定义域名**: `你的域名.com`（如果配置了）

---

## 🐙 方案二：GitHub Pages部署

### 为什么选择GitHub Pages？
- 🆓 **完全免费**：无任何限制
- 🔗 **GitHub集成**：与代码仓库完美集成
- 🏠 **稳定可靠**：GitHub官方服务，稳定性高
- 👨‍💻 **开发者友好**：在开发者社区认可度高

### 部署步骤

#### 1. 创建GitHub仓库
```bash
# 如果还没创建Git仓库
git init
git add .
git commit -m "feat: add professional resume website"

# 创建GitHub仓库（在GitHub网站上创建后）
git remote add origin https://github.com/你的用户名/herman-resume-website.git
git push -u origin main
```

#### 2. 启用GitHub Pages
1. 在GitHub仓库页面，点击 "Settings"
2. 滚动到 "Pages" 部分
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 点击 "Save"

#### 3. 设置首页
1. 将 `herman-cover-page.html` 重命名为 `index.html`
2. 提交并推送更改：
```bash
git mv herman-cover-page.html index.html
git add .
git commit -m "feat: set cover page as homepage"
git push
```

### 最终访问地址
- **GitHub Pages域名**: `你的用户名.github.io/herman-resume-website`

---

## 🔧 部署后优化

### 1. 更新网站内容
每次修改后：
```bash
git add .
git commit -m "update: 描述你的更改"
git push
```

### 2. 性能监控
- 使用 [Google PageSpeed Insights](https://pagespeed.web.dev/) 检查网站性能
- 使用 [GTmetrix](https://gtmetrix.com/) 监控加载速度

### 3. SEO优化
在HTML文件的 `<head>` 部分添加：
```html
<meta name="description" content="Herman Teng - Senior Azure Data Engineer | 10+ years enterprise data engineering experience">
<meta name="keywords" content="Azure, Data Engineer, Python, PySpark, TD Bank">
<meta property="og:title" content="Herman Teng - Senior Azure Data Engineer">
<meta property="og:description" content="Microsoft Azure Certified Data Engineer with 10+ years experience">
```

## 📱 测试清单

部署完成后，请测试：
- [ ] Cover page加载正常
- [ ] Resume页面所有链接工作
- [ ] Print页面可以正常打印/保存PDF
- [ ] 移动端显示正常
- [ ] 所有按钮功能正常
- [ ] 图片加载正常

## 🆘 故障排除

### 常见问题
1. **图片不显示**：确保图片文件在仓库中且路径正确
2. **页面404**：检查文件名大小写是否正确
3. **样式异常**：检查CDN链接是否可访问
4. **部署失败**：查看构建日志找出错误原因

### 联系支持
- **Vercel支持**：[vercel.com/support](https://vercel.com/support)
- **GitHub支持**：[support.github.com](https://support.github.com)

---

## 🎉 部署成功！

恭喜！你的专业简历网站现在已经在公网上运行了。

**下一步建议：**
1. 将网站链接添加到你的LinkedIn简介
2. 在求职邮件中分享网站链接
3. 定期更新简历内容
4. 考虑添加Google Analytics跟踪访问数据

**示例分享文案：**
> 查看我的在线简历：[your-website-url] 
> 包含完整的项目经验、技术栈和成就展示。支持在线查看和PDF打印。 