import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractFirstImage(content) {
  if (!content) return null;
  
  // 创建一个临时的 DOM 元素来解析 HTML 内容
  const div = document.createElement('div');
  div.innerHTML = content;
  
  // 查找第一个图片元素
  const img = div.querySelector('img');
  
  // 如果找到图片，返回其 src 属性
  return img ? img.src : null;
}

export function getReferrerPolicy(url) {
  const rules = [
    {
      pattern: /^https:\/\/\w+\.sinaimg\.cn/,
      referrer: "https://weibo.com"
    },
    {
      pattern: /^https:\/\/i\.pximg\.net/,
      referrer: "https://www.pixiv.net"
    },
    {
      pattern: /^https:\/\/cdnfile\.sspai\.com/,
      referrer: "https://sspai.com"
    },
    {
      pattern: /^https:\/\/(?:\w|-)+\.cdninstagram\.com/,
      referrer: "https://www.instagram.com"
    },
    {
      pattern: /^https:\/\/sp1\.piokok\.com/,
      referrer: "https://sp1.piokok.com"
    }
  ];

  const matchedRule = rules.find(rule => rule.pattern.test(url));
  return {
    referrerPolicy: matchedRule ? `${matchedRule.referrer}` : "no-referrer"
  };
}
