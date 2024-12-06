import { memo, useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const ArticleItem = memo(({ article, isLast, index }) => (
  <li key={index} className="animate-fade-in">
    <ArticleCard article={article} />
    {!isLast && <Separator className="my-2" />}
  </li>
));
ArticleItem.displayName = "ArticleItem";

export default function ArticleListContent({ articles }) {
  const pageSize = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [displayArticles, setDisplayArticles] = useState(
    articles.slice(0, pageSize),
  );

  useEffect(() => {
    setDisplayArticles(articles.slice(0, currentPage * pageSize));
  }, [articles, currentPage, pageSize]);

  return (
    <div className="article-list-content flex-1 px-2 py-16">
      {displayArticles.length !== 0 && (
        <>
          <ul className="articles">
            {displayArticles.map((article, index) => (
              <ArticleItem
                key={article.id}
                article={article}
                isLast={index === displayArticles.length - 1}
                index={index}
              />
            ))}
          </ul>
          {displayArticles.length < articles.length && (
            <div className="w-full px-2 pt-1">
              <Button
                variant="secondary"
                className="w-full text-muted-foreground"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                加载更多
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
