import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import storage from "@/db/storage";
import "./ArticleView.css";
import { handleMarkStatus } from "@/handlers/articleHandlers.js";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import ActionButtons from "@/components/ArticleView/components/ActionButtons.jsx";

const ArticleView = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formattedDate = useMemo(() => {
    if (!article?.published_at) return "";
    return new Date(article.published_at).toLocaleString();
  }, [article?.published_at]);

  useEffect(() => {
    const loadArticle = async () => {
      if (articleId) {
        setLoading(true);
        setError(null);
        try {
          await storage.init();
          const loadedArticle = await storage.getArticle(parseInt(articleId));
          setArticle(loadedArticle);

          if (loadedArticle && loadedArticle.status !== "read") {
            handleMarkStatus(loadedArticle);
          }
        } catch (err) {
          console.error("加载文章失败:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex-1 bg-sidebar p-2 h-screen">
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
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
      <ScrollArea className="h-full bg-background px-8 rounded-lg shadow-custom">
        <ActionButtons article={article} />
        <div className="max-w-3xl mx-auto py-20">
          <header className="article-header">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <time dateTime={article.published_at}>{formattedDate}</time>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="original-link"
              >
                阅读原文
              </a>
            </div>
          </header>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArticleView;
