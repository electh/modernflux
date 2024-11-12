import ArticleCard from "./ArticleCard";

export default function ArticleListContent({ articles }) {
  return (
    <div className="flex-1 overflow-auto py-12">
      {articles.length === 0 ? (
        <div className="no-articles">暂无文章</div>
      ) : (
        <ul className="articles">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}
    </div>
  );
}
