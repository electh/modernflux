import { useState, useEffect, useRef } from "react";

export default function ArticleImage({ imageUrl }) {
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
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

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
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
