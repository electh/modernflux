import { PhotoView } from "react-photo-view";
import { useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { getReferrerPolicy } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ArticleImage({ imgNode }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  const { src, alt = "" } = imgNode.attribs;

  const handleImageClick = (e) => {
    e.preventDefault();

    // 确保图片元素存在
    if (imgRef.current) {
      // 获取图片元素的位置信息
      const imgRect = imgRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // 如果图片不在视口内或者顶部被遮挡
      if (imgRect.top < 65 || imgRect.bottom > viewportHeight) {
        // 找到最近的可滚动容器
        const scrollContainer = imgRef.current.closest(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollContainer) {
          // 计算需要滚动的距离，考虑顶部工具栏的高度
          const scrollTop = scrollContainer.scrollTop + imgRect.top - 75;

          // 平滑滚动到目标位置
          scrollContainer.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        }
      }
    }
  };

  if (error) {
    return (
      <div className="w-full h-full min-h-[200px] bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageOff className="size-5" />
          <span className="text-sm">图片加载失败</span>
        </div>
      </div>
    );
  }

  return (
    <div
        className={cn(
          "w-fit h-fit flex items-center justify-center m-0",
          isLoading && "bg-muted",
        )}
      >
    <PhotoView key={src} src={src}>
      
        <img
          ref={imgRef}
        className="max-w-full h-auto object-cover bg-transparent transition-opacity duration-300 ease-in-out opacity-0 animate-in fade-in-0 mx-auto my-0"
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy={getReferrerPolicy(src)}
        onError={() => setError(true)}
        onClick={handleImageClick}
          onLoad={(e) => {
            setIsLoading(false);
            e.target.classList.remove("opacity-0");
            e.target.classList.add("opacity-100");
          }}
        />
      
    </PhotoView></div>
  );
}
