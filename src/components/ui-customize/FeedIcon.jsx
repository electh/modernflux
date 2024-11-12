import { useState } from "react";
import { Rss } from "lucide-react";

const FeedIcon = ({ url }) => {
  const [error, setError] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);

  // 从URL中提取域名
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  // 生成Google Favicon API的URL
  const getFaviconUrl = (url) => {
    const domain = getDomain(url);
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
  };

  // 处理图片加载错误
  const handleError = () => {
    setError(true);
  };

  // 检查图片质量
  const handleLoad = (e) => {
    const img = e.target;
    // 如果图片实际尺寸小于预期尺寸(32x32)，认为图片质量不佳
    if (img.naturalWidth < 32 || img.naturalHeight < 32) {
      setIsBlurry(true);
    }
  };

  // 如果URL无效、图片加载失败或图片模糊，显示默认图标
  if (!url || error || isBlurry) {
    return (
      <span className="flex items-center justify-center w-5 h-5 bg-background rounded">
        <Rss className="size-4 text-muted-foreground" />
      </span>
    );
  }

  return (
    <img
      alt="Feed icon"
      src={getFaviconUrl(url)}
      className="w-5 h-5 rounded"
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

export default FeedIcon;
