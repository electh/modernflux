import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function MediaPlayer({ src, type }) {
  const playerRef = useRef(null);
  const plyrRef = useRef(null);
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipod/.test(userAgent);
    // 初始化 Plyr
    if (playerRef.current && !plyrRef.current) {
      plyrRef.current = new Plyr(playerRef.current, {
        controls: [
          "play-large",
          ...(isIOSDevice && type !== "youtube"
            ? []
            : ["play", "progress", "current-time", "duration", "mute"]),
          ...(isIOSDevice ? [] : ["fullscreen"]),
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
          enabled: !isIOSDevice,
          fallback: true,
          iosNative: true,
          container: null,
        },
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
  if (type === "youtube") {
    const videoId = getYouTubeId(src);
    if (videoId) {
      return (
        <div className="mb-4">
          <div className="plyr__video-embed" ref={playerRef}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary/10 hover:text-primary block mx-auto w-fit my-2"
            onClick={() =>
              window.open(
                `https://www.youtube.com/watch?v=${videoId}`,
                "_blank",
              )
            }
          >
            在新窗口中打开嵌入内容
          </Badge>
        </div>
      );
    }
  }

  return (
    <div className="mb-4">
      <video ref={playerRef} className="w-full">
        <source src={src} type={type} />
        您的浏览器不支持视频播放器。
      </video>
    </div>
  );
}
