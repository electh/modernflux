import { useState, useRef, useEffect } from "react";

const LazyImage = ({ 
  src, 
  alt = "", 
  className = "",
  opacity = "100",
  onError = () => {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "10px", // 提前10px开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (hasError) {
    return null;
  }

  return (
    <div ref={imgRef} className="w-full h-full">
      {isInView && (
        <img
          className={`
            w-full h-full object-cover 
            transition-opacity duration-300 ease-in-out
            opacity-0
            ${isLoaded ? `opacity-${opacity}` : ""}
            animate-in fade-in-0
            ${className}
          `}
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => {
            setHasError(true);
            onError();
          }}
          onLoad={() => {
            setIsLoaded(true);
          }}
        />
      )}
    </div>
  );
};

export default LazyImage; 