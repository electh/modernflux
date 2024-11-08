import { atom, computed } from 'nanostores'
import storage from '../db/storage'
import minifluxAPI from '../api/miniflux'
import { unreadCounts } from './feeds'

export const articles = atom([])
export const selectedArticle = atom(null)
export const loading = atom(false)
export const error = atom(null)
export const filter = atom('all')

// 计算过滤后的文章列表
export const filteredArticles = computed(
  [articles, filter],
  (articles, filter) => {
    return filter === 'unread'
      ? articles.filter(article => article.status !== 'read') 
      : articles
  }
)

// 从数据库加载文章列表
export async function loadArticles(feedId) {
  loading.set(true)
  error.set(null)
  
  try {
    await storage.init()
    const loadedArticles = await storage.getArticles(feedId)
    articles.set(loadedArticles || [])
  } catch (err) {
    console.error('加载文章失败:', err)
    error.set('加载文章失败')
  } finally {
    loading.set(false)
  }
}

// 更新文章状态
export async function updateArticleStatus(article) {
  try {
    if (navigator.onLine) {
      // 更新miniflux文章状态
      await minifluxAPI.updateEntryStatus(article)
    }
    
    const newStatus = article.status === 'read' ? 'unread' : 'read'
    
    // 先更新数据库中的文章状态
    await storage.addArticles([{
      ...article,
      status: newStatus
    }])
    
    // 更新内存中的文章列表
    articles.set(
      articles.get().map(a => 
        a.id === article.id 
          ? { ...a, status: newStatus }
          : a
      )
    )

    // 更新未读计数状态
    await updateUnreadCount(article.feedId)
  } catch (err) {
    console.error('更新文章状态失败:', err)
    throw err
  }
}

// 更新未读计数状态
export async function updateUnreadCount(feedId) {
  try {
    const count = await storage.getUnreadCount(feedId)
    const currentCounts = unreadCounts.get()
    unreadCounts.set({
      ...currentCounts,
      [feedId]: count
    })
  } catch (err) {
    console.error('更新未读计数失败:', err)
  }
} 