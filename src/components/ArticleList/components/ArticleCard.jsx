import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { extractFirstImage } from "@/lib/utils";
import { useMemo, useState } from "react";
import { formatPublishDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function ArticleCard({ article }) {
  const [error, setError] = useState(false);
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
      className={cn(
        "cursor-pointer select-none overflow-hidden p-2 rounded-lg",
        "relative transform-gpu transition-colors duration-200",
        "bg-transparent contain-content",
        "hover:bg-background",
        parseInt(articleId) === article.id && "bg-background shadow-custom",
      )}
      data-article-id={article.id}
      onClick={() => handleArticleClick(article)}
    >
      <div className="card-content flex flex-col gap-1">
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

          <h3 className="card-title text-foreground text-[1rem] font-bold line-clamp-2">
            {article.title}
          </h3>
        </div>

        {imageUrl && !error && (
          <div className="card-image-wide aspect-video rounded-lg shadow-custom w-full mt-1 overflow-hidden">
            <img
              className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-0 animate-in fade-in-0"
              src={imageUrl}
              alt=""
              loading="lazy"
              onError={() => setError(true)}
              onLoad={(e) => {
                e.target.classList.remove('opacity-0');
                e.target.classList.add('opacity-100');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
