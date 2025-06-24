# 简历网站更新工作流程文档

## 📋 概述

本文档描述了如何使用自动化工具来维护和更新Herman Teng的专业简历网站。工作流程支持从Markdown源文件自动生成现代化的HTML简历网站。

## 🏗️ 项目结构

```
herman-resume/
├── Herman-Resume-V2.md                    # 📝 简历源文件（主要编辑文件）
├── generate-resume-website.js             # 🔧 自动生成器程序
├── index.html                            # 🎨 封面页面（Landing Page）
├── herman-resume-website.html            # 📄 当前简历网站
├── herman-resume-print.html              # 🖨️ 打印版本简历
├── Herman-Teng-Resume-Website-Auto.html  # 🤖 自动生成的新版本
├── README.md                             # 📖 项目说明
├── DEPLOYMENT-GUIDE.md                   # 🚀 部署指南
└── RESUME-UPDATE-WORKFLOW.md             # 📋 本工作流程文档
```

## 🔄 更新工作流程

### 步骤 1: 编辑简历内容

编辑 `Herman-Resume-V2.md` 文件来更新简历内容：

```bash
# 使用您喜欢的编辑器
code Herman-Resume-V2.md
# 或
nano Herman-Resume-V2.md
```

**支持的内容部分：**
- `## PROFESSIONAL SUMMARY` - 专业总结
- `## 🏆 KEY ACHIEVEMENTS` - 关键成就
- `## CORE COMPETENCIES` - 核心能力  
- `## PROFESSIONAL EXPERIENCE` - 工作经历
- `## PROJECTS & ACHIEVEMENTS` - 项目和成就

### 步骤 2: 运行自动生成器

在项目根目录执行：

```bash
node generate-resume-website.js
```

**期望输出：**
```
🚀 开始生成简历网站...
✅ 简历文件读取成功
✅ 简历内容解析完成
✅ HTML网站生成完成
🎉 网站生成成功！
📁 文件位置: Herman-Teng-Resume-Website-Auto.html
💻 用浏览器打开HTML文件即可查看
🎨 网站保持了原始的Azure蓝紫渐变设计风格
```

### 步骤 3: 预览和验证

在浏览器中打开生成的文件预览：

```bash
# macOS
open Herman-Teng-Resume-Website-Auto.html

# Windows
start Herman-Teng-Resume-Website-Auto.html

# Linux
xdg-open Herman-Teng-Resume-Website-Auto.html
```

**验证清单：**
- [ ] 个人信息正确显示
- [ ] 所有章节内容完整
- [ ] 导航链接工作正常
- [ ] "Back to Cover Page"链接存在
- [ ] 移动端响应式布局正常
- [ ] 联系信息准确

### 步骤 4: 替换现有文件（可选）

如果满意生成的版本，替换现有简历页面：

```bash
# 备份当前版本
cp herman-resume-website.html herman-resume-website-backup.html

# 替换为新版本
mv Herman-Teng-Resume-Website-Auto.html herman-resume-website.html
```

### 步骤 5: 提交和部署

```bash
# 添加更改到Git
git add .

# 提交更改
git commit -m "feat: update resume content - $(date '+%Y-%m-%d')"

# 推送到远程仓库
git push origin main
```

## 🎯 自动化脚本（可选）

创建快速更新脚本 `update-resume.sh`：

```bash
#!/bin/bash
echo "🚀 开始更新简历网站..."

# 运行生成器
node generate-resume-website.js

# 检查生成是否成功
if [ $? -eq 0 ]; then
    echo "✅ 简历生成成功！"
    
    # 询问是否替换现有文件
    read -p "是否替换现有简历文件？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp herman-resume-website.html herman-resume-website-backup.html
        mv Herman-Teng-Resume-Website-Auto.html herman-resume-website.html
        echo "✅ 文件替换完成！"
        
        # 提交更改
        git add .
        git commit -m "feat: update resume content - $(date '+%Y-%m-%d')"
        git push origin main
        echo "🚀 更改已推送到GitHub！"
    fi
else
    echo "❌ 简历生成失败，请检查错误信息"
fi
```

