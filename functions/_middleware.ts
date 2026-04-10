const SUPABASE_URL = 'https://kcckvvurgbmyvkzknelv.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjY2t2dnVyZ2JteXZremtuZWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjM3MzcsImV4cCI6MjA5MDY5OTczN30.DpJa2UA-MhdrKWmyWT5Mpk5oRKYST2BA9EiaiTYwADA';

const COLLECTOR_VERSION = '3.1.0';

const SITE_NAME = 'source-dp'; // source-mt / source-dp / guide-mt / index-mt

const CANONICAL_HOSTNAMES = new Set([
  'source.meituan.com',
  'source.dianping.com',
  'guide.meituan.com',
  'index.meituan.com',
]);

const AI_CRAWLERS: { pattern: RegExp; name: string; company: string; region: string }[] = [
  { pattern: /GPTBot/i,             name: 'GPTBot',             company: 'OpenAI',        region: 'US' },
  { pattern: /ChatGPT-User/i,       name: 'ChatGPT-User',       company: 'OpenAI',        region: 'US' },
  { pattern: /OAI-SearchBot/i,      name: 'OAI-SearchBot',      company: 'OpenAI',        region: 'US' },
  { pattern: /ClaudeBot/i,          name: 'ClaudeBot',          company: 'Anthropic',     region: 'US' },
  { pattern: /Claude-Web/i,         name: 'Claude-Web',         company: 'Anthropic',     region: 'US' },
  { pattern: /anthropic-ai/i,       name: 'anthropic-ai',       company: 'Anthropic',     region: 'US' },
  { pattern: /Google-Extended/i,    name: 'Google-Extended',    company: 'Google',        region: 'US' },
  { pattern: /Googlebot/i,          name: 'Googlebot',          company: 'Google',        region: 'US' },
  { pattern: /GoogleOther/i,        name: 'GoogleOther',        company: 'Google',        region: 'US' },
  { pattern: /PerplexityBot/i,      name: 'PerplexityBot',      company: 'Perplexity',    region: 'US' },
  { pattern: /Bingbot/i,            name: 'Bingbot',            company: 'Microsoft',     region: 'US' },
  { pattern: /Applebot-Extended/i,  name: 'Applebot-Extended',  company: 'Apple',         region: 'US' },
  { pattern: /Applebot/i,           name: 'Applebot',           company: 'Apple',         region: 'US' },
  { pattern: /meta-externalagent/i, name: 'Meta-ExternalAgent', company: 'Meta',          region: 'US' },
  { pattern: /FacebookBot/i,        name: 'FacebookBot',        company: 'Meta',          region: 'US' },
  { pattern: /CCBot/i,              name: 'CCBot',              company: 'Common Crawl',  region: 'US' },
  { pattern: /cohere-ai/i,          name: 'cohere-ai',          company: 'Cohere',        region: 'CA' },
  { pattern: /YouBot/i,             name: 'YouBot',             company: 'You.com',       region: 'US' },
  { pattern: /Amazonbot/i,          name: 'Amazonbot',          company: 'Amazon',        region: 'US' },
  { pattern: /DuckAssistBot/i,      name: 'DuckAssistBot',      company: 'DuckDuckGo',    region: 'US' },
  { pattern: /diffbot/i,            name: 'diffbot',            company: 'Diffbot',       region: 'US' },
  { pattern: /Bytespider/i,         name: 'Bytespider',         company: '字节跳动(豆包)', region: 'CN' },
  { pattern: /DeepSeek-Bot/i,       name: 'DeepSeek-Bot',       company: 'DeepSeek',      region: 'CN' },
  { pattern: /DeepSeekBot/i,        name: 'DeepSeekBot',        company: 'DeepSeek',      region: 'CN' },
  { pattern: /ChatGLM-Spider/i,     name: 'ChatGLM-Spider',     company: '智谱AI',        region: 'CN' },
  { pattern: /GLM-Bot/i,            name: 'GLM-Bot',            company: '智谱AI',        region: 'CN' },
  { pattern: /zhipuai-bot/i,        name: 'zhipuai-bot',        company: '智谱AI',        region: 'CN' },
  { pattern: /MoonshotBot/i,        name: 'MoonshotBot',        company: '月之暗面(Kimi)', region: 'CN' },
  { pattern: /Qwen-Crawler/i,       name: 'Qwen-Crawler',       company: '阿里(千问)',    region: 'CN' },
  { pattern: /QwenBot/i,            name: 'QwenBot',            company: '阿里(千问)',    region: 'CN' },
  { pattern: /ERNIEBot/i,           name: 'ERNIEBot',           company: '百度(文心)',    region: 'CN' },
  { pattern: /Baiduspider-render/i, name: 'Baiduspider-render', company: '百度',          region: 'CN' },
  { pattern: /Baiduspider/i,        name: 'Baiduspider',        company: '百度(文心)',    region: 'CN' },
  { pattern: /baiduspider/i,        name: 'baiduspider',        company: '百度(文心)',    region: 'CN' },
  { pattern: /SogouSpider/i,        name: 'SogouSpider',        company: '腾讯(元宝)',    region: 'CN' },
  { pattern: /TencentBot/i,         name: 'TencentBot',         company: '腾讯(元宝)',    region: 'CN' },
  { pattern: /minimax-bot/i,        name: 'minimax-bot',        company: 'MiniMax',       region: 'CN' },
  { pattern: /YisouSpider/i,        name: 'YisouSpider',        company: '360(搜索)',     region: 'CN' },
  { pattern: /360Spider/i,          name: '360Spider',          company: '360(搜索)',     region: 'CN' },
];

