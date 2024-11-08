import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { lastSync } from "../../stores/sync";
import {
  error,
  filter,
  filteredArticles,
  loadArticles,
  loading,
} from "../../stores/articles.js";
import { selectedFeedId } from "../../stores/feeds";
import "./ArticleList.css";
import { Button } from "@nextui-org/react";
import {
  handleArticleSelect,
  handleMarkStatus,
  handleToggleStar,
} from "../../handlers/articleHandlers";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const ArticleList = () => {
  const $articles = useStore(filteredArticles);
  const $loading = useStore(loading);
  const $error = useStore(error);
  const $filter = useStore(filter);
  const $selectedFeedId = useStore(selectedFeedId);
  const $lastSync = useStore(lastSync);

  useEffect(() => {
    loadArticles($selectedFeedId);
  }, [$selectedFeedId, $lastSync]);

  if ($loading) {
    return <div className="article-list-loading">加载中...</div>;
  }

  if ($error) {
    return <div className="article-list-error">{$error}</div>;
  }

  return (
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
              onClick={() => handleArticleSelect(article)}
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
                  isIconOnly
                  variant="light"
                  onClick={(e) => handleToggleStar(article, e)}
                  className="star-button"
                >
                  {article.starred ? (
                    <StarIconSolid className="h-5 w-5 text-warning" />
                  ) : (
                    <StarIcon className="h-5 w-5" />
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
  );
};

export default ArticleList;
