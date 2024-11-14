import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import "./ArticleView.css";
import { handleMarkStatus } from "@/handlers/articleHandlers.js";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import ActionButtons from "@/components/ArticleView/components/ActionButtons.jsx";
import { generateReadableDate } from "@/lib/format.js";
import { filteredArticles } from "@/stores/articlesStore.js";

const ArticleView = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const $filteredArticles = useStore(filteredArticles);

  useEffect(() => {
    const loadArticleByArticleId = async () => {
      if (articleId) {
        setLoading(true);
        setError(null);
        try {
          const loadedArticle = $filteredArticles.find(
            (article) => article.id === parseInt(articleId),
          );
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

  if (!article) {
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
      <ScrollArea className="article-scroll-area h-full bg-background px-8 rounded-lg shadow-custom">
        <ActionButtons article={article} />
        <div className="max-w-3xl mx-auto py-20">
          <header className="article-header">
            <h1 className="text-3xl font-bold my-2">{article.title}</h1>
            <div className="article-meta text-muted-foreground text-sm">
              <time dateTime={article.published_at}>
                {generateReadableDate(article.published_at)}
              </time>
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
