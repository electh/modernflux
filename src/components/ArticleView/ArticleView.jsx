import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { selectedArticle, updateArticleStatus } from "../../stores/articles.js";
import "./ArticleView.css";

const ArticleView = () => {
  const $article = useStore(selectedArticle);

  useEffect(() => {
    if ($article && $article.status !== "read") {
      updateArticleStatus($article).catch((err) => {
        console.error("自动标记已读失败:", err);
      });
    }
  }, [$article]);

  if (!$article) {
    return (
      <div className="article-view empty">
        <div className="no-article">请选择一篇文章阅读</div>
      </div>
    );
  }

  return (
    <div className="article-view">
      <header className="article-header">
        <h1>{$article.title}</h1>
        <div className="article-meta">
          <time dateTime={$article.published_at}>
            {new Date($article.published_at).toLocaleString()}
          </time>
          <a
            href={$article.url}
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
        dangerouslySetInnerHTML={{ __html: $article.content }}
      />
    </div>
  );
};

export default ArticleView;
