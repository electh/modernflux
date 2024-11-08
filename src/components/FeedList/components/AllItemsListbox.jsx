import { useStore } from "@nanostores/react";
import { Listbox, ListboxItem } from "@nextui-org/react";
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
    <Listbox aria-label="Feeds" onAction={() => onSelect(null)}>
      <ListboxItem
        key={0}
        className={`feed-item ${$selectedFeedId === null ? "selected" : ""}`}
        textValue={text}
        endContent={
          count > 0 && (
            <span className="text-small text-default-400">
              {count}
            </span>
          )
        }
      >
        <span className="text-foreground text-medium font-bold">{text}</span>
      </ListboxItem>
    </Listbox>
  );
};

export default AllItemsListbox; 