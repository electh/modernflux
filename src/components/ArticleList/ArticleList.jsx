import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { lastSync } from "@/stores/syncStore.js";
import {
  filter,
  filteredArticles,
  loadArticles,
} from "@/stores/articlesStore.js";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import ArticleListHeader from "./components/ArticleListHeader";
import ArticleListContent from "./components/ArticleListContent";
import ArticleListFooter from "./components/ArticleListFooter";

const ArticleList = () => {
  const { feedId, categoryId, articleId } = useParams();
  const $filteredArticles = useStore(filteredArticles);
  const $lastSync = useStore(lastSync);
  const $filter = useStore(filter);
  const location = useLocation();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const loadAndFilterArticles = () => {
      if (feedId) {
        loadArticles(feedId, "feed");
      } else if (categoryId) {
        loadArticles(categoryId, "category");
      } else {
        loadArticles();
      }
    };

    loadAndFilterArticles();
  }, [feedId, categoryId, $lastSync, $filter]);

  // 监听 articleId 变化，滚动到对应的文章卡片
  useEffect(() => {
    if (scrollAreaRef.current && articleId) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      const articleCard = viewport?.querySelector(
        `[data-article-id="${articleId}"]`,
      );

      if (viewport && articleCard) {
        const viewportRect = viewport.getBoundingClientRect();
        const cardRect = articleCard.getBoundingClientRect();

        // 计算滚动位置，使文章卡片位于视口中间
        const scrollTop =
          viewport.scrollTop +
          (cardRect.top - viewportRect.top) -
          (viewportRect.height - cardRect.height) / 2;

        viewport.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [articleId]);

  // 监听 feedId、categoryId 和 filter 变化，滚动到顶部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (viewport) {
        viewport.scrollTop = 0;
      }
    }
  }, [feedId, categoryId, $filter]);

  return (
    <div className="flex">
      <ScrollArea
        ref={scrollAreaRef}
        className="w-[22rem] border-r h-screen bg-sidebar flex flex-col"
      >
        <ArticleListContent articles={$filteredArticles} />
        <ArticleListHeader />
        <ArticleListFooter />
      </ScrollArea>
      {!location.pathname.includes("/article/") ? (
        <div className="flex-1 bg-sidebar p-2 h-screen">
          <div className="flex items-center justify-center h-full text-muted-foreground">
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
