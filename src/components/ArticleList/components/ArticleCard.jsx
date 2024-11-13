import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import "./ArticleCard.css";
import { extractFirstImage } from "@/lib/utils";
import { useMemo } from "react";
import { formatPublishDate } from "@/lib/format";
export default function ArticleCard({ article }) {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const imageUrl = useMemo(
    () => extractFirstImage(article.content),
    [article.content],
  );

  const handleArticleClick = (article) => {
    const basePath = window.location.pathname.split("/article/")[0];
    const toUrl =
      basePath === "/"
        ? `/article/${article.id}`
        : `${basePath}/article/${article.id}`;
    navigate(toUrl);
  };

  return (
    <div
      className={
        parseInt(articleId) === article.id
          ? "card-wrapper selected"
          : "card-wrapper"
      }
      data-article-id={article.id}
      onClick={() => handleArticleClick(article)}
    >
      <div className="card-content">
        <div className="card-header">
          <div className="card-meta">
            <div className="card-source">
              <div className="card-source-content">
                <span className="card-source-title">{article.feed?.title}</span>
                {article.author && (
                  <span className="card-author">{article.author}</span>
                )}
              </div>
            </div>
            <div className="card-time-wrapper">
              <span className="card-star">
                <Star
                  className="size-3"
                  style={{ opacity: article.starred ? 1 : 0 }}
                />
              </span>
              <span className="card-time">{formatPublishDate(article.published_at)}</span>
            </div>
          </div>

          <h3 className="card-title">{article.title}</h3>
        </div>

        {imageUrl && (
          <div className="card-image-wide">
            <img
              className="w-full h-full object-cover"
              src={imageUrl}
              alt=""
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
