import { memo, useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { filter } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";

const ArticleItem = memo(({ article, isLast, index }) => (
  <li key={index}>
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
  const { feedId, categoryId } = useParams();
  const $filter = useStore(filter);
  let info = [feedId, categoryId, $filter].filter(Boolean).join('-');

  useEffect(() => {
    setDisplayArticles(articles.slice(0, currentPage * pageSize));
  }, [articles, currentPage, pageSize]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="article-list-content flex-1 px-2 py-16"
        key={info}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
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
      </motion.div>
    </AnimatePresence>
  );
}
