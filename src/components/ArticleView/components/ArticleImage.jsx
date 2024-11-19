import { PhotoView } from "react-photo-view";
import { useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn, getReferrerPolicy } from "@/lib/utils";

export default function ArticleImage({ imgNode }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  const { src, alt = "" } = imgNode.attribs;

  const handleImageClick = (e) => {
    e.preventDefault();

    if (imgRef.current) {
      const imgRect = imgRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (imgRect.top < 65 || imgRect.bottom > viewportHeight) {
        const scrollContainer = imgRef.current.closest(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollContainer) {
          const scrollTop = scrollContainer.scrollTop + imgRect.top - 75;

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
      <div className="w-full h-full min-h-[200px] bg-muted flex items-center justify-center relative z-0">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageOff className="size-5" />
          <span className="text-sm">图片加载失败</span>
        </div>
      </div>
    );
  }

  return (
    <PhotoView key={src} src={src}>
      <div className="relative z-0">
        {isLoading && (
          <div className="absolute inset-0 bg-muted min-h-[200px]" />
        )}
        <img
          ref={imgRef}
          className={cn(
            "max-w-full h-auto object-cover mx-auto transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
          )}
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy={getReferrerPolicy(src)}
          onError={() => setError(true)}
          onClick={handleImageClick}
          onLoad={() => {
            setIsLoading(false);
          }}
        />
      </div>
    </PhotoView>
  );
}
