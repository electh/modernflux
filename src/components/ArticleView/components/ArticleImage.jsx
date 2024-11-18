import { PhotoView } from "react-photo-view";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { getReferrerPolicy } from "@/lib/utils";

export default function ArticleImage({ imgNode }) {
  const [error, setError] = useState(false);

  const { src, alt = "" } = imgNode.attribs;

  if (error) {
    return (
      <div className="w-full h-full min-h-[200px] bg-muted rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageOff className="size-5" />
          <span className="text-sm">图片加载失败</span>
      </div>
      </div>
    );
  }

  return (
    <PhotoView key={src} src={src}>
      <img
        className="w-full h-auto aspect-video object-cover bg-muted transition-opacity duration-300 ease-in-out opacity-0 animate-in fade-in-0"
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy={getReferrerPolicy(src)}
        onError={() => setError(true)}
        onLoad={(e) => {
          e.target.classList.remove("opacity-0");
          e.target.classList.add("opacity-100");
        }}
      />
    </PhotoView>
  );
}
