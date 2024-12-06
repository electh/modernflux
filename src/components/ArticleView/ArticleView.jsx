import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "./ArticleView.css";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import ActionButtons from "@/components/ArticleView/components/ActionButtons.jsx";
import { generateReadableDate } from "@/lib/format.js";
import { activeArticle, filteredArticles } from "@/stores/articlesStore.js";
import { Separator } from "@/components/ui/separator.jsx";
import EmptyPlaceholder from "@/components/ArticleList/components/EmptyPlaceholder";
import { cn, getFontSizeClass } from "@/lib/utils";
import ArticleImage from "@/components/ArticleView/components/ArticleImage.jsx";
import parse from "html-react-parser";
import { Badge } from "@/components/ui/badge.jsx";
import Customize from "@/components/ArticleView/components/customize/Index.jsx";
import { settingsState } from "@/stores/settingsStore";
import { AnimatePresence, motion } from "framer-motion";
import MediaPlayer from "@/components/ArticleView/components/MediaPlayer.jsx";
import AudioPlayer from "@/components/ArticleView/components/AudioPlayer.jsx";

const ArticleView = () => {
  const { articleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const $filteredArticles = useStore(filteredArticles);
  const $activeArticle = useStore(activeArticle);
  const {
    lineHeight,
    fontSize,
    maxWidth,
    alignJustify,
    fontFamily,
    titleFontSize,
    titleAlignType,
  } = useStore(settingsState);
  const scrollAreaRef = useRef(null);

  // 监听文章ID变化,滚动到顶部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (viewport) {
        viewport.scrollTo({
          top: 0,
          behavior: "instant", // 使用 instant 避免与动画冲突
        });
      }
    }
  }, [articleId]);

  useEffect(() => {
    const loadArticleByArticleId = async () => {
      if (articleId && $filteredArticles.length > 0) {
        setLoading(true);
        setError(null);
        try {
          const loadedArticle = $filteredArticles.find(
            (article) => article.id === parseInt(articleId),
          );
          if (loadedArticle) {
            activeArticle.set(loadedArticle);
          } else {
            setError("请选择要阅读的文章");
          }
        } catch (err) {
          console.error("加载文章失败:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadArticleByArticleId();
  }, [$filteredArticles, articleId]);

  const handleLinkWithImg = (domNode) => {
    const imgNode = domNode.children.find(
      (child) => child.type === "tag" && child.name === "img",
    );

    if (imgNode) {
      const hostname =
        new URL(domNode.attribs.href).hostname || domNode.attribs.href;
      return (
        <>
          <ArticleImage imgNode={imgNode} />
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary/10 hover:text-primary block mx-auto w-fit mt-2"
            onClick={() => {
              window.open(domNode.attribs.href, "_blank");
            }}
          >
            {hostname}...
          </Badge>
        </>
      );
    }
    return domNode;
  };

  // 检查是否有音频附件
  const audioEnclosure = $activeArticle?.enclosures?.find((enclosure) =>
    enclosure.mime_type?.startsWith("audio/"),
  );

  // 检查是否有音频、视频或 YouTube 链接
  const mediaEnclosure = $activeArticle?.enclosures?.find((enclosure) => {
    // 只检查视频类型
    const isVideoType = enclosure.mime_type?.startsWith("video/");

    // 检查是否是 YouTube 链接
    const isYouTube =
      enclosure.url &&
      (enclosure.url.includes("youtube.com") ||
        enclosure.url.includes("youtu.be"));

    return isVideoType || isYouTube;
  });

  if (loading || !$activeArticle || error) {
    return <EmptyPlaceholder />;
  }

  return (
    <div
      className={cn(
        "flex-1 bg-sidebar p-0 sm:p-2 h-screen fixed sm:static inset-0 z-50",
        "animate-slide-in-from-right motion-reduce:animate-none",
      )}
    >
      <ScrollArea
        ref={scrollAreaRef}
        type="auto"
        className="article-scroll-area h-full bg-background rounded-none sm:rounded-lg shadow-none sm:shadow-custom"
      >
        <ActionButtons articleId={$activeArticle?.id} />
        <div
          className="article-view-content px-5 py-20 w-full mx-auto"
          style={{
            maxWidth: `${maxWidth}ch`,
            fontFamily: fontFamily,
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={$activeArticle?.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.3,
                  opacity: { delay: 0.05 },
                },
              }}
            >
              <header
                className="article-header"
                style={{ textAlign: titleAlignType }}
              >
                <div className="text-muted-foreground text-sm">
                  {$activeArticle?.feed?.title}
                </div>
                <h1
                  className="font-bold my-2 hover:cursor-pointer"
                  style={{
                    fontSize: `${titleFontSize * fontSize}px`,
                  }}
                  onClick={() => window.open($activeArticle?.url, "_blank")}
                >
                  {$activeArticle?.title}
                </h1>
                <div className="text-muted-foreground text-sm">
                  <time dateTime={$activeArticle?.published_at}>
                    {generateReadableDate($activeArticle?.published_at)}
                  </time>
                </div>
              </header>
              <Separator className="my-4" />
              {mediaEnclosure && (
                <MediaPlayer source={mediaEnclosure} type="video" />
              )}
              {audioEnclosure && <AudioPlayer source={audioEnclosure} />}
              <PhotoProvider
                maskOpacity={0.5}
                bannerVisible={false}
                maskClassName="backdrop-blur"
              >
                <div
                  className={cn(
                    "article-content prose dark:prose-invert max-w-none",
                    getFontSizeClass(fontSize),
                  )}
                  style={{
                    lineHeight: lineHeight + "em",
                    textAlign: alignJustify ? "justify" : "left",
                  }}
                >
                  {parse($activeArticle?.content, {
                    replace(domNode) {
                      if (domNode.type === "tag" && domNode.name === "img") {
                        return <ArticleImage imgNode={domNode} />;
                      }
                      if (domNode.type === "tag" && domNode.name === "a") {
                        return domNode.children.length > 0
                          ? handleLinkWithImg(domNode)
                          : domNode;
                      }
                      if (domNode.type === "tag" && domNode.name === "iframe") {
                        const { src } = domNode.attribs;
                        
                        // 判断是否为 YouTube iframe
                        const isYouTube = src && (
                          src.includes("youtube.com/embed") || 
                          src.includes("youtu.be") ||
                          src.includes("youtube-nocookie.com/embed")
                        );

                        // 如果不是 YouTube iframe,直接返回原始节点
                        if (!isYouTube) {
                          return domNode;
                        }

                        // YouTube iframe 显示打开链接的按钮
                        return (
                          <div className="my-4">
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary/10 hover:text-primary block mx-auto w-fit"
                              onClick={() => window.open(src, "_blank")}
                            >
                              点击在新窗口中打开嵌入内容
                            </Badge>
                          </div>
                        );
                      }
                    },
                  })}
                </div>
              </PhotoProvider>
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>
      <Customize />
    </div>
  );
};

export default ArticleView;
