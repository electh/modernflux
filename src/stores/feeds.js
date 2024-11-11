import { atom, computed } from 'nanostores'
import storage from '../db/storage'

export const feeds = atom([])
export const selectedFeedId = atom(null)
export const newFeedUrl = atom('')
export const error = atom(null)
export const unreadCounts = atom({})
export const starredCounts = atom({})

// 计算当前选中的分组名称
export const selectedCategoryName = computed(
  [feeds, selectedFeedId],
  (feeds, selectedFeedId) => {
    if (!selectedFeedId) return null
    const selectedFeed = feeds.find(feed => feed.id === selectedFeedId)
    return selectedFeed?.categoryName || "未分类"
  }
)

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