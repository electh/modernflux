import { useState } from 'react';
import FeedList from './components/FeedList';
import ArticleList from './components/ArticleList';
import ArticleView from './components/ArticleView';
import './styles/App.css';
import { selectedArticle } from './stores/articles';

function App() {
  const [selectedFeedId, setSelectedFeedId] = useState(null);

  const handleFeedSelect = (feedId) => {
    setSelectedFeedId(feedId);
    selectedArticle.set(null);
  };

  const handleArticleSelect = (article) => {
    selectedArticle.set(article);
  };

  return (
    <div className="app">
      <FeedList 
        onFeedSelect={handleFeedSelect}
        selectedFeedId={selectedFeedId}
      />
      <ArticleList 
        feedId={selectedFeedId}
        onArticleSelect={handleArticleSelect}
      />
      <ArticleView 
        article={selectedArticle.get()}
      />
    </div>
  );
}

export default App;
