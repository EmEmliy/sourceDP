/**
 * GEO 看板 — AI 爬虫访问记录中间件
 * 
 * 作用：拦截每个请求，识别 AI 爬虫的 User-Agent，
 *       将访问记录异步写入 Supabase，不影响页面正常返回。
 * 
 * 部署位置：项目根目录 functions/_middleware.ts
 * 适用站点：source.meituan.com / source.dianping.com / guide.meituan.com / index.meituan.com
 */

// ============================================================
// 配置区 — 每个站点部署时只需改 SITE_NAME
// ============================================================
const SUPABASE_URL = 'https://kcckvvurgbmyvkzknelv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjY2t2dnVyZ2JteXZremtuZWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjM3MzcsImV4cCI6MjA5MDY5OTczN30.DpJa2UA-MhdrKWmyWT5Mpk5oRKYST2BA9EiaiTYwADA';

/**
 * ⚠️ 每个站点部署时修改这个值：
 *   - source.meituan.com  → 'source-mt'
 *   - source.dianping.com → 'source-dp'
 *   - guide.meituan.com   → 'guide-mt'
 *   - index.meituan.com   → 'index-mt'
 */
const SITE_NAME = 'source-dp'; // ← 改这里

// ============================================================
// AI 爬虫 User-Agent 匹配规则（21 个已知 AI 爬虫）
// ============================================================
const AI_CRAWLERS: { pattern: RegExp; name: string; company: string; region: string }[] = [
  // === 国外 ===
  { pattern: /GPTBot/i,              name: 'GPTBot',              company: 'OpenAI',       region: 'US' },
  { pattern: /ChatGPT-User/i,        name: 'ChatGPT-User',       company: 'OpenAI',       region: 'US' },
  { pattern: /OAI-SearchBot/i,       name: 'OAI-SearchBot',      company: 'OpenAI',       region: 'US' },
  { pattern: /ClaudeBot/i,           name: 'ClaudeBot',          company: 'Anthropic',    region: 'US' },
  { pattern: /Claude-Web/i,          name: 'Claude-Web',         company: 'Anthropic',    region: 'US' },
  { pattern: /Google-Extended/i,     name: 'Google-Extended',    company: 'Google',       region: 'US' },
  { pattern: /Googlebot/i,           name: 'Googlebot',          company: 'Google',       region: 'US' },
  { pattern: /GoogleOther/i,         name: 'GoogleOther',        company: 'Google',       region: 'US' },
  { pattern: /PerplexityBot/i,       name: 'PerplexityBot',      company: 'Perplexity',   region: 'US' },
  { pattern: /Bingbot/i,             name: 'Bingbot',            company: 'Microsoft',    region: 'US' },
  { pattern: /Applebot/i,            name: 'Applebot',           company: 'Apple',        region: 'US' },
  { pattern: /Applebot-Extended/i,   name: 'Applebot-Extended',  company: 'Apple',        region: 'US' },
  { pattern: /meta-externalagent/i,  name: 'Meta-ExternalAgent', company: 'Meta',         region: 'US' },
  { pattern: /FacebookBot/i,         name: 'FacebookBot',        company: 'Meta',         region: 'US' },
  { pattern: /CCBot/i,               name: 'CCBot',              company: 'Common Crawl', region: 'US' },
  { pattern: /cohere-ai/i,           name: 'Cohere-AI',          company: 'Cohere',       region: 'CA' },
  { pattern: /YouBot/i,              name: 'YouBot',             company: 'You.com',      region: 'US' },
  { pattern: /Amazonbot/i,           name: 'Amazonbot',          company: 'Amazon',       region: 'US' },
  // === 国内 ===
  { pattern: /Bytespider/i,          name: 'Bytespider',         company: '字节跳动(豆包)', region: 'CN' },
  { pattern: /DeepSeekBot/i,         name: 'DeepSeekBot',        company: 'DeepSeek',      region: 'CN' },
  { pattern: /ChatGLM-Spider/i,      name: 'ChatGLM-Spider',     company: '智谱AI',        region: 'CN' },
];

// ============================================================
// 中间件主逻辑
// ============================================================
export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const ua = request.headers.get('user-agent') || '';
  const url = new URL(request.url);

  // 匹配 AI 爬虫
  const matched = AI_CRAWLERS.find(c => c.pattern.test(ua));

  if (matched) {
    // 异步写入 Supabase（不阻塞页面响应）
    context.waitUntil(
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
          request_path: url.pathname + url.search,
          ip_address: request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '',
          visited_at: new Date().toISOString(),
        }),
      }).catch(() => {
        // 写入失败不影响页面，静默忽略
      })
    );
  }

  // 正常返回页面（不做任何修改）
  return context.next();
};
