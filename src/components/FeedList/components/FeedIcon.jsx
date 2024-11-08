import { useState } from 'react';
import { Image } from '@nextui-org/react';
const FeedIcon = ({ url }) => {
  const [error, setError] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);
  
  // 从URL中提取域名
  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain;
    } catch {
      return '';
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
    // 如果图片实际尺寸小于预期尺寸(64x64)，认为图片质量不佳
    if (img.naturalWidth < 64 || img.naturalHeight < 64) {
      setIsBlurry(true);
    }
  };

  // 如果URL无效、图片加载失败或图片模糊，显示默认图标
  if (!url || error || isBlurry) {
    return (
        <svg 
          className="w-5 h-5 text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" 
          />
        </svg>
    );
  }

  return (
    <Image
      alt="Feed icon"
      src={getFaviconUrl(url)}
      className="w-5 h-5 rounded"
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

export default FeedIcon;
