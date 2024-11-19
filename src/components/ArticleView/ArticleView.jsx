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
import { cn } from "@/lib/utils";
import ArticleImage from "@/components/ArticleView/components/ArticleImage.jsx";
import parse from "html-react-parser";
import { Badge } from "@/components/ui/badge.jsx";
import MusicPlayer from "@/components/ArticleView/components/MusicPlayer.jsx";

const ArticleView = () => {
  const { articleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const $filteredArticles = useStore(filteredArticles);
  const $activeArticle = useStore(activeArticle);
  const scrollAreaRef = useRef(null);

  // 监听文章ID变化,滚动到顶部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (viewport) {
        viewport.scrollTop = 0;
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
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground block mx-auto w-fit mt-2"
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
        className="article-scroll-area h-full bg-background rounded-none sm:rounded-lg shadow-none sm:shadow-custom"
      >
        <ActionButtons articleId={$activeArticle?.id} />
        <div className="max-w-3xl px-8 py-20 w-full mx-auto">
          <div key={$activeArticle?.id} className="animate-fade-in">
            <header className="article-header">
              <div className="text-muted-foreground text-sm">
                {$activeArticle?.feed?.title}
              </div>
              <h1
                className="text-3xl font-bold my-2 hover:cursor-pointer"
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
            {audioEnclosure && <MusicPlayer audioEnclosure={audioEnclosure} />}
            <PhotoProvider
              maskOpacity={0.5}
              bannerVisible={false}
              maskClassName="backdrop-blur"
            >
              <div className="article-content prose dark:prose-invert max-w-none">
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
                  },
                })}
              </div>
            </PhotoProvider>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArticleView;
