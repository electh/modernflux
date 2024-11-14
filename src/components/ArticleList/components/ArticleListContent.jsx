import { memo } from "react";
import ArticleCard from "./ArticleCard";
import { Separator } from "@/components/ui/separator";

const ArticleItem = memo(({ article, isLast }) => (
  <li>
    <ArticleCard article={article} />
    {!isLast && <Separator className="my-2" />}
  </li>
));
ArticleItem.displayName = 'ArticleItem';

export default function ArticleListContent({ articles }) {
  return (
    <div className="flex-1 overflow-auto px-2 py-16">
      {articles.length !== 0 && (
        <ul className="articles">
          {articles.map((article, index) => (
            <ArticleItem 
              key={article.id}
              article={article}
              isLast={index === articles.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
