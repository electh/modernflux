import { useStore } from "@nanostores/react";
import { feeds, starredCounts, unreadCounts } from "@/stores/feeds.js";
import { filter } from "@/stores/articles.js";
import FeedIcon from "./FeedIcon";

const FeedListbox = ({ onSelect }) => {
  const $feeds = useStore(feeds);
  const $unreadCounts = useStore(unreadCounts);
  const $starredCounts = useStore(starredCounts);
  const $filter = useStore(filter);

  // 根据当前筛选条件过滤订阅源
  const filteredFeeds = $feeds.filter((feed) => {
    switch ($filter) {
      case "starred":
        return $starredCounts[feed.id] > 0;
      case "unread":
        return $unreadCounts[feed.id] > 0;
      default:
        return true;
    }
  });

  // 按分类分组订阅源
  const feedsByCategory = filteredFeeds.reduce((acc, feed) => {
    const categoryName = feed.categoryName || "未分类";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(feed);
    return acc;
  }, {});

  return (
    <div className="overflow-auto h-[calc(100vh-120px)]">
      <div className="space-y-1">
        {Object.entries(feedsByCategory).map(([category, categoryFeeds]) => (
          <details key={category} className="group" open>
            <summary className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent/50 rounded-md">
              <span className="font-medium">{category}</span>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-1 space-y-1 px-2">
              {categoryFeeds.map((feed) => (
                <button
                  key={feed.id}
                  onClick={() => onSelect(feed.id)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FeedIcon url={feed.site_url} />
                    <span className="truncate">{feed.title}</span>
                  </div>
                  {($filter === "starred"
                    ? $starredCounts[feed.id]
                    : $unreadCounts[feed.id]) > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {$filter === "starred"
                        ? $starredCounts[feed.id]
                        : $unreadCounts[feed.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FeedListbox;
