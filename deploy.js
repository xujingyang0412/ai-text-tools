#!/usr/bin/env node

// Deployment script for AI Text Tools
// Supports: Vercel, Netlify, Railway, Render, GitHub Pages

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI Text Tools Deployment Script');
console.log('================================\n');

// Check if git is initialized
if (!fs.existsSync('.git')) {
    console.log('📁 Initializing git repository...');
    execSync('git init');
    execSync('git add .');
    execSync('git commit -m "Initial commit: AI Text Tools"');
    console.log('✅ Git repository initialized\n');
}

// Create deployment configs
console.log('📝 Creating deployment configurations...\n');

// Vercel config
const vercelConfig = {
    version: 2,
    builds: [
        {
            src: 'api.js',
            use: '@vercel/node'
        },
        {
            src: 'index.html',
            use: '@vercel/static'
        }
    ],
    routes: [
        { src: '/api/(.*)', dest: '/api.js' },
        { src: '/(.*)', dest: '/index.html' }
    ]
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('✅ Created vercel.json');

// Netlify config
const netlifyConfig = `
[build]
  command = "npm install"
  functions = "functions"
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
`;

fs.writeFileSync('netlify.toml', netlifyConfig);
console.log('✅ Created netlify.toml');

// Railway config
const railwayConfig = {
    build: {
        builder: 'NIXPACKS'
    },
    deploy: {
        startCommand: 'node api.js',
        healthcheckPath: '/api/health',
        healthcheckTimeout: 10
    }
};

fs.writeFileSync('railway.json', JSON.stringify(railwayConfig, null, 2));
console.log('✅ Created railway.json');

// Render config
const renderConfig = `
services:
  - type: web
    name: ai-text-tools
    env: node
    buildCommand: npm install
    startCommand: node api.js
    envVars:
      - key: NODE_ENV
        value: production
`;

fs.writeFileSync('render.yaml', renderConfig);
console.log('✅ Created render.yaml');

// Create README
const readme = `# AI文字工具箱

专业级AI写作助手，提供6大智能文字处理工具。

## 功能

- ✍️ AI智能改写
- 📝 语法检查修复
- 📋 文章智能摘要
- 🎨 语气风格调整
- 📄 内容智能扩展
- ⚡ 内容精简压缩

## 技术栈

- 前端: HTML5 + CSS3 + Vanilla JS
- 后端: Node.js + Express
- AI: MIMO V2.5 (免费) / Doubao Seed 2.0
- 部署: Vercel / Netlify / Railway / Render

## 快速开始

### 本地开发

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
\`\`\`

### 部署

\`\`\`bash
# 运行部署脚本
npm run deploy

# 或手动部署到各平台
\`\`\`

## 部署选项

### Vercel (推荐)
1. 推送到GitHub
2. 在Vercel导入项目
3. 自动部署

### Netlify
1. 推送到GitHub
2. 在Netlify导入项目
3. 自动部署

### Railway
1. 推送到GitHub
2. 在Railway导入项目
3. 自动部署

### Render
1. 推送到GitHub
2. 在Render导入项目
3. 自动部署

## 定价

- 免费版: 每天3次使用
- 专业版: ¥29/月 (无限使用)
- 终身版: ¥199 (永久使用)

## 许可证

MIT License
`;

fs.writeFileSync('README.md', readme);
console.log('✅ Created README.md');

// Create .gitignore
const gitignore = `
node_modules/
.env
.env.local
.vercel/
.netlify/
functions/
*.log
.DS_Store
`;

fs.writeFileSync('.gitignore', gitignore);
console.log('✅ Created .gitignore');

// Create environment template
const envTemplate = `
# AI Text Tools Environment Variables

# AI Provider API Keys (optional for free tier)
MIMO_API_KEY=your_mimo_api_key_here
DOUBAO_API_KEY=your_doubao_api_key_here

# Payment Integration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# LemonSqueezy (alternative)
LEMONSQUEEZY_API_KEY=your_lemonsqueezly_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
`;

fs.writeFileSync('.env.example', envTemplate);
console.log('✅ Created .env.example');

console.log('\n================================');
console.log('✅ All deployment configurations created!');
console.log('\n📋 Next steps:');
console.log('1. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main');
console.log('2. Choose a deployment platform (Vercel recommended)');
console.log('3. Import your GitHub repository');
console.log('4. Deploy!');
console.log('\n🎯 Your AI Text Tools will be live in minutes!');
