#!/usr/bin/env node
/**
 * 清理 mockData.js 中所有美团内部/CDN数据
 * - p0/p1.meituan.net CDN 图片 → 本地 /images/ 路径
 * - dianpingaz CDN 头像 → 空字符串（使用默认头像）
 * - meituan.com/meishi 内部商家链接 → 移除
 * - dianping.com/shop 链接 → 保留（公开可访问）
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/mockData.js');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. 替换 meituan.net CDN 图片为本地图片（按hash前缀映射）
const cdnImageMap = {
  'b703f5b2': '/images/hotpot/haidilao_real_1.jpg',
  '82745d74': '/images/hotpot/haidilao_real_2.jpg',
  '94dd7e4f': '/images/hotpot/haidilao_real_3.jpg',
  'de036dab': '/images/hotpot/chaoshan_real_1.jpg',
  'c7774c78': '/images/hotpot/chaoshan_real_2.jpg',
  '5b076f99': '/images/hotpot/chaoshan_real_3.jpg',
  '0caab043': '/images/hotpot/hotpot_meat.jpg',
  '9b9bbdba': '/images/hotpot/hotpot_broth.jpg',
  '91c521c4': '/images/sichuan/sichuan_1.jpg',
  '5c14281f': '/images/sichuan/sichuan_2.jpg',
};

for (const [hash, localPath] of Object.entries(cdnImageMap)) {
  const pattern = new RegExp(`https?://p[0-9]\\.meituan\\.net/[^'"]*${hash}[^'"]*`, 'g');
  content = content.replace(pattern, localPath);
}

// 2. 替换剩余所有 meituan.net CDN 图片（按类目分配本地图片）
const fallbackImages = [
  '/images/hotpot/hotpot_broth.jpg',
  '/images/food/food_1.jpg',
  '/images/sichuan/sichuan_1.jpg',
  '/images/bbq/bbq_1.jpg',
  '/images/cantonese/cantonese_1.jpg',
];
let fallbackIdx = 0;
content = content.replace(/https?:\/\/p[0-9]\.meituan\.net\/[^'"]+/g, () => {
  const img = fallbackImages[fallbackIdx % fallbackImages.length];
  fallbackIdx++;
  return img;
});

// 3. 替换 dianpingaz CDN 头像 → 空字符串
content = content.replace(/https?:\/\/p[01]\.dianpingaz\.com\/member\/[^'"]+/g, '');

// 4. 移除 sameAs 数组中的 meituan.com/meishi 内部链接（保留 dianping.com 和 wikidata）
content = content.replace(/'https:\/\/www\.meituan\.com\/meishi\/[^']+',?\s*/g, '');
content = content.replace(/"https:\/\/www\.meituan\.com\/meishi\/[^"]+",?\s*/g, '');

// 5. 移除 dianpingUrl 字段（整行）
content = content.replace(/^\s*dianpingUrl:\s*'[^']*',?\s*\n/gm, '');

console.log('✅ Internal data cleaned from mockData.js');
fs.writeFileSync(filePath, content);
