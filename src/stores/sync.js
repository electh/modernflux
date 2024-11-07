import { atom } from 'nanostores'
import minifluxAPI from '../api/miniflux'
import storage from '../db/storage'

export const isOnline = atom(navigator.onLine)
export const isSyncing = atom(false)
export const lastSync = atom(null)
export const error = atom(null)

// 全局定时器变量
let syncInterval = null;

// 监听在线状态
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => isOnline.set(true))
  window.addEventListener('offline', () => isOnline.set(false))
}

// 同步订阅源
async function syncFeeds() {
  try {
    const feeds = await minifluxAPI.getFeeds()
    await storage.init()
    
    for (const feed of feeds) {
      await storage.addFeed({
        id: feed.id,
        title: feed.title,
        url: feed.feed_url,
        site_url: feed.site_url,
      })
    }
    return feeds
  } catch (error) {
    console.error('同步订阅源失败:', error)
    throw error
  }
}

// 同步文章
async function syncEntries() {
  try {
    const feeds = await storage.getFeeds()
    
    for (const feed of feeds) {
      const entries = await minifluxAPI.getFeedEntries(feed.id)
      await storage.addArticles(entries.map(entry => ({
        id: entry.id,
        feedId: feed.id,
        title: entry.title,
        url: entry.url,
        content: entry.content,
        status: entry.status,
        starred: entry.starred,
        published_at: entry.published_at,
        created_at: entry.created_at
      })))
    }
  } catch (error) {
    console.error('同步文章失败:', error)
    throw error
  }
}

// 执行完整同步
export async function sync() {
  if (!isOnline.get() || isSyncing.get()) return

  isSyncing.set(true)
  error.set(null)

  try {
    await syncFeeds()
    await syncEntries()
    lastSync.set(new Date())
  } catch (err) {
    error.set(err)
  } finally {
    isSyncing.set(false)
  }
}

// 自动同步
if (typeof window !== 'undefined') {
  async function performSync() {
    if (isOnline.get() && !isSyncing.get()) {
      try {
        const lastSyncTime = await storage.getLastSyncTime();
        const now = new Date();
        if (!lastSyncTime || (now - lastSyncTime) > 5 * 60 * 1000) {
          await sync();
          await storage.setLastSyncTime(now);
        }
      } catch (error) {
        console.error('自动同步失败:', error);
      }
    }
  }

  // 初始同步
  performSync();

  // 设置定时器
  syncInterval = setInterval(performSync, 5 * 60 * 1000);

  // 清理函数
  window.addEventListener('beforeunload', () => {
    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;
    }
  });
} 