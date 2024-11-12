import { atom, computed } from "nanostores";
import storage from "../db/storage";
import { filter } from "@/stores/articlesStore.js";

export const feeds = atom([]);
export const selectedFeedId = atom(null);
export const error = atom(null);
export const unreadCounts = atom({});
export const starredCounts = atom({});

// 计算当前选中的分组名称
export const selectedCategoryName = computed(
  [feeds, selectedFeedId],
  (feeds, selectedFeedId) => {
    if (!selectedFeedId) return null;
    const selectedFeed = feeds.find((feed) => feed.id === selectedFeedId);
    return selectedFeed?.categoryName || "未分类";
  },
);

export const filteredFeeds = computed(
  [feeds, filter, starredCounts, unreadCounts],
  ($feeds, $filter, $starredCounts, $unreadCounts) => {
    return $feeds.filter((feed) => {
      switch ($filter) {
        case "starred":
          return $starredCounts[feed.id] > 0;
        case "unread":
          return $unreadCounts[feed.id] > 0;
        default:
          return true;
      }
    });
  },
);

export const feedsByCategory = computed(
  [filteredFeeds, unreadCounts, starredCounts],
  ($filteredFeeds, $unreadCounts, $starredCounts) => {
    return Object.entries(
      $filteredFeeds.reduce((acc, feed) => {
        const categoryName = feed.categoryName || "未分类";
        const categoryId = feed.categoryId || "uncategorized";
        if (!acc[categoryId]) {
          acc[categoryId] = {
            name: categoryName,
            feeds: []
          };
        }
        acc[categoryId].feeds.push(feed);
        return acc;
      }, {}),
    ).map(([id, category]) => ({
      id,
      title: category.name,
      isActive: false,
      feeds: category.feeds.map((feed) => ({
        id: feed.id,
        title: feed.title,
        url: feed.url || "#", 
        site_url: feed.site_url || "#",
        unreadCount: $unreadCounts[feed.id] || 0,
        starredCount: $starredCounts[feed.id] || 0,
      })),
    }));
  },
);

export const getCategoryCount = computed(
  [filter, starredCounts, unreadCounts],
  ($filter, $starredCounts, $unreadCounts) => (feeds) => {
    switch ($filter) {
      case "starred":
        return feeds.reduce(
          (sum, feed) => sum + ($starredCounts[feed.id] || 0),
          0,
        );
      case "unread":
      default:
        return feeds.reduce(
          (sum, feed) => sum + ($unreadCounts[feed.id] || 0),
          0,
        );
    }
  },
);

export const getFeedCount = computed(
  [filter, starredCounts, unreadCounts],
  ($filter, $starredCounts, $unreadCounts) => (feedId) => {
    switch ($filter) {
      case "starred":
        return $starredCounts[feedId] || 0;
      case "unread":
      default:
        return $unreadCounts[feedId] || 0;
    }
  },
);

export async function loadFeeds() {
  try {
    await storage.init();
    const storedFeeds = await storage.getFeeds();
    feeds.set(storedFeeds || []);

    // 获取未读和收藏计数
    const unreadCount = {};
    const starredCount = {};
    for (const feed of storedFeeds) {
      unreadCount[feed.id] = await storage.getUnreadCount(feed.id);
      starredCount[feed.id] = await storage.getStarredCount(feed.id);
    }
    unreadCounts.set(unreadCount);
    starredCounts.set(starredCount);
  } catch (err) {
    error.set("加载订阅源失败");
    console.error(err);
  }
}
