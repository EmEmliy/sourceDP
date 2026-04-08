import { headers } from "next/headers";
import type { Metadata } from "next";
import "./globals.css";

const SUPABASE_URL = 'https://kcckvvurgbmyvkzknelv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjY2t2dnVyZ2JteXZremtuZWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjM3MzcsImV4cCI6MjA5MDY5OTczN30.DpJa2UA-MhdrKWmyWT5Mpk5oRKYST2BA9EiaiTYwADA';
const SITE_NAME = 'source-dp';

const AI_CRAWLERS = [
  // ===== 国外 AI 大模型爬虫 =====
  { pattern: /GPTBot/i,              name: 'GPTBot',              company: 'OpenAI',          region: 'US' },
  { pattern: /ChatGPT-User/i,        name: 'ChatGPT-User',        company: 'OpenAI',          region: 'US' },
  { pattern: /OAI-SearchBot/i,       name: 'OAI-SearchBot',       company: 'OpenAI',          region: 'US' },
  { pattern: /ClaudeBot/i,           name: 'ClaudeBot',           company: 'Anthropic',       region: 'US' },
  { pattern: /Claude-Web/i,          name: 'Claude-Web',          company: 'Anthropic',       region: 'US' },
  { pattern: /PerplexityBot/i,       name: 'PerplexityBot',       company: 'Perplexity',      region: 'US' },
  { pattern: /cohere-ai/i,           name: 'Cohere-AI',           company: 'Cohere',          region: 'CA' },
  { pattern: /YouBot/i,              name: 'YouBot',              company: 'You.com',         region: 'US' },
  { pattern: /Amazonbot/i,           name: 'Amazonbot',           company: 'Amazon',          region: 'US' },
  { pattern: /CCBot/i,               name: 'CCBot',               company: 'Common Crawl',    region: 'US' },
  // ===== 国外搜索引擎（也被 AI 引用） =====
  { pattern: /Google-Extended/i,     name: 'Google-Extended',     company: 'Google',          region: 'US' },
  { pattern: /Googlebot/i,           name: 'Googlebot',           company: 'Google',          region: 'US' },
  { pattern: /GoogleOther/i,         name: 'GoogleOther',         company: 'Google',          region: 'US' },
  { pattern: /Bingbot/i,             name: 'Bingbot',             company: 'Microsoft',       region: 'US' },
  { pattern: /Applebot-Extended/i,   name: 'Applebot-Extended',   company: 'Apple',           region: 'US' },
  { pattern: /Applebot/i,            name: 'Applebot',            company: 'Apple',           region: 'US' },
  { pattern: /meta-externalagent/i,  name: 'Meta-ExternalAgent',  company: 'Meta',            region: 'US' },
  { pattern: /FacebookBot/i,         name: 'FacebookBot',         company: 'Meta',            region: 'US' },
  // ===== 国内 AI 大模型爬虫 =====
  { pattern: /Bytespider/i,          name: 'Bytespider',          company: '字节跳动(豆包)',   region: 'CN' },
  { pattern: /DeepSeekBot/i,         name: 'DeepSeekBot',         company: 'DeepSeek',        region: 'CN' },
  { pattern: /ChatGLM-Spider/i,      name: 'ChatGLM-Spider',      company: '智谱AI(GLM)',      region: 'CN' },
  { pattern: /Baiduspider/i,         name: 'Baiduspider',         company: '百度(文心)',       region: 'CN' },
  { pattern: /SogouSpider/i,         name: 'SogouSpider',         company: '搜狗(元宝)',       region: 'CN' },
  { pattern: /360Spider/i,           name: '360Spider',           company: '360(元宝)',        region: 'CN' },
  { pattern: /QwenBot/i,             name: 'QwenBot',             company: '阿里(通义千问)',   region: 'CN' },
  { pattern: /Yisouspider/i,         name: 'Yisouspider',         company: '360搜索',          region: 'CN' },
  { pattern: /MojeekBot/i,           name: 'MojeekBot',           company: 'Mojeek',          region: 'EU' },
];

export const metadata: Metadata = {
  title: "source.dianping.com | 上海口碑评分 · 全国美团优惠 · 点评 Source 数据平台",
  description: "source.dianping.com 是点评 Source口碑评分结构化呈现平台，聚合上海火锅、北京酒店等80+家真实用户口碑评分与全国通用美团外卖、电影票优惠。",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  // 服务端 AI 爬虫追踪 - 在 EdgeOne Cloud Functions 执行，能捕获真实爬虫
  const headersList = await headers();
  const ua = headersList.get('user-agent') || '';
  const requestPath = headersList.get('x-invoke-path') || headersList.get('x-matched-path') || '/';
  const matched = AI_CRAWLERS.find(c => c.pattern.test(ua));
  if (matched) {
    fetch(`${SUPABASE_URL}/rest/v1/crawler_visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        site: SITE_NAME,
        crawler_name: matched.name,
        crawler_company: matched.company,
        region: matched.region,
        user_agent: ua.substring(0, 500),
        request_path: requestPath,
        ip_address: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '',
        visited_at: new Date().toISOString(),
      }),
    }).catch(() => {});
  }

  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
