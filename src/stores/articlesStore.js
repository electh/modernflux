import { atom } from "nanostores";
import storage from "../db/storage";
import minifluxAPI from "../api/miniflux";
import { starredCounts, unreadCounts } from "./feedsStore.js";
import { forceSync } from "@/stores/syncStore.js";
import { settingsState } from "./settingsStore";

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
    const showHiddenFeeds = settingsState.get().showHiddenFeeds;
    let targetFeeds;
    let articles = [];

    // 根据类型确定要加载的订阅源
    if (type === "category" && sourceId) {
      // 获取分类下的所有订阅源
      targetFeeds = feeds.filter(
        (feed) =>
          feed.categoryId === parseInt(sourceId) &&
          (showHiddenFeeds || !feed.hide_globally),
      );
    } else if (sourceId) {
      // 获取单个订阅源
      targetFeeds = feeds.filter(
        (feed) =>
          feed.id === parseInt(sourceId) &&
          (showHiddenFeeds || !feed.hide_globally),
      );
    } else {
      // 获取所有订阅源
      targetFeeds = showHiddenFeeds
        ? feeds
        : feeds.filter((feed) => !feed.hide_globally);
    }

    // 获取所有目标订阅的文章
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
    const sortedArticles = filtered.sort((a, b) => {
      const direction = settingsState.get().sortDirection === "desc" ? 1 : -1;
      return direction * (new Date(b.created_at) - new Date(a.created_at));
    });

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
    filteredArticles
      .get()
      .map((a) => (a.id === article.id ? { ...a, status: newStatus } : a)),
  );

  try {
    // 并行执行在线和本地更新
    const updates = [
      // 如果在线则更新服务器
      navigator.onLine && minifluxAPI.updateEntryStatus(article),
      // 更新本地数据库
      storage.addArticles([
        {
          ...article,
          status: newStatus,
        },
      ]),
      // 更新未读计数
      (async () => {
        const count = await storage.getUnreadCount(article.feedId);
        const currentCounts = unreadCounts.get();
        unreadCounts.set({
          ...currentCounts,
          [article.feedId]: count,
        });
      })(),
    ].filter(Boolean);

    await Promise.all(updates);
  } catch (err) {
    // 发生错误时回滚UI状态
    filteredArticles.set(
      filteredArticles
        .get()
        .map((a) =>
          a.id === article.id ? { ...a, status: article.status } : a,
        ),
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
    filteredArticles
      .get()
      .map((a) => (a.id === article.id ? { ...a, starred: newStarred } : a)),
  );

  try {
    // 并行执行在线和本地更新
    const updates = [
      // 如果在线则更新服务器
      navigator.onLine && minifluxAPI.updateEntryStarred(article),
      // 更新本地数据库
      storage.addArticles([
        {
          ...article,
          starred: newStarred,
        },
      ]),
      // 更新收藏计数
      (async () => {
        const count = await storage.getStarredCount(article.feedId);
        const currentCounts = starredCounts.get();
        starredCounts.set({
          ...currentCounts,
          [article.feedId]: count,
        });
      })(),
    ].filter(Boolean);

    await Promise.all(updates);
  } catch (err) {
    // 发生错误时回滚UI状态
    filteredArticles.set(
      filteredArticles
        .get()
        .map((a) =>
          a.id === article.id ? { ...a, starred: article.starred } : a,
        ),
    );
    console.error("更新文章星标状态失败:", err);
    throw err;
  }
}

// 改进后的 markAllAsRead 函数
export async function markAllAsRead(type = "all", id = null) {
  // 获取受影响的文章
  const articles = filteredArticles.get();
  const affectedArticles = articles.filter(
    (article) => article.status !== "read",
  );

  // 如果没有需要标记的文章，直接返回
  if (affectedArticles.length === 0) {
    return;
  }

  // 按 feedId 分组需要更新的文章
  const articlesByFeed = affectedArticles.reduce((acc, article) => {
    acc[article.feedId] = acc[article.feedId] || [];
    acc[article.feedId].push(article);
    return acc;
  }, {});

  // 乐观更新UI
  filteredArticles.set(
    articles.map((article) => ({
      ...article,
      status: "read",
    })),
  );

  try {
    // 强制同步以确保本地数据是最新的
    await forceSync();

    // 并行执行更新
    await Promise.all(
      [
        // 更新服务器
        navigator.onLine && minifluxAPI.markAllAsRead(type, id),

        // 更新本地数据库
        storage.addArticles(
          affectedArticles.map((article) => ({
            ...article,
            status: "read",
          })),
        ),

        // 批量更新未读计数
        (async () => {
          const counts = {};
          const feedIds = Object.keys(articlesByFeed);

          // 并行获取所有订阅源的未读计数
          const unreadCountsArray = await Promise.all(
            feedIds.map((feedId) => storage.getUnreadCount(feedId)),
          );

          // 组装未读计数对象
          feedIds.forEach((feedId, index) => {
            counts[feedId] = unreadCountsArray[index];
          });

          unreadCounts.set({
            ...unreadCounts.get(),
            ...counts,
          });
        })(),
      ].filter(Boolean),
    );
  } catch (err) {
    // 发生错误时回滚UI状态
    filteredArticles.set(articles);
    console.error("标记已读失败:", err);
    throw err;
  }
}