使用脚本：
```bash
chmod +x update-resume.sh
./update-resume.sh
```

## 🛠️ 程序配置

### 生成器程序特性

`generate-resume-website.js` 包含以下功能：

- **自动解析** - 智能解析Markdown格式
- **模板生成** - 使用预定义的专业模板
- **响应式设计** - 自动适配移动端和桌面端
- **Azure主题** - 保持蓝紫渐变设计风格
- **交互效果** - 包含悬停动画和技能条
- **导航集成** - 自动添加返回Cover Page链接

### 支持的Markdown格式

```markdown
# **姓名**
**职位标题**

邮箱 | LinkedIn | GitHub | 博客 | 电话

## PROFESSIONAL SUMMARY
专业总结内容...

## 🏆 KEY ACHIEVEMENTS
• **成就标题:** 成就描述

## CORE COMPETENCIES
**技能1** • **技能2** • **技能3**

## PROFESSIONAL EXPERIENCE
### **职位名称**
**日期 | 部门 | 公司**
• 职责描述

## PROJECTS & ACHIEVEMENTS
### **项目名称**
• 项目描述
```

## 🔧 故障排除

### 常见问题

**1. 程序运行失败**
```bash
# 检查Node.js版本
node --version

# 重新安装依赖（如果有package.json）
npm install
```

**2. 文件读取错误**
```bash
# 确认文件存在
ls -la Herman-Resume-V2.md

# 检查文件权限
chmod 644 Herman-Resume-V2.md
```

**3. 生成内容不完整**
- 检查Markdown格式是否正确
- 确认章节标题使用正确的格式（`## SECTION_NAME`）
- 验证特殊字符和emoji是否正确

**4. 导航链接不工作**
- 确认 `index.html` 文件存在
- 检查文件路径是否正确

### 调试模式

在程序中添加调试输出：

```javascript
// 在 generate-resume-website.js 中添加
console.log('解析的简历数据:', JSON.stringify(resumeData, null, 2));
```

## 📈 最佳实践

### 1. 版本控制策略

```bash
# 创建功能分支
git checkout -b feature/update-resume-content

# 提交更改
git commit -m "feat: add new project experience"

# 合并到主分支
git checkout main
git merge feature/update-resume-content
```

### 2. 备份策略

```bash
# 定期备份重要文件
cp Herman-Resume-V2.md backups/Herman-Resume-V2-$(date +%Y%m%d).md
cp herman-resume-website.html backups/herman-resume-website-$(date +%Y%m%d).html
```

### 3. 内容维护

- **定期更新** - 每月检查和更新内容
- **数据准确性** - 确保所有数字和日期准确
- **关键词优化** - 包含行业相关关键词
- **成就量化** - 使用具体数字和百分比

### 4. 质量检查

```bash
# HTML验证（使用在线工具或本地验证器）
# CSS验证
# 链接检查
# 移动端测试
```

## 🚀 部署集成

### 自动部署到Vercel

程序生成的文件会自动通过以下流程部署：

1. **推送到GitHub** → 2. **Vercel自动检测** → 3. **构建和部署** → 4. **网站更新**

### 部署验证

部署后访问：
- **主页:** https://resume.hermanteng.net
- **简历页面:** https://resume.hermanteng.net/herman-resume-website.html

## 📞 支持和维护

### 技术支持

- **程序问题** - 检查JavaScript语法和逻辑
- **样式问题** - 修改CSS模板部分
- **内容问题** - 更新Markdown源文件

### 定期维护任务

- [ ] 每月更新简历内容
- [ ] 每季度检查链接有效性
- [ ] 每半年备份所有文件
- [ ] 每年审查和优化工作流程

---

## 📝 更新日志

- **2024-12-XX** - 初始工作流程文档创建
- **2024-12-XX** - 添加自动化脚本支持
- **2024-12-XX** - 集成导航链接功能

---

*本文档随项目发展持续更新。如有问题或建议，请创建GitHub Issue。* 