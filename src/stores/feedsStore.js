import { atom, computed } from "nanostores";
import storage from "../db/storage";
import { filter } from "@/stores/articlesStore.js";
import { settingsState } from "@/stores/settingsStore.js";

export const feeds = atom([]);
export const error = atom(null);
export const unreadCounts = atom({});
export const starredCounts = atom({});

export const filteredFeeds = computed(
  [feeds, filter, starredCounts, unreadCounts, settingsState],
  ($feeds, $filter, $starredCounts, $unreadCounts, $settings) => {
    const visibleFeeds = $settings.showHiddenFeeds
      ? $feeds
      : $feeds.filter((feed) => !feed.hide_globally);
    return visibleFeeds.filter((feed) => {
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
            feeds: [],
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

export const totalUnreadCount = computed([unreadCounts], ($unreadCounts) => {
  return Object.values($unreadCounts).reduce((sum, count) => sum + count, 0);
});

export const totalStarredCount = computed([starredCounts], ($starredCounts) => {
  return Object.values($starredCounts).reduce((sum, count) => sum + count, 0);
});

export async function loadFeeds() {
  try {
    await storage.init();
    const storedFeeds = await storage.getFeeds();
    feeds.set(storedFeeds || []);
    const filteredFeeds = settingsState.get().showHiddenFeeds
      ? storedFeeds
      : storedFeeds.filter((feed) => !feed.hide_globally);

    // 获取未读和收藏计数
    const unreadCount = {};
    const starredCount = {};
    for (const feed of filteredFeeds) {
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
