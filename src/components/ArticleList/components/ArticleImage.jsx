import { useState, useEffect, useRef } from "react";
import { getReferrerPolicy } from "@/lib/utils";

export default function ArticleImage({ imageUrl }) {
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
        threshold: 0.1
      }
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
          referrerPolicy={getReferrerPolicy(imageUrl).referrerPolicy}
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
