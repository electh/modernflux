import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { lastSync } from "@/stores/syncStore.js";
import { filteredArticles, loadArticles } from "@/stores/articlesStore.js";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import ArticleListHeader from "./components/ArticleListHeader";
import ArticleListContent from "./components/ArticleListContent";
import ArticleListFooter from "./components/ArticleListFooter";

const ArticleList = () => {
  const { feedId, categoryId } = useParams();
  const $articles = useStore(filteredArticles);
  const $lastSync = useStore(lastSync);
  const location = useLocation();

  useEffect(() => {
    if (feedId) {
      loadArticles(feedId, "feed");
    } else if (categoryId) {
      loadArticles(categoryId, "category");
    } else {
      loadArticles();
    }
  }, [feedId, categoryId, $lastSync]);

  return (
    <div className="flex">
      <ScrollArea className="w-[22rem] border-r h-screen bg-sidebar flex flex-col">
        <ArticleListContent articles={$articles} />
        <ArticleListHeader />
        <ArticleListFooter />
      </ScrollArea>
      {!location.pathname.includes("/article/") ? (
        <div className="flex-1 bg-sidebar p-2 h-screen">
          <div className="flex items-center justify-center h-full">
            请选择要阅读的文章
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default ArticleList;
