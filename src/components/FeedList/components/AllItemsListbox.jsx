import { useStore } from "@nanostores/react";
import { selectedFeedId, unreadCounts, starredCounts } from "../../../stores/feeds";
import { filter } from "../../../stores/articles";

const AllItemsListbox = ({ onSelect }) => {
  const $selectedFeedId = useStore(selectedFeedId);
  const $unreadCounts = useStore(unreadCounts);
  const $starredCounts = useStore(starredCounts);
  const $filter = useStore(filter);

  // 根据筛选条件获取显示文本和计数
  const getDisplayInfo = () => {
    switch($filter) {
      case 'unread':
        return {
          text: "未读",
          count: Object.values($unreadCounts).reduce((sum, count) => sum + count, 0)
        };
      case 'starred':
        return {
          text: "收藏",
          count: Object.values($starredCounts).reduce((sum, count) => sum + count, 0)
        };
      default:
        return {
          text: "全部文章",
          count: Object.values($unreadCounts).reduce((sum, count) => sum + count, 0)
        };
    }
  };

  const { text, count } = getDisplayInfo();

  return (
    <div className="w-full">
      <button
        onClick={() => onSelect(null)}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground ${
          $selectedFeedId === null ? "bg-accent text-accent-foreground" : ""
        }`}
      >
        <span className="font-bold">{text}</span>
        {count > 0 && (
          <span className="text-sm text-muted-foreground">
            {count}
          </span>
        )}
      </button>
    </div>
  );
};

export default AllItemsListbox; 