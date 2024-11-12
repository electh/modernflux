import { Button } from "@/components/ui/button.jsx";
import {
  handleMarkStatus,
  handleToggleStar,
} from "@/handlers/articleHandlers.js";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ArticleCard({article}) {
  const navigate = useNavigate();

  const handleArticleClick = (article) => {
    const basePath = window.location.pathname.split("/article/")[0];
    const toUrl =
      basePath === "/"
        ? `/article/${article.id}`
        : `${basePath}/article/${article.id}`;
    navigate(toUrl);
  };

  return (
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
        <Button color="primary" onClick={(e) => handleMarkStatus(article, e)}>
          {article.status === "read" ? "标为未读" : "标为已读"}
        </Button>
      </div>
    </li>
  );
}
