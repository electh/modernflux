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

// 从数据库加载文章列表
export async function loadArticles(feedId) {
  loading.set(true);
  error.set(null);

  try {
    await storage.init();
    const loadedArticles = await storage.getArticles(feedId);
    // 按发布时间倒序排序
    const sortedArticles =
      loadedArticles?.sort((a, b) => {
        return new Date(b.published_at) - new Date(a.published_at);
      }) || [];
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

export async function loadArticlesByCategory(categoryId) {
  loading.set(true);
  error.set(null);

  try {
    await storage.init();
    // 先获取该分类下的所有订阅源
    const feeds = await storage.getFeeds();
    const categoryFeeds = feeds.filter(
      (feed) => feed.categoryId === parseInt(categoryId),
    );

    // 获取所有订阅源的文章
    let allArticles = [];
    for (const feed of categoryFeeds) {
      const articles = await storage.getArticles(feed.id);
      allArticles = [...allArticles, ...articles];
    }

    // 按时间排序
    const sortedArticles = allArticles.sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at),
    );

    UnfilteredArticles.set(sortedArticles);
  } catch (err) {
    console.error("加载分类文章失败:", err);
    error.set("加载分类文章失败");
  } finally {
    loading.set(false);
  }
}
