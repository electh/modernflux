import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { lastSync } from "@/stores/syncStore.js";
import {
  error,
  filter,
  filteredArticles,
  loadArticles,
  loadArticlesByCategory,
  loading,
} from "@/stores/articlesStore.js";
import "./ArticleList.css";
import { Button } from "@/components/ui/button.jsx";
import {
  handleMarkStatus,
  handleToggleStar,
} from "@/handlers/articleHandlers.js";
import { Star } from "lucide-react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const ArticleList = () => {
  const { feedId, categoryName } = useParams();
  const $articles = useStore(filteredArticles);
  const $loading = useStore(loading);
  const $error = useStore(error);
  const $filter = useStore(filter);
  const $lastSync = useStore(lastSync);
  const navigate = useNavigate();

  useEffect(() => {
    if (feedId) {
      // 加载特定订阅源的文章
      loadArticles(parseInt(feedId));
    } else if (categoryName) {
      // 加载分类下的所有文章
      loadArticlesByCategory(categoryName);
    } else {
      // 加载所有文章
      loadArticles();
    }
  }, [feedId, categoryName, $lastSync]);

  const handleArticleClick = (article) => {
    const basePath = window.location.pathname.split("/article/")[0];
    const toUrl = basePath === "/" ? `/article/${article.id}` : `${basePath}/article/${article.id}`;
    navigate(toUrl);
  };

  if ($loading) {
    return <div className="article-list-loading">加载中...</div>;
  }

  if ($error) {
    return <div className="article-list-error">{$error}</div>;
  }

  return (
    <div className="flex">
      <div className="article-list">
        <div className="article-list-header">
          <h2>文章列表</h2>
          <div className="article-filter">
            <label>
              <input
                type="radio"
                name="filter"
                value="all"
                checked={$filter === "all"}
                onChange={(e) => filter.set(e.target.value)}
              />
              全部
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="unread"
                checked={$filter === "unread"}
                onChange={(e) => filter.set(e.target.value)}
              />
              未读
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="starred"
                checked={$filter === "starred"}
                onChange={(e) => filter.set(e.target.value)}
              />
              收藏
            </label>
          </div>
        </div>

        {$articles.length === 0 ? (
          <div className="no-articles">暂无文章</div>
        ) : (
          <ul className="articles">
            {$articles.map((article) => (
              <li
                key={article.id}
                className={`article-item ${article.status === "read" ? "read" : ""}`}
                onClick={() => handleArticleClick(article)}
              >
                <div className="article-content">
                  <h3>{article.title}</h3>
                  <div className="article-meta">
                    <span className="article-date">
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="article-actions">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleToggleStar(article, e)}
                    className="star-button"
                  >
                    {article.starred ? (
                      <Star className="h-5 w-5 fill-amber-300" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    color="primary"
                    onClick={(e) => handleMarkStatus(article, e)}
                  >
                    {article.status === "read" ? "标为未读" : "标为已读"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default ArticleList;
