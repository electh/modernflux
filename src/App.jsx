import FeedList from "./components/FeedList/FeedList.jsx";
import ArticleList from "./components/ArticleList/ArticleList.jsx";
import ArticleView from "./components/ArticleView/ArticleView.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <FeedList />
      <ArticleList />
      <ArticleView />
    </div>
  );
}

export default App;
