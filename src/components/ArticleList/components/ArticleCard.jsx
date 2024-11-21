import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { cn, extractFirstImage } from "@/lib/utils";
import { formatPublishDate } from "@/lib/format";
import ArticleCardCover from "./ArticleCardCover.jsx";
import { handleMarkStatus } from "@/handlers/articleHandlers.js";
import { useMemo } from "react";

export default function ArticleCard({ article }) {
  const navigate = useNavigate();
  const { articleId } = useParams();

  const imageUrl = useMemo(
    () => extractFirstImage(article),
    [article],
  );

  const handleArticleClick = async (article) => {
    const basePath = window.location.pathname.split("/article/")[0];
    const toUrl =
      basePath === "/"
        ? `/article/${article.id}`
        : `${basePath}/article/${article.id}`;
    navigate(toUrl);
    if (article.status !== "read") {
      await handleMarkStatus(article);
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer select-none overflow-hidden p-2 rounded-lg",
        "relative transform-gpu transition-colors duration-200",
        "bg-transparent contain-content",
        "hover:bg-sidebar-accent",
        parseInt(articleId) === article.id && "bg-background shadow-custom",
      )}
      data-article-id={article.id}
      onClick={() => handleArticleClick(article)}
    >
      <div
        className={cn(
          "card-content flex flex-col gap-1",
          article.status === "read" && "opacity-50",
        )}
      >
        <div className="card-header">
          <div className="card-meta flex items-start justify-between gap-1 mb-1">
            <div className="card-source flex items-center flex-1 gap-1 min-w-0">
              <div className="card-source-content flex flex-col min-w-0">
                <span className="card-source-title text-muted-foreground font-bold text-xs">
                  {article.feed?.title}
                </span>
                {article.author && (
                  <span className="card-author text-muted-foreground font-normal text-xs truncate">
                    {article.author}
                  </span>
                )}
              </div>
            </div>
            <div className="card-time-wrapper flex items-center gap-1 text-xs text-muted-foreground">
              <span className="card-star">
                <Star
                  className="size-3 fill-muted-foreground"
                  style={{ opacity: article.starred ? 1 : 0 }}
                />
              </span>
              <span className="card-time whitespace-nowrap">
                {formatPublishDate(article.published_at)}
              </span>
            </div>
          </div>

          <h3
            className={cn(
              "card-title text-base font-bold line-clamp-2 text-wrap break-words",
              article.status === "read"
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            {article.title}
          </h3>
        </div>

        <ArticleCardCover imageUrl={imageUrl} />
      </div>
    </div>
  );
}
