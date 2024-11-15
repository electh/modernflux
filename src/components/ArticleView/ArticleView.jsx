import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import "./ArticleView.css";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import ActionButtons from "@/components/ArticleView/components/ActionButtons.jsx";
import { generateReadableDate } from "@/lib/format.js";
import { filteredArticles, activeArticle } from "@/stores/articlesStore.js";
import { Separator } from "@/components/ui/separator.jsx";

const ArticleView = () => {
  const { articleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const $filteredArticles = useStore(filteredArticles);
  const $activeArticle = useStore(activeArticle);
  const scrollAreaRef = useRef(null);

  // 监听文章ID变化，滚动到顶部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
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
            setError("文章不存在或正在加载中");
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

  if (loading) {
    return (
      <div className="flex-1 bg-sidebar p-2 h-screen">
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!$activeArticle) {
    return <div className="flex-1 bg-sidebar p-2 h-screen"></div>;
  }

  if (error) {
    return (
      <div className="flex-1 bg-sidebar p-2 h-screen">
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-sidebar p-2 h-screen">
      <ScrollArea 
        ref={scrollAreaRef}
        className="article-scroll-area h-full bg-background px-8 rounded-lg shadow-custom"
      >
        <ActionButtons articleId={$activeArticle?.id} />
        <div className="max-w-3xl mx-auto py-20">
          <header className="article-header">
            <div className="text-muted-foreground text-sm">
              {$activeArticle?.feed?.title}
            </div>
            <h1 className="text-3xl font-bold my-2">{$activeArticle?.title}</h1>
            <div className="text-muted-foreground text-sm">
              <time dateTime={$activeArticle?.published_at}>
                {generateReadableDate($activeArticle?.published_at)}
              </time>
            </div>
          </header>
          <Separator className="my-4" />
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: $activeArticle?.content }}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArticleView;
