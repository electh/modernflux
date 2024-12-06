import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function MediaPlayer({ source, type }) {
  const playerRef = useRef(null);
  const plyrRef = useRef(null);

  useEffect(() => {
    // 初始化 Plyr
    if (playerRef.current && !plyrRef.current) {
      plyrRef.current = new Plyr(playerRef.current, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "airplay",
          "fullscreen",
        ],
        i18n: {
          play: "播放",
          pause: "暂停",
          mute: "静音",
          unmute: "取消静音",
          settings: "设置",
          speed: "速度",
          normal: "正常",
        },
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true,
          container: null,
        },
        playsinline: false,
      });
    }

    // 清理函数
    return () => {
      if (plyrRef.current) {
        plyrRef.current.destroy();
        plyrRef.current = null;
      }
    };
  }, []);

  // 处理 YouTube URL
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // 如果是 YouTube 链接
  if (
    (source.url && source.url.includes("youtube.com")) ||
    source.url.includes("youtu.be")
  ) {
    const videoId = getYouTubeId(source.url);
    if (videoId) {
      return (
        <div className="mb-4 rounded">
          <div className="plyr__video-embed" ref={playerRef}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      );
    }
  }

  // 原有的音视频播放器逻辑
  return (
    <div className="mb-4">
      {type === "audio" ? (
        <audio ref={playerRef} className="w-full">
          <source src={source.url} type={source.mime_type} />
          您的浏览器不支持音频播放器。
        </audio>
      ) : (
        <video ref={playerRef} className="w-full">
          <source src={source.url} type={source.mime_type} />
          您的浏览器不支持视频播放器。
        </video>
      )}
      {source.size && (
        <div className="text-xs text-muted-foreground mt-1 text-center">
          文件大小: {(source.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}
    </div>
  );
}
