import { memo, useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

const ArticleItem = memo(({ article }) => (
  <motion.li
    key={article.id}
    initial={{ y: 50, opacity: 0 }}
    animate={{
      y: 0,
      opacity: 1,
      transition: { type: "spring", bounce: 0.3, opacity: { delay: 0.05 } },
    }}
    exit={{ y: -50, opacity: 0 }}
    transition={{
      duration: 0.3,
      type: "spring",
      bounce: 0,
      opacity: { delay: 0.06 },
    }}
  >
    <ArticleCard article={article} />
  </motion.li>
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
          <ul className="articles flex flex-col gap-4">
            <AnimatePresence initial={false} mode="wait">
              {displayArticles.map((article) => (
                <ArticleItem key={article.id} article={article} />
              ))}
            </AnimatePresence>
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
