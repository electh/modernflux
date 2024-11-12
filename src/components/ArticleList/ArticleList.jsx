import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { lastSync } from "@/stores/syncStore.js";
import {
  filteredArticles,
  loadArticles,
  loadArticlesByCategory,
} from "@/stores/articlesStore.js";
import "./ArticleList.css";
import { Outlet, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import ArticleListHeader from "./components/ArticleListHeader";
import ArticleListContent from "./components/ArticleListContent";
import ArticleListFooter from "./components/ArticleListFooter";

const ArticleList = () => {
  const { feedId, categoryId } = useParams();
  const $articles = useStore(filteredArticles);
  const $lastSync = useStore(lastSync);

  useEffect(() => {
    if (feedId) {
      loadArticles(parseInt(feedId));
    } else if (categoryId) {
      loadArticlesByCategory(categoryId);
    } else {
      loadArticles();
    }
  }, [feedId, categoryId, $lastSync]);

  return (
    <div className="flex">
      <ScrollArea className="w-80 border-r h-screen bg-background flex flex-col">
        <ArticleListHeader />
        <ArticleListContent articles={$articles} />
        <ArticleListFooter />
      </ScrollArea>
      <Outlet />
    </div>
  );
};

export default ArticleList;
