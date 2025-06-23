# 🚀 GitHub Pages 简历网站部署完整指南

## 📋 **部署概览**

本指南将帮助您将自动生成的简历网站部署到GitHub Pages，并配置自定义域名：
- **主域名**：`resume.hermanteng.net`
- **备用域名**：`cv.hermanteng.net`

**总时间**：约30-45分钟  
**费用**：完全免费  
**技术要求**：基本的网页操作，无需编程经验

---

## 🎯 **第一步：创建GitHub仓库**

### 1.1 注册/登录GitHub账户
- 访问 [github.com](https://github.com)
- 如果没有账户，点击 "Sign up" 注册
- 已有账户直接登录

### 1.2 创建新仓库
1. **点击右上角的 "+" 按钮** → 选择 "New repository"

2. **填写仓库信息**：
   ```
   Repository name: herman-resume-website
   Description: Herman Teng - Senior Azure Data Engineer Resume Website
   Visibility: ✅ Public（必须选择Public）
   Initialize: ✅ Add a README file
   ```

3. **点击绿色按钮 "Create repository"**

**✅ 完成第一步！** 您现在有了一个空的GitHub仓库。

---

## 📁 **第二步：准备网站文件**

### 2.1 准备index.html文件
在您的电脑上，找到之前生成的简历网站文件：
- 原文件：`Herman-Teng-Resume-Website-Auto.html`
- **重要**：将其重命名为 `index.html`

**为什么要重命名？**
- GitHub Pages自动将 `index.html` 作为网站首页
- 访问者打开域名时会直接看到这个文件

### 2.2 可选：创建CNAME文件
创建一个名为 `CNAME` 的文件（无扩展名），内容为：
```
resume.hermanteng.net
```

**这个文件的作用**：告诉GitHub Pages您想使用自定义域名。

---

## ⬆️ **第三步：上传文件到GitHub**

### 方法A：网页界面上传（推荐新手）

1. **进入您的仓库页面**

2. **点击 "Add file"** → 选择 "Upload files"

3. **拖拽文件**：
   - 将 `index.html` 拖到上传区域
   - 如果创建了CNAME文件，也一起拖拽

4. **填写提交信息**：
   ```
   Commit title: Add resume website
   Description: Deploy Herman Teng resume website
   ```

5. **点击 "Commit changes"**

### 方法B：Git命令行（适合有经验用户）

```bash
# 1. 克隆仓库到本地
git clone https://github.com/您的用户名/herman-resume-website.git
cd herman-resume-website

# 2. 复制文件
cp /path/to/Herman-Teng-Resume-Website-Auto.html index.html

# 3. 添加文件并提交
git add index.html
git commit -m "Add resume website"
git push origin main
```

**✅ 完成第二步！** 您的网站文件现在已在GitHub上。

---

## 🌐 **第四步：启用GitHub Pages**

### 4.1 进入Pages设置
1. **在仓库页面，点击顶部的 "Settings" 选项卡**
2. **在左侧菜单中找到并点击 "Pages"**

### 4.2 配置Pages
1. **Source（源）设置**：
   - 选择 "Deploy from a branch"
   - Branch: 选择 "main"
   - Folder: 选择 "/ (root)"

2. **点击 "Save" 保存**

### 4.3 获取默认网址
保存后，GitHub会显示您的网站地址：
```
Your site is published at https://您的用户名.github.io/herman-resume-website/
```

**测试**：点击这个链接，确认您的简历网站正常显示。

**✅ 完成第三步！** 您的网站现在已经在线！

---

## 🔗 **第五步：配置自定义域名**

### 5.1 在GitHub中添加自定义域名

1. **仍在Pages设置页面，找到 "Custom domain" 部分**

2. **输入主域名**：
   ```
   resume.hermanteng.net
   ```

3. **点击 "Save"**

4. **等待DNS检查**：
   - GitHub会检查DNS记录
   - 可能显示红色警告⚠️，这是正常的，因为我们还没配置DNS

### 5.2 配置DNS记录（在您的域名提供商处）

登录您的域名管理面板（如GoDaddy、Namecheap等），添加以下记录：

**主域名配置：**
```
Type: CNAME
Name: resume
Value: 您的用户名.github.io
TTL: 3600（或默认值）
```

**备用域名配置：**
```
Type: CNAME  
Name: cv
Value: 您的用户名.github.io
TTL: 3600（或默认值）
```

### 5.3 等待DNS生效
- **时间**：通常5-30分钟，最长可能需要24小时
- **检查方法**：在浏览器中访问 `resume.hermanteng.net`

### 5.4 启用HTTPS（重要）
DNS生效后：
1. **回到GitHub Pages设置**
2. **勾选 "Enforce HTTPS"**
3. **这会为您的网站启用SSL安全证书**

**✅ 完成第四步！** 您的自定义域名现在已配置完成！

---

## 🔄 **第六步：设置自动更新流程**

### 6.1 创建更新脚本

在您的本地电脑上，创建一个名为 `update-website.sh` 的脚本：

```bash
#!/bin/bash
echo "🚀 开始更新简历网站..."

# 1. 生成最新的HTML文件
node generate-resume-website.js

# 2. 重命名为index.html
cp Herman-Teng-Resume-Website-Auto.html index.html

# 3. 推送到GitHub（需要先设置Git仓库）
git add index.html
git commit -m "Update resume website - $(date)"
git push origin main

echo "✅ 网站更新完成！"
echo "🌐 访问: https://resume.hermanteng.net"
```

### 6.2 使用更新脚本

每次更新简历后：
```bash
# 1. 编辑 Herman-Resume-V2.md
# 2. 运行更新脚本
bash update-website.sh
```

**✅ 完成所有设置！** 您现在有了一个专业的在线简历！

---

## 📊 **部署后的访问地址**

部署成功后，您的简历网站可以通过以下地址访问：

### 主要地址
- ✅ `https://resume.hermanteng.net`
- ✅ `https://cv.hermanteng.net` 
- ✅ `https://您的用户名.github.io/herman-resume-website/`

### 功能特点
- 🔒 **HTTPS安全加密**
- 📱 **移动设备友好**
- ⚡ **全球CDN加速**
- 🆓 **完全免费**

---

## 🛠️ **常见问题与解决方案**

### Q1: DNS配置后网站无法访问
**解决方案**：
- 等待24小时让DNS完全生效
- 使用 [whatsmydns.net](https://whatsmydns.net) 检查DNS传播状态
- 确认DNS记录配置正确

### Q2: GitHub Pages显示404错误
**解决方案**：
- 确认文件名为 `index.html`（不是index.HTML）
- 检查仓库是否为Public
- 确认Pages设置中选择了正确的分支

### Q3: 网站显示但样式错误
**解决方案**：
- 检查HTML文件是否完整
- 确认CDN资源（Tailwind CSS, Lucide Icons）可以正常加载
- 尝试强制刷新页面（Ctrl+F5）

### Q4: 自定义域名无法启用HTTPS
**解决方案**：
- 等待DNS完全生效后再启用HTTPS
- 临时取消勾选，等待几小时后重新勾选

### Q5: 想要更改域名
**解决方案**：
- 在GitHub Pages设置中更改Custom domain
- 同时更新DNS记录指向新域名

---

## 📈 **进阶功能（可选）**

### 网站分析
添加Google Analytics追踪访问数据：
1. 在 `index.html` 的 `<head>` 标签中添加GA代码
2. 监控访问量、访客来源等数据

### SEO优化
- 添加meta标签（描述、关键词）
- 创建sitemap.xml文件
- 提交到Google Search Console

### 自动化部署
- 设置GitHub Actions自动构建
- 连接到简历编辑系统

---

## 🎉 **总结**

完成以上步骤后，您将拥有：

✅ **专业的在线简历网站**  
✅ **自定义域名（resume.hermanteng.net & cv.hermanteng.net）**  
✅ **HTTPS安全加密**  
✅ **全球访问加速**  
✅ **移动设备优化**  
✅ **简单的更新流程**  

**下次更新简历时**，只需：
1. 编辑 `Herman-Resume-V2.md` 文件
2. 运行 `node generate-resume-website.js`
3. 上传新的 `index.html` 到GitHub

**您的职业简历网站就是这么简单！** 🚀

---

## 📞 **技术支持**

如果在部署过程中遇到问题：
1. 仔细检查每个步骤是否正确完成
2. 查看GitHub Pages的状态页面
3. 检查域名DNS设置
4. 参考GitHub Pages官方文档

**记住**：大多数问题都是由于DNS传播时间或配置错误造成的，耐心等待通常能解决问题。 