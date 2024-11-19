import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function MusicPlayer({ audioEnclosure }) {
  const audioRef = useRef(null);
  const location = useLocation();
  
  useEffect(() => {
    const hash = location.hash;
    const timeMatch = hash.match(/#t=(\d+):(\d+)/);
    
    if (timeMatch && audioRef.current) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseInt(timeMatch[2]);
      const totalSeconds = minutes * 60 + seconds;
      
      if (!isNaN(totalSeconds)) {
        audioRef.current.currentTime = totalSeconds;
      }
    }
  }, [location.hash]);

  return (
    <div className="mb-8">
      <audio 
        ref={audioRef}
        controls 
        className="w-full" 
        preload="metadata"
      >
        <source src={audioEnclosure.url} type={audioEnclosure.mime_type} />
        您的浏览器不支持音频播放器。
      </audio>
      {audioEnclosure.size && (
        <div className="text-xs text-muted-foreground mt-1 text-right">
          文件大小: {(audioEnclosure.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}
    </div>
  );
}
