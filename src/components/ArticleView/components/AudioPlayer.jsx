import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function AudioPlayer({ source }) {
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
    <div className="mb-4">
      <audio ref={audioRef} controls className="w-full z-0" preload="metadata">
        <source src={source.url} type={source.mime_type} />
        您的浏览器不支持音频播放器。
      </audio>
    </div>
  );
}
