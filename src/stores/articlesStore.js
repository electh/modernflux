import { atom, computed } from "nanostores";
import storage from "../db/storage";
import minifluxAPI from "../api/miniflux";
import { starredCounts, unreadCounts } from "./feedsStore.js";

export const UnfilteredArticles = atom([]);
export const loading = atom(false);
export const error = atom(null);
export const filter = atom("all");

// 计算过滤后的文章列表
export const filteredArticles = computed(
  [UnfilteredArticles, filter],
  (articles, filter) => {
    switch (filter) {
      case "unread":
        return articles.filter((article) => article.status !== "read");
      case "starred":
        return articles.filter((article) => article.starred);
      default:
        return articles;
    }
  },
);

// 加载文章列表
export async function loadArticles(sourceId = null, type = "feed") {
  loading.set(true);
  error.set(null);

  try {
    await storage.init();
    const feeds = await storage.getFeeds();
    let targetFeeds;
    let articles = [];

    // 根据类型确定要加载的订阅源
    if (type === "category" && sourceId) {
      // 获取分类下的所有订阅源
      targetFeeds = feeds.filter(
        (feed) => feed.categoryId === parseInt(sourceId),
      );
    } else if (sourceId) {
      // 获取单个订阅源
      targetFeeds = feeds.filter((feed) => feed.id === parseInt(sourceId));
    } else {
      // 获取所有订阅源
      targetFeeds = feeds;
    }

    // 获取所有目标订阅源的文章
    for (const feed of targetFeeds) {
      const feedArticles = await storage.getArticles(feed.id);
      const articlesWithFeed = feedArticles.map((article) => ({
        ...article,
        feed: {
          title: feed.title || "未知来源",
          site_url: feed.site_url || "#",
        },
      }));
      articles = [...articles, ...articlesWithFeed];
    }

    // 按发布时间倒序排序
    const sortedArticles = articles.sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at),
    );

    UnfilteredArticles.set(sortedArticles);
  } catch (err) {
    console.error("加载文章失败:", err);
    error.set("加载文章失败");
  } finally {
    loading.set(false);
  }
}

// 更新文章状态
export async function updateArticleStatus(article) {
  try {
    if (navigator.onLine) {
      // 更新miniflux文章状态
      await minifluxAPI.updateEntryStatus(article);
    }

    const newStatus = article.status === "read" ? "unread" : "read";

    // 先更新数据库中的文章状态
    await storage.addArticles([
      {
        ...article,
        status: newStatus,
      },
    ]);

    // 更新内存中的文章列表
    UnfilteredArticles.set(
      UnfilteredArticles.get().map((a) =>
        a.id === article.id ? { ...a, status: newStatus } : a,
      ),
    );

    // 更新未读计数状态
    await updateUnreadCount(article.feedId);
  } catch (err) {
    console.error("更新文章状态失败:", err);
    throw err;
  }
}
// 更新未读计数状态
export async function updateUnreadCount(feedId) {
  try {
    const count = await storage.getUnreadCount(feedId);
    const currentCounts = unreadCounts.get();
    unreadCounts.set({
      ...currentCounts,
      [feedId]: count,
    });
  } catch (err) {
    console.error("更新未读计数失败:", err);
  }
}

// 更新文章星标状态的函数
export async function updateArticleStarred(article) {
  try {
    if (navigator.onLine) {
      // 更新 miniflux 文章星标状态
      await minifluxAPI.updateEntryStarred(article);
    }

    const newStarred = !article.starred;

    // 更新数据库中的文章星标状态
    await storage.addArticles([
      {
        ...article,
        starred: newStarred,
      },
    ]);

    // 更新内存中的文章列表
    UnfilteredArticles.set(
      UnfilteredArticles.get().map((a) =>
        a.id === article.id ? { ...a, starred: newStarred } : a,
      ),
    );

    // 更新收藏计数
    const count = await storage.getStarredCount(article.feedId);
    const currentCounts = starredCounts.get();
    starredCounts.set({
      ...currentCounts,
      [article.feedId]: count,
    });
  } catch (err) {
    console.error("更新文章星标状态失败:", err);
    throw err;
  }
}

