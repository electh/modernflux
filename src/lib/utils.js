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