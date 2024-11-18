import { useEffect, useRef, useState } from "react";
import { getReferrerPolicy } from "@/lib/utils";

export default function ArticleCardCover({ imageUrl }) {
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const imgElement = imgRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "10px",
        threshold: 0.1,
      },
    );

    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, []);

  if (!imageUrl || error) {
    return null;
  }

  // if (error) {
  //   return (
  //     <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center shadow-custom">
  //       <div className="flex flex-col items-center gap-2 text-muted-foreground">
  //         <ImageOff className="size-5" />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      ref={imgRef}
      className="card-image-wide aspect-video bg-muted rounded-lg shadow-custom w-full mt-1 overflow-hidden"
    >
      {isVisible && (
        <img
          className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-0 animate-in fade-in-0"
          src={imageUrl}
          alt=""
          referrerPolicy={getReferrerPolicy(imageUrl)}
          loading="lazy"
          onError={() => setError(true)}
          onLoad={(e) => {
            e.target.classList.remove("opacity-0");
            e.target.classList.add("opacity-100");
          }}
        />
      )}
    </div>
  );
}
