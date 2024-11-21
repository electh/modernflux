import { useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { filter } from "@/stores/articlesStore.js";
import { feeds } from "@/stores/feedsStore.js";
import MarkAllReadButton from "./MarkAllReadButton";

export default function ArticleListHeader() {
  const { feedId, categoryId } = useParams();
  const $filter = useStore(filter);
  const $feeds = useStore(feeds);

  // 获取标题文本
  const getTitleText = () => {
    if (feedId) {
      const feed = $feeds.find(f => f.id === parseInt(feedId));
      return feed?.title || "未知订阅源";
    }
    
    if (categoryId) {
      const feed = $feeds.find(f => f.categoryId === parseInt(categoryId));
      return feed?.categoryName || "未知分类";
    }

    switch ($filter) {
      case "unread":
        return "未读";
      case "starred":
        return "收藏";
      default:
        return "全部文章";
    }
  };

  return (
    <div className="article-list-header absolute top-0 bg-sidebar/80 backdrop-blur-sm w-full px-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="my-3" />
        <h1 className="text-sm font-medium truncate">{getTitleText()}</h1>
        <div className="ml-auto">
          <MarkAllReadButton />
        </div>
      </div>
      <Separator className="w-auto" />
    </div>
  );
}
