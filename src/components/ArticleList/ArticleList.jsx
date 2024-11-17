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
import EmptyPlaceholder from "./components/EmptyPlaceholder";

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

        // 考虑 header 和 footer 的高度
        const headerHeight = 60; // header 高度
        const footerHeight = 56; // footer 高度

        // 计算实际可视区域
        const effectiveViewportTop = viewportRect.top + headerHeight;
        const effectiveViewportBottom = viewportRect.bottom - footerHeight;

        // 检查文章卡片是否在有效视口内
        const isCardInViewport =
          cardRect.top >= effectiveViewportTop &&
          cardRect.bottom <= effectiveViewportBottom;

        // 如果卡片不在有效视口内，才进行滚动
        if (!isCardInViewport) {
          // 如果卡片在视口上方，滚动到顶部对齐（考虑 header）
          if (cardRect.top < effectiveViewportTop) {
            viewport.scrollTo({
              top: viewport.scrollTop + (cardRect.top - effectiveViewportTop),
              behavior: "smooth",
            });
          }
          // 如果卡片在视口下方，滚动到底部对齐（考虑 footer）
          else if (cardRect.bottom > effectiveViewportBottom) {
            viewport.scrollTo({
              top:
                viewport.scrollTop +
                (cardRect.bottom - effectiveViewportBottom),
              behavior: "smooth",
            });
          }
        }
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
    <div className="flex relative bg-sidebar">
      <ScrollArea
        ref={scrollAreaRef}
        className="w-full sm:w-[21rem] border-r h-screen bg-sidebar flex flex-col"
      >
        <ArticleListContent articles={$filteredArticles} />
        <ArticleListHeader />
        <ArticleListFooter />
      </ScrollArea>
      {!location.pathname.includes("/article/") ? (
        <EmptyPlaceholder />
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default ArticleList;
