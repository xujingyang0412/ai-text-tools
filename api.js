// AI Text Tools Backend API
// Connects to free AI APIs for text processing

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiting for free tier
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10, // limit each IP to 10 requests per day
    message: { error: 'Free tier limit reached. Please upgrade to Pro.' }
});

// AI Provider configs (free/cheap options)
const AI_PROVIDERS = {
    mimo: {
        name: 'MIMO V2.5',
        endpoint: 'https://api.xiaomi.com/v1/chat/completions',
        model: 'mimo-v2.5',
        cost: 0
    },
    doubao: {
        name: 'Doubao Seed 2.0',
        endpoint: 'https://api.volcengine.com/v1/chat/completions',
        model: 'doubao-seed-2-0-pro-260215',
        cost: 0.8
    }
};

// Prompt templates for each tool
const PROMPTS = {
    paraphrase: (text, option) => {
        const styles = {
            professional: '专业正式的商务风格',
            academic: '严谨的学术风格',
            creative: '富有创意的文学风格',
            simplified: '简洁明了的通俗风格'
        };
        return `你是一位专业的文字改写专家。请将以下文字改写为${styles[option] || styles.professional}，保持原意但使用不同的表达方式，使文字更加流畅自然。只输出改写后的文字，不要添加任何解释。

原文：
${text}`;
    },
    
    grammar: (text) => {
        return `你是一位专业的语法检查专家。请仔细检查以下文字的语法错误、错别字、标点符号问题，并直接输出修正后的完整文字。只输出修正后的文字，不要添加任何解释或说明。

原文：
${text}`;
    },
    
    summarize: (text, option) => {
        const styles = {
            brief: '用2-3句话简要概括',
            detailed: '用300字左右详细总结',
            bullet: '用要点列表形式总结，每个要点一行'
        };
        return `你是一位专业的文章摘要专家。请${styles[option] || styles.brief}以下文章的核心内容。只输出摘要内容，不要添加任何解释。

文章：
${text}`;
    },
    
    tone: (text, option) => {
        const tones = {
            professional: '专业正式',
            casual: '轻松随意',
            humorous: '幽默风趣',
            persuasive: '有说服力',
            empathetic: '温暖共情'
        };
        return `你是一位专业的语气调整专家。请将以下文字调整为${tones[option] || tones.professional}的语气风格，保持核心意思不变。只输出调整后的文字，不要添加任何解释。

原文：
${text}`;
    },
    
    expand: (text, option) => {
        const styles = {
            moderate: '扩展到原来的2倍长度',
            detailed: '扩展到原来的3倍长度，增加更多细节和例证',
            creative: '在保持核心意思的基础上，加入创意性的扩展和丰富的想象'
        };
        return `你是一位专业的内容扩展专家。请${styles[option] || styles.moderate}以下文字。扩展后的内容应该自然流畅，与原文风格一致。只输出扩展后的文字，不要添加任何解释。

原文：
${text}`;
    },
    
    compress: (text, option) => {
        const styles = {
            moderate: '精简到原来的一半长度',
            aggressive: '精简到原来的三分之一长度',
            core: '仅保留最核心的信息，尽可能精简'
        };
        return `你是一位专业的内容精简专家。请${styles[option] || styles.moderate}以下文字，同时保留所有重要信息。只输出精简后的文字，不要添加任何解释。

原文：
${text}`;
    }
};

// Free AI API call (using MIMO V2.5 - completely free)
async function callFreeAI(prompt) {
    // Option 1: Use a free API endpoint
    // For demo, we'll simulate. In production, connect to actual free APIs
    
    // Option 2: Use your own backend with free models
    // const response = await fetch('YOUR_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         model: 'mimo-v2.5',
    //         messages: [{ role: 'user', content: prompt }],
    //         max_tokens: 2000
    //     })
    // });
    
    // For now, return a demo response
    return `[AI处理结果]\n\n这是处理后的文字。在实际部署中，这里会连接到免费的AI模型（如MIMO V2.5）进行真实的文字处理。\n\n处理提示词：${prompt.substring(0, 100)}...`;
}

// API endpoint for text processing
app.post('/api/process', limiter, async (req, res) => {
    try {
        const { tool, text, option } = req.body;
        
        if (!tool || !text) {
            return res.status(400).json({ error: 'Missing required fields: tool, text' });
        }
        
        if (!PROMPTS[tool]) {
            return res.status(400).json({ error: 'Invalid tool' });
        }
        
        const prompt = PROMPTS[tool](text, option);
        const result = await callFreeAI(prompt);
        
        res.json({ 
            success: true, 
            result,
            tool,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ error: 'Processing failed' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AI Text Tools API running on port ${PORT}`);
});
