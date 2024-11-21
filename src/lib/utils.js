import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractFirstImage(article) {
  if (!article.content) return null;

  // 检查附件中的图片
  if (article.enclosures?.length > 0) {
    const imgEnclosure = article.enclosures.find((enclosure) =>
      enclosure.mime_type?.startsWith("image/"),
    );
    if (imgEnclosure?.url) {
      return imgEnclosure.url;
    }
  }

  // 如果附件中没有图片，则从内容中查找
  const div = document.createElement("div");
  div.innerHTML = article.content;

  const img = div.querySelector("img");
  return img ? img.src : null;
}

export function getReferrerPolicy(url) {
  const rules = [
    {
      pattern: /^https:\/\/static\.cnbetacdn\.com/,
    },
    {
      pattern: /^https:\/\/img1\.mydrivers\.com/,
    },
  ];

  const matchedRule = rules.find((rule) => rule.pattern.test(url));
  return matchedRule ? "no-referrer" : "origin-when-cross-origin";
}
