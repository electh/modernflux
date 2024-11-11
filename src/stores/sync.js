import { atom } from "nanostores";
import minifluxAPI from "../api/miniflux";
import storage from "../db/storage";

// 在线状态
export const isOnline = atom(navigator.onLine);
// 同步状态
export const isSyncing = atom(false);
// 最后同步时间
export const lastSync = atom(null);
// 错误信息
export const error = atom(null);

// 全局定时器变量
let syncInterval = null;

// 监听在线状态
if (typeof window !== "undefined") {
  window.addEventListener("online", () => isOnline.set(true));
  window.addEventListener("offline", () => isOnline.set(false));
}

// 从miniflux同步订阅源并保存到数据库
async function syncFeeds() {
  try {
    // 获取服务器上的所有订阅源
    const serverFeeds = await minifluxAPI.getFeeds();
    await storage.init();
    
    // 获取本地数据库中的所有订阅源
    const localFeeds = await storage.getFeeds();
    
    // 找出需要删除的订阅源（在本地存在但服务器上已不存在）
    const serverFeedIds = new Set(serverFeeds.map(feed => feed.id));
    const feedsToDelete = localFeeds.filter(feed => !serverFeedIds.has(feed.id));
    
    // 删除该订阅源的所有文章
    for (const feed of feedsToDelete) {
      await storage.deleteArticlesByFeedId(feed.id);
    }

    await storage.deleteAllFeeds();

    // 重置现有订阅源
    for (const feed of serverFeeds) {
      await storage.addFeed({
        id: feed.id,
        title: feed.title,
        url: feed.feed_url,
        site_url: feed.site_url,
        categoryId: feed.category.id,
        categoryName: feed.category.title
      });
    }
    
    return serverFeeds;
  } catch (error) {
    console.error("同步订阅源失败:", error);
    throw error;
  }
}

// 从miniflux同步文章并保存到数据库
async function syncEntries() {
  try {
    const feeds = await storage.getFeeds();

    for (const feed of feeds) {
      const entries = await minifluxAPI.getFeedEntries(feed.id);
      await storage.addArticles(
        entries.map((entry) => ({
          id: entry.id,
          feedId: feed.id,
          title: entry.title,
          url: entry.url,
          content: entry.content,
          status: entry.status,
          starred: entry.starred,
          published_at: entry.published_at,
          created_at: entry.created_at,
        })),
      );
    }
  } catch (error) {
    console.error("同步文章失败:", error);
    throw error;
  }
}

// 执行完整同步
export async function sync() {
  // 如果网络不在线或正在同步，则不执行同步
  if (!isOnline.get() || isSyncing.get()) return;

  // 设置同步状态为正在同步
  isSyncing.set(true);
  error.set(null);

  try {
    // 同步订阅源并保存到数据库
    await syncFeeds();
    // 同步文章并保存到数据库
    await syncEntries();
    // 设置最后同步时间
    lastSync.set(new Date());
  } catch (err) {
    error.set(err);
  } finally {
    // 设置同步状态为未同步
    isSyncing.set(false);
  }
}

// 自动同步
if (typeof window !== "undefined") {
  async function performSync() {
    // 如果网络在线且未正在同步，则执行同步
    if (isOnline.get() && !isSyncing.get()) {
      try {
        // 获取最后同步时间
        const lastSyncTime = await storage.getLastSyncTime();
        // 获取当前时间
        const now = new Date();
        // 如果最后同步时间不存在或距离上次同步时间超过5分钟，则执行同步
        if (!lastSyncTime || now - lastSyncTime > 5 * 60 * 1000) {
          // 执行完整同步
          await sync();
          // 更新最后同步时间
          await storage.setLastSyncTime(now);
        }
      } catch (error) {
        console.error("自动同步失败:", error);
      }
    }
  }

  // 初始同步
  performSync();

  // 设置定时器
  syncInterval = setInterval(performSync, 5 * 60 * 1000);

  // 清理函数
  window.addEventListener("beforeunload", () => {
    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;
    }
  });
}

// 手动强制同步
export async function forceSync() {
  if (isOnline.get() && !isSyncing.get()) {
    try {
      await sync();
      const now = new Date();
      await storage.setLastSyncTime(now);
    } catch (error) {
      console.error("强制同步失败:", error);
    }
  }
}
