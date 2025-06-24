#!/bin/bash

# 简历网站自动更新脚本
# 用法: ./update-resume.sh

echo "🚀 Herman Resume Website 自动更新工具"
echo "======================================="

# 检查必要文件是否存在
if [ ! -f "Herman-Resume-V2.md" ]; then
    echo "❌ 错误: 找不到 Herman-Resume-V2.md 文件"
    exit 1
fi

if [ ! -f "generate-resume-website.js" ]; then
    echo "❌ 错误: 找不到 generate-resume-website.js 程序"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "📁 当前工作目录: $(pwd)"
echo "📝 简历源文件: Herman-Resume-V2.md"
echo ""

# 运行生成器
echo "🔧 运行简历生成器..."
node generate-resume-website.js

# 检查生成是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 简历生成成功！"
    echo "📄 生成文件: Herman-Teng-Resume-Website-Auto.html"
    
    # 打开文件预览（可选）
    read -p "🔍 是否在浏览器中预览生成的简历？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open Herman-Teng-Resume-Website-Auto.html
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open Herman-Teng-Resume-Website-Auto.html
        elif [[ "$OSTYPE" == "msys" ]]; then
            start Herman-Teng-Resume-Website-Auto.html
        fi
        echo "🌐 已在浏览器中打开预览"
        echo ""
        read -p "📝 预览完成后，按任意键继续..."
    fi
    
    # 询问是否替换现有文件
    echo ""
    read -p "🔄 是否替换现有的 herman-resume-website.html 文件？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 创建备份
        if [ -f "herman-resume-website.html" ]; then
            backup_name="herman-resume-website-backup-$(date +%Y%m%d-%H%M%S).html"
            cp herman-resume-website.html "$backup_name"
            echo "💾 已备份原文件为: $backup_name"
        fi
        
        # 替换文件
        mv Herman-Teng-Resume-Website-Auto.html herman-resume-website.html
        echo "✅ 文件替换完成！"
        
        # 询问是否提交到Git
        echo ""
        read -p "📤 是否提交更改到Git并推送？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # 检查Git状态
            if git rev-parse --git-dir > /dev/null 2>&1; then
                echo "📋 Git状态检查..."
                git status --porcelain
                
                # 添加更改
                git add .
                
                # 获取提交信息
                echo ""
                read -p "💬 输入提交信息 (留空使用默认): " commit_msg
                if [ -z "$commit_msg" ]; then
                    commit_msg="feat: update resume content - $(date '+%Y-%m-%d %H:%M')"
                fi
                
                # 提交更改
                git commit -m "$commit_msg"
                
                if [ $? -eq 0 ]; then
                    echo "✅ Git提交成功！"
                    
                    # 推送到远程
                    echo "🚀 推送到远程仓库..."
                    git push origin main
                    
                    if [ $? -eq 0 ]; then
                        echo "🎉 更改已成功推送到GitHub！"
                        echo "🌐 Vercel将自动部署更新"
                        echo ""
                        echo "📱 网站链接:"
                        echo "   主页: https://resume.hermanteng.net"
                        echo "   简历: https://resume.hermanteng.net/herman-resume-website.html"
                    else
                        echo "❌ 推送失败，请检查网络连接和权限"
                    fi
                else
                    echo "❌ Git提交失败"
                fi
            else
                echo "❌ 当前目录不是Git仓库"
            fi
        else
            echo "📝 文件已更新，但未提交到Git"
        fi
    else
        echo "📝 新版本已生成但未替换现有文件"
        echo "💡 您可以手动比较和替换: Herman-Teng-Resume-Website-Auto.html"
    fi
else
    echo "❌ 简历生成失败，请检查错误信息"
    echo ""
    echo "🔧 故障排除提示:"
    echo "   1. 检查 Herman-Resume-V2.md 文件格式"
    echo "   2. 确认所有章节标题格式正确"
    echo "   3. 验证特殊字符和emoji"
    echo "   4. 查看具体错误信息"
    exit 1
fi

echo ""
echo "🎉 简历更新流程完成！"
echo "📖 更多信息请查看: RESUME-UPDATE-WORKFLOW.md" 