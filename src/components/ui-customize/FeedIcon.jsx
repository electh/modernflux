import { useMemo, useState } from "react";
import { Rss } from "lucide-react";
import { settingsState } from "@/stores/settingsStore";
import { useStore } from "@nanostores/react";
import { cn } from "@/lib/utils";

const FeedIcon = ({ url }) => {
  const { feedIconShape, useGrayIcon } = useStore(settingsState);
  const [error, setError] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);

  const getDomain = useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }, [url]);

  const faviconUrl = useMemo(() => {
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${getDomain}`;
  }, [getDomain]);

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
      <span
        className={cn(
          "flex items-center justify-center w-5 h-5 p-0.5 bg-white rounded-sm transition-opacity duration-300 ease-in-out animate-in fade-in-0 shadow-custom",
          feedIconShape === "circle" ? "rounded-full" : "rounded-sm",
        )}
      >
        <Rss strokeWidth={3} className="size-3 text-muted-foreground" />
      </span>
    );
  }

  return (
    <img
      alt="Feed icon"
      src={faviconUrl}
      className={cn(
        "w-5 h-5 rounded-sm bg-white p-0.5 transition-opacity duration-300 ease-in-out opacity-0 animate-in fade-in-0 shadow-custom",
        feedIconShape === "circle" ? "rounded-full" : "rounded-sm",
        useGrayIcon ? "grayscale" : "",
      )}
      onError={handleError}
      onLoad={(e) => {
        handleLoad(e);
        e.target.classList.remove("opacity-0");
        e.target.classList.add("opacity-100");
      }}
    />
  );
};

export default FeedIcon;
