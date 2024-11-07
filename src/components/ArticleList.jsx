import { useEffect } from 'react';
import { useStore } from '@nanostores/react'
import { 
  filteredArticles, 
  loading, 
  error, 
  filter,
  updateArticleStatus,
  loadArticles
} from '../stores/articles'
import '../styles/ArticleList.css'

const ArticleList = ({ feedId, onArticleSelect }) => {
  const $articles = useStore(filteredArticles)
  const $loading = useStore(loading)
  const $error = useStore(error)
  const $filter = useStore(filter)

  useEffect(() => {
    if (feedId) {
      loadArticles(feedId)
    }
  }, [feedId])

  const handleMarkStatus = async (article, e) => {
    e.stopPropagation()
    try {
      await updateArticleStatus(article)
    } catch (err) {
      console.error('更新文章状态失败:', err)
    }
  }

  if ($loading) {
    return <div className="article-list-loading">加载中...</div>;
  }

  if ($error) {
    return <div className="article-list-error">{$error}</div>;
  }

  return (
    <div className="article-list">
      <div className="article-list-header">
        <h2>文章列表</h2>
        <div className="article-filter">
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={$filter === 'all'}
              onChange={(e) => filter.set(e.target.value)}
            />
            全部
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="unread"
              checked={$filter === 'unread'}
              onChange={(e) => filter.set(e.target.value)}
            />
            未读
          </label>
        </div>
      </div>
      
      {$articles.length === 0 ? (
        <div className="no-articles">暂无文章</div>
      ) : (
        <ul className="articles">
          {$articles.map(article => (
            <li 
              key={article.id}
              className={`article-item ${article.status === 'read' ? 'read' : ''}`}
              onClick={() => onArticleSelect(article)}
            >
              <div className="article-content">
                <h3>{article.title}</h3>
                <div className="article-meta">
                  <span className="article-date">
                    {new Date(article.published_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                className="status-toggle"
                onClick={(e) => handleMarkStatus(article, e)}
              >
                {article.status === 'read' ? '标为未读' : '标为已读'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticleList; 