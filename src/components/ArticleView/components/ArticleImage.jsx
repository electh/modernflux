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
      
      const scrollContainer = imgRef.current.closest(
        "[data-radix-scroll-area-viewport]"
      );
      
      if (scrollContainer) {
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
          const actionButtonsRect = actionButtons.getBoundingClientRect();
          const actionButtonsHeight = actionButtonsRect.bottom;
          
          if (imgRect.top < actionButtonsHeight || imgRect.bottom > viewportHeight) {
            const scrollTop = scrollContainer.scrollTop + imgRect.top - (actionButtonsHeight + 10);
            
            scrollContainer.scrollTo({
              top: scrollTop,
              behavior: "smooth",
            });
          }
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
    <span
      className={cn(
        "w-fit h-fit flex items-center justify-center my-0 mx-auto",
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
      </PhotoView>
    </span>
  );
}
