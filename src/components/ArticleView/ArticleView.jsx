import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import storage from "@/db/storage";
import "./ArticleView.css";
import { handleMarkStatus } from "@/handlers/articleHandlers.js";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";

const ArticleView = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (articleId) {
        const loadedArticle = await storage.getArticle(parseInt(articleId));
        setArticle(loadedArticle);

        if (loadedArticle && loadedArticle.status !== "read") {
          handleMarkStatus(loadedArticle);
        }
      }
    };

    loadArticle();
  }, [articleId]);

  if (!article) {
    return (
      <div className="article-view empty">
        <div className="no-article">请选择一篇文章阅读</div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-screen bg-background px-8">
      <header className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <time dateTime={article.published_at}>
            {new Date(article.published_at).toLocaleString()}
          </time>
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
    </ScrollArea>
  );
};

export default ArticleView;