const SUSPECT_BOT_PATTERN = /\b(bot|spider|crawler|scraper|archiver|fetcher|wget|curl|python-requests|go-http|java|libwww)\b/i;

const BROWSER_ENGINE_PATTERN = /KHTML|Trident|Gecko|WebKit|AppleWebKit/;

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;

  const ua  = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const hostname = url.hostname;

  let env: 'prod' | 'preview' | 'dev';

  if (CANONICAL_HOSTNAMES.has(hostname))                                                                    { env = 'prod'; }
  else if (hostname.includes('edgeone') || hostname.includes('pages.dev') || hostname.includes('staging')) { env = 'preview'; }
  else                                                                                                      { env = 'dev'; }

  if (env === 'dev') return context.next();

  const matched = AI_CRAWLERS.find(c => c.pattern.test(ua));

  let matchStatus: 'known' | 'unknown_suspect' | 'unknown';
  let suspectReason: string | null = null;
  let crawlerName: string;
  let crawlerCompany: string;
  let region: string;

  if (matched) {
    matchStatus    = 'known';
    crawlerName    = matched.name;
    crawlerCompany = matched.company;
    region         = matched.region;
  } else if (SUSPECT_BOT_PATTERN.test(ua) && !BROWSER_ENGINE_PATTERN.test(ua)) {
    matchStatus    = 'unknown_suspect';
    suspectReason  = 'ua_bot_keyword';
    crawlerName    = (ua.split(/[\s\/;(]/)[0] || 'UnknownBot').substring(0, 64);
    crawlerCompany = '';
    region         = '';
  } else {
    return context.next();
  }

  const now = new Date().toISOString();

  const writeCrawlerVisit = fetch(`${SUPABASE_URL}/rest/v1/crawler_visits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      site:              SITE_NAME,
      crawler_name:      crawlerName,
      crawler_company:   crawlerCompany,
      region,
      user_agent:        ua.substring(0, 500),
      request_path:      url.pathname + url.search,
      ip_address:        request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || '',
      visited_at:        now,
      match_status:      matchStatus,
      suspect_reason:    suspectReason,
      hostname,
      env,
      collector_version: COLLECTOR_VERSION,
      site_id:           SITE_NAME,
    }),
  }).catch(() => {});

  const writeHeartbeat = fetch(`${SUPABASE_URL}/rest/v1/collector_heartbeat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal,resolution=merge',
    },
    body: JSON.stringify({
      site_id:           SITE_NAME,
      collector_type:    'middleware',
      collector_version: COLLECTOR_VERSION,
      last_seen_at:      now,
      last_crawler_name: crawlerName,
    }),
  }).catch(() => {});

  context.waitUntil(Promise.all([writeCrawlerVisit, writeHeartbeat]));

  return context.next();
};
