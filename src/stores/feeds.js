import { atom } from 'nanostores'
import storage from '../db/storage'
import minifluxAPI from '../api/miniflux'

export const feeds = atom([])
export const selectedFeedId = atom(null)
export const newFeedUrl = atom('')
export const isAdding = atom(false)
export const error = atom(null)
export const unreadCounts = atom({})
export const starredCounts = atom({})

export async function loadFeeds() {
  try {
    await storage.init()
    const storedFeeds = await storage.getFeeds()
    feeds.set(storedFeeds || [])

    // 获取未读和收藏计数
    const unreadCount = {}
    const starredCount = {}
    for (const feed of storedFeeds) {
      unreadCount[feed.id] = await storage.getUnreadCount(feed.id)
      starredCount[feed.id] = await storage.getStarredCount(feed.id)
    }
    unreadCounts.set(unreadCount)
    starredCounts.set(starredCount)
  } catch (err) {
    error.set('加载订阅源失败')
    console.error(err)
  }
}

export async function addFeed(url) {
  if (!url.trim() || !navigator.onLine) return

  isAdding.set(true)
  error.set(null)

  try {
    const newFeed = await minifluxAPI.addFeed(url)
    await storage.addFeed({
      id: newFeed.id,
      title: newFeed.title,
      url: newFeed.feed_url,
      site_url: newFeed.site_url,
    })
    
    await loadFeeds()
    newFeedUrl.set('')
  } catch (err) {
    error.set('添加订阅源失败')
    console.error(err)
  } finally {
    isAdding.set(false)
  }
} 