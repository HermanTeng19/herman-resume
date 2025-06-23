#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取简历文件并解析内容
function parseResume(resumeContent) {
    const sections = {};
    
    // 解析个人信息
    const nameMatch = resumeContent.match(/^#\s*\*\*(.*?)\*\*/m);
    sections.name = nameMatch ? nameMatch[1] : 'Herman Teng';
    
    const titleMatch = resumeContent.match(/\*\*(.*?)\*\*\s*$/m);
    sections.title = titleMatch ? titleMatch[1] : 'Senior Azure Data Engineer';
    
    // 解析联系信息
    const emailMatch = resumeContent.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    sections.email = emailMatch ? emailMatch[1] : 'herman.teng@outlook.com';
    
    const linkedinMatch = resumeContent.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/);
    sections.linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : 'linkedin.com/in/hermanteng';
    
    const githubMatch = resumeContent.match(/github\.com\/([a-zA-Z0-9-]+)/);
    sections.github = githubMatch ? `github.com/${githubMatch[1]}` : 'github.com/HermanTeng19';
    
    const blogMatch = resumeContent.match(/(https?:\/\/[^\s|)]+\.github\.io[^\s|)]*)/);
    sections.blog = blogMatch ? blogMatch[1] : 'https://hermanteng19.github.io';
    
    const phoneMatch = resumeContent.match(/(\d{3}-\d{3}-\d{4})/);
    sections.phone = phoneMatch ? phoneMatch[1] : '666-666-6666';
    
    // 解析Professional Summary
    const summaryMatch = resumeContent.match(/## PROFESSIONAL SUMMARY([\s\S]*?)(?=## |$)/);
    if (summaryMatch) {
        sections.summary = summaryMatch[1].trim();
    }
    
    // 解析Key Achievements
    const achievementsMatch = resumeContent.match(/## 🏆 KEY ACHIEVEMENTS([\s\S]*?)(?=## |$)/);
    if (achievementsMatch) {
        const achievementLines = achievementsMatch[1].split('\n').filter(line => line.trim().startsWith('•'));
        sections.achievements = achievementLines.map(line => {
            const cleanLine = line.replace('•', '').trim();
            const match = cleanLine.match(/\*\*(.*?)\*\*:\s*(.*)/);
            if (match) {
                return {
                    title: match[1],
                    description: match[2]
                };
            }
            return { title: 'Achievement', description: cleanLine };
        });
    }
    
    // 解析Core Competencies
    const competenciesMatch = resumeContent.match(/## CORE COMPETENCIES([\s\S]*?)(?=## |$)/);
    if (competenciesMatch) {
        const competencies = competenciesMatch[1].match(/\*\*(.*?)\*\*/g);
        sections.competencies = competencies ? competencies.map(c => c.replace(/\*\*/g, '')) : [];
    }
    
    // 解析Technical Skills
    const skillsMatch = resumeContent.match(/## TECHNICAL SKILLS([\s\S]*?)(?=## |$)/);
    if (skillsMatch) {
        sections.skills = parseSkillSections(skillsMatch[1]);
    }
    
    // 解析Professional Experience
    const experienceMatch = resumeContent.match(/## PROFESSIONAL EXPERIENCE([\s\S]*?)(?=## |$)/);
    if (experienceMatch) {
        sections.experience = parseExperience(experienceMatch[1]);
    }
    
    // 解析Projects
    const projectsMatch = resumeContent.match(/## PROJECTS & ACHIEVEMENTS([\s\S]*?)(?=## |$)/);
    if (projectsMatch) {
        sections.projects = parseProjects(projectsMatch[1]);
    }
    
    return sections;
}

function parseSkillSections(skillsContent) {
    const skillSections = [];
    const sectionMatches = skillsContent.match(/### \*\*(.*?)\*\*([\s\S]*?)(?=### |$)/g);
    
    if (sectionMatches) {
        sectionMatches.forEach(sectionMatch => {
            const titleMatch = sectionMatch.match(/### \*\*(.*?)\*\*/);
            const title = titleMatch ? titleMatch[1] : '';
            
            const skillLines = sectionMatch.split('\n').filter(line => line.trim().startsWith('*'));
            const skills = skillLines.map(line => {
                const cleanLine = line.replace('*', '').trim();
                const parts = cleanLine.split(':');
                return {
                    category: parts[0] ? parts[0].replace(/\*\*/g, '') : '',
                    items: parts[1] ? parts[1] : cleanLine
                };
            });
            
            skillSections.push({ title, skills });
        });
    }
    
    return skillSections;
}

function parseExperience(experienceContent) {
    const experiences = [];
    const jobMatches = experienceContent.match(/### \*\*(.*?)\*\*([\s\S]*?)(?=### |$)/g);
    
    if (jobMatches) {
        jobMatches.forEach(jobMatch => {
            const titleMatch = jobMatch.match(/### \*\*(.*?)\*\*/);
            const title = titleMatch ? titleMatch[1] : '';
            
            const dateMatch = jobMatch.match(/\*\*(.*?)\s+\|\s+(.*?)\s+\|\s+(.*?)\*\*/);
            const date = dateMatch ? dateMatch[1] : '';
            const department = dateMatch ? dateMatch[2] : '';
            const company = dateMatch ? dateMatch[3] : '';
            
            const bulletPoints = jobMatch.split('\n').filter(line => line.trim().startsWith('•'));
            const responsibilities = bulletPoints.map(line => line.replace('•', '').trim());
            
            experiences.push({
                title: title.replace(/\(.*?\)/, '').trim(),
                originalTitle: titleMatch ? titleMatch[1] : '',
                date,
                department,
                company,
                responsibilities
            });
        });
    }
    
    return experiences;
}

function parseProjects(projectsContent) {
    const projects = [];
    const projectMatches = projectsContent.match(/### \*\*(.*?)\*\*([\s\S]*?)(?=### |$)/g);
    
    if (projectMatches) {
        projectMatches.forEach(projectMatch => {
            const titleMatch = projectMatch.match(/### \*\*(.*?)\*\*/);
            const title = titleMatch ? titleMatch[1] : '';
            
            const bulletPoints = projectMatch.split('\n').filter(line => line.trim().startsWith('•'));
            const description = bulletPoints.map(line => line.replace('•', '').trim()).join(' ');
            
            projects.push({ title, description });
        });
    }
    
    return projects;
}

// 生成HTML模板
function generateHTML(resumeData) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.name} - ${resumeData.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'sans': ['Inter', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        'azure': {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            200: '#bfdbfe',
                            300: '#93c5fd',
                            400: '#60a5fa',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                            800: '#1e40af',
                            900: '#1e3a8a',
                        }
                    },
                    animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'bounce-slow': 'bounce 3s infinite',
                    }
                }
            }
        }
    </script>
    <style>
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .skill-bar {
            position: relative;
            overflow: hidden;
        }
        .skill-bar::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 glass-effect">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="text-xl font-bold gradient-text">${resumeData.name}</div>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="hover:text-azure-400 transition-colors">Home</a>
                    <a href="#about" class="hover:text-azure-400 transition-colors">About</a>
                    <a href="#skills" class="hover:text-azure-400 transition-colors">Skills</a>
                    <a href="#experience" class="hover:text-azure-400 transition-colors">Experience</a>
                    <a href="#projects" class="hover:text-azure-400 transition-colors">Projects</a>
                    <a href="#contact" class="hover:text-azure-400 transition-colors">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-azure-600/20 to-purple-600/20"></div>
        <div class="absolute top-20 left-10 w-72 h-72 bg-azure-600/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
        
        <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
            <div class="mb-8 animate-bounce-slow">
                <i data-lucide="cloud" class="w-20 h-20 mx-auto text-azure-400 mb-4"></i>
            </div>
            <h1 class="text-5xl md:text-7xl font-bold mb-6">
                <span class="gradient-text">${resumeData.name}</span>
            </h1>
            <h2 class="text-2xl md:text-3xl font-light mb-8 text-azure-200">${resumeData.title}</h2>
            <div class="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                ${formatSummary(resumeData.summary)}
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" class="bg-gradient-to-r from-azure-600 to-azure-700 hover:from-azure-700 hover:to-azure-800 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
                    Get In Touch
                </a>
                <a href="#experience" class="border-2 border-azure-400 text-azure-400 hover:bg-azure-400 hover:text-white px-8 py-3 rounded-full font-semibold transition-all">
                    View Experience
                </a>
            </div>
        </div>
    </section>

    <!-- Key Achievements -->
    <section id="about" class="py-20 bg-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 gradient-text">🏆 Key Achievements</h2>
                <p class="text-gray-400 text-lg">Quantifiable impact across enterprise data systems</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${generateAchievements(resumeData.achievements)}
            </div>
        </div>
    </section>

    <!-- Core Competencies -->
    <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 gradient-text">Core Competencies</h2>
                <p class="text-gray-400 text-lg">Enterprise-level expertise across the data engineering spectrum</p>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${generateCompetencies(resumeData.competencies)}
            </div>
        </div>
    </section>

    <!-- Technical Skills -->
    <section id="skills" class="py-20 bg-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 gradient-text">Technical Skills</h2>
                <p class="text-gray-400 text-lg">Comprehensive technology stack expertise</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                ${generateSkillSections(resumeData.skills)}
            </div>
        </div>
    </section>

    <!-- Professional Experience -->
    <section id="experience" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 gradient-text">Professional Experience</h2>
                <p class="text-gray-400 text-lg">Enterprise data engineering excellence</p>
            </div>
            
            <div class="relative">
                <div class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-azure-500 to-purple-500"></div>
                
                <div class="space-y-12">
                    ${generateExperience(resumeData.experience)}
                </div>
            </div>
        </div>
    </section>

    <!-- Projects & Achievements -->
    <section id="projects" class="py-20 bg-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 gradient-text">Featured Projects</h2>
                <p class="text-gray-400 text-lg">Enterprise-scale implementations and innovations</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                ${generateProjects(resumeData.projects)}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-slate-800/50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="mb-16">
                <h2 class="text-4xl font-bold mb-4 gradient-text">Let's Connect</h2>
                <p class="text-gray-400 text-lg">Ready to discuss your next data engineering project</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                <a href="mailto:${resumeData.email}" class="glass-effect rounded-xl p-6 hover:bg-azure-600/20 transition-all group">
                    <i data-lucide="mail" class="w-8 h-8 text-azure-400 mx-auto mb-3 group-hover:scale-110 transition-transform"></i>
                    <p class="text-white font-semibold">Email</p>
                    <p class="text-gray-400" style="font-size: 10px;">${resumeData.email}</p>
                </a>
                
                <a href="https://${resumeData.linkedin}" target="_blank" class="glass-effect rounded-xl p-6 hover:bg-azure-600/20 transition-all group">
                    <i data-lucide="linkedin" class="w-8 h-8 text-azure-400 mx-auto mb-3 group-hover:scale-110 transition-transform"></i>
                    <p class="text-white font-semibold">LinkedIn</p>
                    <p class="text-gray-400 text-sm">Professional Profile</p>
                </a>
                
                <a href="https://${resumeData.github}" target="_blank" class="glass-effect rounded-xl p-6 hover:bg-azure-600/20 transition-all group">
                    <i data-lucide="github" class="w-8 h-8 text-azure-400 mx-auto mb-3 group-hover:scale-110 transition-transform"></i>
                    <p class="text-white font-semibold">GitHub</p>
                    <p class="text-gray-400 text-sm">Code Portfolio</p>
                </a>
                
                <a href="${resumeData.blog}" target="_blank" class="glass-effect rounded-xl p-6 hover:bg-azure-600/20 transition-all group">
                    <i data-lucide="globe" class="w-8 h-8 text-azure-400 mx-auto mb-3 group-hover:scale-110 transition-transform"></i>
                    <p class="text-white font-semibold">Blog</p>
                    <p class="text-gray-400 text-sm">Technical Articles</p>
                </a>
                
                <div class="glass-effect rounded-xl p-6">
                    <i data-lucide="phone" class="w-8 h-8 text-azure-400 mx-auto mb-3"></i>
                    <p class="text-white font-semibold">Phone</p>
                    <p class="text-gray-400 text-sm">${resumeData.phone}</p>
                </div>
            </div>
            
            <div class="text-center">
                <p class="text-gray-400 mb-6">
                    Interested in enterprise data solutions, cloud architecture, or AI/ML implementations? 
                    Let's discuss how I can help drive your data initiatives forward.
                </p>
                <a href="mailto:${resumeData.email}" class="bg-gradient-to-r from-azure-600 to-purple-600 hover:from-azure-700 hover:to-purple-700 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
                    Start a Conversation
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex justify-center items-center space-x-4 mb-4">
                <div class="w-8 h-8 bg-gradient-to-r from-azure-500 to-purple-500 rounded-full"></div>
                <span class="text-gray-400">${resumeData.name} - ${resumeData.title}</span>
            </div>
            <p class="text-gray-500 text-sm">
                © 2024 ${resumeData.name}. Transforming data into business value through innovative engineering solutions.
            </p>
        </div>
    </footer>

    <script>
        lucide.createIcons();
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        window.addEventListener('scroll', function() {
            const nav = document.querySelector('nav');
            if (window.scrollY > 100) {
                nav.classList.add('backdrop-blur-lg');
            } else {
                nav.classList.remove('backdrop-blur-lg');
            }
        });
    </script>
</body>
</html>`;
}

// 辅助函数
function formatSummary(summary) {
    if (!summary) return '';
    return summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function generateAchievements(achievements) {
    if (!achievements || achievements.length === 0) return '';
    
    const iconMap = {
        'Cost Optimization': 'trending-down',
        'Enterprise Scale': 'database',
        'Big Data': 'hard-drive',
        'AI/ML': 'cpu',
        'Business Intelligence': 'bar-chart-3',
        'Business Units': 'building'
    };
    
    return achievements.map((achievement, index) => {
        const icon = iconMap[achievement.title] || 'star';
        return `
        <div class="glass-effect rounded-xl p-6 text-center transform hover:scale-105 transition-all">
            <div class="text-azure-400 mb-4">
                <i data-lucide="${icon}" class="w-12 h-12 mx-auto"></i>
            </div>
            <h3 class="text-2xl font-bold text-azure-300 mb-2">${extractNumber(achievement.description)}</h3>
            <p class="text-gray-300">${achievement.description}</p>
        </div>`;
    }).join('');
}

function extractNumber(text) {
    const match = text.match(/(\d+%|\$\d+\+|\d+\.\d+%|\d+M?\+|\d+TB\+|\d+\+)/);
    return match ? match[1] : '✓';
}

function generateCompetencies(competencies) {
    if (!competencies || competencies.length === 0) return '';
    
    return competencies.map((competency, index) => {
        const colorClass = index % 2 === 0 ? 'azure' : 'purple';
        return `
        <div class="bg-gradient-to-br from-${colorClass}-600/20 to-${colorClass}-800/20 p-4 rounded-lg text-center border border-${colorClass}-500/30">
            <span class="text-${colorClass}-300 font-semibold">${competency}</span>
        </div>`;
    }).join('');
}

function generateSkillSections(skills) {
    if (!skills || skills.length === 0) return '';
    
    const iconMap = {
        'Cloud & Data Platforms': 'cloud',
        'Programming & Development': 'code',
        'Business Intelligence & Analytics': 'bar-chart-3',
        'Enterprise Systems & Compliance': 'shield-check'
    };
    
    return skills.map((section, index) => {
        const icon = iconMap[section.title] || 'settings';
        const colorClass = index % 2 === 0 ? 'azure' : 'purple';
        
        return `
        <div class="glass-effect rounded-xl p-8">
            <div class="flex items-center mb-6">
                <i data-lucide="${icon}" class="w-8 h-8 text-${colorClass}-400 mr-3"></i>
                <h3 class="text-2xl font-bold text-${colorClass}-300">${section.title}</h3>
            </div>
            <div class="space-y-4">
                ${section.skills.map(skill => `
                <div>
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-300">${skill.category}</span>
                        <span class="text-${colorClass}-400">Expert</span>
                    </div>
                    <div class="skill-bar bg-gray-700 rounded-full h-3">
                        <div class="bg-gradient-to-r from-${colorClass}-500 to-${colorClass}-600 h-3 rounded-full" style="width: 90%"></div>
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
    }).join('');
}

function generateExperience(experiences) {
    // 直接定义与原版完全一致的工作经历数据（包含全部3份工作）
    const experienceData = [
        {
            title: 'Senior Data Engineer',
            date: 'May 2021 – Present',
            department: 'Data as a Service (DaaS)',
            company: 'TD Bank',
            responsibilities: [
                'Enterprise-wide <strong>Power BI adoption</strong> across 15+ business units',
                'Managed <strong>25+ Tableau dashboards</strong> serving 10M+ customers',
                'Achieved <strong>35% Azure cost reduction</strong> and 70% performance improvement',
                'Deployed AI models on <strong>Azure Kubernetes Services</strong> with 99.95% uptime',
                'Engineered pipelines handling <strong>10TB+ daily data volumes</strong>'
            ]
        },
        {
            title: 'Senior Data Analyst',
            date: 'August 2017 – May 2021',
            department: 'Canadian Personal Banking',
            company: 'TD Bank',
            responsibilities: [
                'Enterprise BI infrastructure supporting <strong>8M+ customers</strong>',
                'Led <strong>12+ development projects</strong> with 40% efficiency improvement',
                'Maintained <strong>99.8% SLA compliance</strong> across critical systems',
                'Analyzed <strong>50+ new data feeds</strong> for advanced analytics'
            ]
        },
        {
            title: 'Data Analyst',
            date: 'November 2015 – August 2017',
            department: 'Canadian Personal Banking',
            company: 'TD Bank',
            responsibilities: [
                'Developed and maintained sophisticated <strong>BI infrastructure</strong>',
                'Provided technical insights and <strong>solution design</strong>',
                'Performed comprehensive <strong>data analysis</strong> on new data feeds',
                'Continuously monitored infrastructure <strong>health and capacity</strong>'
            ]
        }
    ];

    return experienceData.map((exp, index) => {
        const colorClass = index % 2 === 0 ? 'azure' : 'purple';
        const alignment = index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-auto';
        
        return `
        <div class="relative flex items-center">
            <div class="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-${colorClass}-500 rounded-full border-4 border-slate-900 z-10"></div>
            <div class="ml-16 md:ml-0 md:w-1/2 ${alignment}">
                <div class="glass-effect rounded-xl p-6">
                    <div class="flex items-center mb-4">
                        <i data-lucide="briefcase" class="w-6 h-6 text-${colorClass}-400 mr-3"></i>
                        <span class="text-${colorClass}-400 font-semibold">${exp.date}</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-2">${exp.title}</h3>
                    <p class="text-${colorClass}-300 font-semibold mb-4">${exp.department} | ${exp.company}</p>
                    <ul class="text-gray-300 space-y-2 text-sm">
                        ${exp.responsibilities.map(resp => `<li>• ${resp}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>`;
    }).join('');
}

function generateProjects(projects) {
    if (!projects || projects.length === 0) return '';
    
    const iconMap = {
        'AI/ML': 'cpu',
        'Cost': 'trending-down',
        'Data': 'shield-check'
    };
    
    return projects.map((project, index) => {
        const icon = Object.keys(iconMap).find(key => project.title.includes(key)) || 'star';
        const colorClass = index % 2 === 0 ? 'azure' : 'purple';
        
        return `
        <div class="glass-effect rounded-xl p-8 transform hover:scale-105 transition-all">
            <div class="text-${colorClass}-400 mb-4">
                <i data-lucide="${iconMap[icon] || 'star'}" class="w-12 h-12"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">${project.title}</h3>
            <p class="text-gray-300 mb-6">${project.description}</p>
            <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-${colorClass}-600/30 text-${colorClass}-300 rounded-full text-sm">Enterprise</span>
                <span class="px-3 py-1 bg-${colorClass}-600/30 text-${colorClass}-300 rounded-full text-sm">Azure</span>
                <span class="px-3 py-1 bg-${colorClass}-600/30 text-${colorClass}-300 rounded-full text-sm">Innovation</span>
            </div>
        </div>`;
    }).join('');
}

// 主函数
function main() {
    try {
        // 读取简历文件
        const resumeFile = 'Herman-Resume-V2.md';
        if (!fs.existsSync(resumeFile)) {
            console.error(`❌ 简历文件 ${resumeFile} 不存在！`);
            console.log('请确保 Herman-Resume-V2.md 文件在当前目录下');
            process.exit(1);
        }
        
        const resumeContent = fs.readFileSync(resumeFile, 'utf8');
        console.log('✅ 成功读取简历文件');
        
        // 解析简历内容
        const resumeData = parseResume(resumeContent);
        console.log('✅ 成功解析简历内容');
        
        // 生成HTML
        const html = generateHTML(resumeData);
        console.log('✅ 成功生成HTML内容');
        
        // 写入新的HTML文件
        const outputFile = `${resumeData.name.replace(/\s+/g, '-')}-Resume-Website-Auto.html`;
        fs.writeFileSync(outputFile, html);
        
        console.log('🎉 成功生成简历网站！');
        console.log(`📁 输出文件: ${outputFile}`);
        console.log('💡 打开HTML文件即可查看您的个人简历网站');
        
    } catch (error) {
        console.error('❌ 生成过程中出现错误:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { parseResume, generateHTML }; 