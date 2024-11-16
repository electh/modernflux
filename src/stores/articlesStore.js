import { atom } from "nanostores";
import storage from "../db/storage";
import minifluxAPI from "../api/miniflux";
import { starredCounts, unreadCounts } from "./feedsStore.js";

export const filteredArticles = atom([]);
export const activeArticle = atom(null);
export const loading = atom(false);
export const error = atom(null);
export const filter = atom("all");

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

    // 根据筛选条件过滤文章
    let filtered = articles;
    switch (filter.get()) {
      case "unread":
        filtered = articles.filter((article) => article.status !== "read");
        break;
      case "starred":
        filtered = articles.filter((article) => article.starred);
        break;
    }

    // 按发布时间倒序排序
    const sortedArticles = filtered.sort(
      (a, b) => new Date(b.published_at) - new Date(a.published_at),
    );

    filteredArticles.set(sortedArticles);
  } catch (err) {
    console.error("加载文章失败:", err);
    error.set("加载文章失败");
  } finally {
    loading.set(false);
  }
}

// 更新文章未读状态
export async function updateArticleStatus(article) {
  const newStatus = article.status === "read" ? "unread" : "read";
  
  // 乐观更新UI
  filteredArticles.set(
    filteredArticles.get().map((a) =>
      a.id === article.id ? { ...a, status: newStatus } : a
    )
  );

  try {
    // 并行执行在线和本地更新
    const updates = [
      // 如果在线则更新服务器
      navigator.onLine && minifluxAPI.updateEntryStatus(article),
      // 更新本地数据库
      storage.addArticles([{
        ...article,
        status: newStatus,
      }]),
      // 更新未读计数
      (async () => {
        const count = await storage.getUnreadCount(article.feedId);
        const currentCounts = unreadCounts.get();
        unreadCounts.set({
          ...currentCounts,
          [article.feedId]: count,
        });
      })()
    ].filter(Boolean);

    await Promise.all(updates);
  } catch (err) {
    // 发生错误时回滚UI状态
    filteredArticles.set(
      filteredArticles.get().map((a) =>
        a.id === article.id ? { ...a, status: article.status } : a
      )
    );
    console.error("更新文章状态失败:", err);
    throw err;
  }
}

// 更新文章收藏状态
export async function updateArticleStarred(article) {
  const newStarred = !article.starred;

  // 乐观更新UI
  filteredArticles.set(
    filteredArticles.get().map((a) =>
      a.id === article.id ? { ...a, starred: newStarred } : a
    )
  );

  try {
    // 并行执行在线和本地更新
    const updates = [
      // 如果在线则更新服务器
      navigator.onLine && minifluxAPI.updateEntryStarred(article),
      // 更新本地数据库
      storage.addArticles([{
        ...article,
        starred: newStarred,
      }]),
      // 更新收藏计数
      (async () => {
        const count = await storage.getStarredCount(article.feedId);
        const currentCounts = starredCounts.get();
        starredCounts.set({
          ...currentCounts,
          [article.feedId]: count,
        });
      })()
    ].filter(Boolean);

    await Promise.all(updates);
  } catch (err) {
    // 发生错误时回滚UI状态
    filteredArticles.set(
      filteredArticles.get().map((a) =>
        a.id === article.id ? { ...a, starred: article.starred } : a
      )
    );
    console.error("更新文章星标状态失败:", err);
    throw err;
  }
}
