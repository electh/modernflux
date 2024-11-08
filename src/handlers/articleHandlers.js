import { selectedArticle, updateArticleStatus } from '../stores/articles';

// 处理文章选择
export const handleArticleSelect = (article) => {
  selectedArticle.set(article);
};

// 处理文章状态更新
export const handleMarkStatus = async (article, e) => {
  if (e) {
    e.stopPropagation();
  }
  try {
    await updateArticleStatus(article);
  } catch (err) {
    console.error("更新文章状态失败:", err);
  }
}; 