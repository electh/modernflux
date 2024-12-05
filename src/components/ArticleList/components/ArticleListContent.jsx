import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ArticleCard from "./ArticleCard";

const ArticleItem = memo(({ article }) => (
  <div key={article.id} className="animate-fade-in">
    <ArticleCard article={article} />
  </div>
));

ArticleItem.displayName = "ArticleItem";

export default function ArticleListContent({ articles }) {
  const parentRef = useRef(null);

  // 创建一个 Map 来存储每个项目的高度
  const heightsRef = useRef(new Map());

  const virtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // 初始预估高度
    overscan: 5,
    measureElement: (element) => {
      // 测量实际元素高度并缓存
      const height = element.getBoundingClientRect().height;
      const index = Number(element.dataset.index);
      heightsRef.current.set(index, height);
      return height;
    },
  });

  return (
    <div
      ref={parentRef}
      className="article-list-content flex-1 px-2 py-16 overflow-auto"
    >
      {articles.length !== 0 && (
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={articles[virtualItem.index].id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
                // 添加间距
                paddingBottom: "1rem",
              }}
            >
              <ArticleItem article={articles[virtualItem.index]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
