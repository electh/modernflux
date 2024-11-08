import { useStore } from "@nanostores/react";
import { Accordion, AccordionItem, Listbox, ListboxItem } from "@nextui-org/react";
import { feeds, unreadCounts, starredCounts } from "../../../stores/feeds";
import { filter } from "../../../stores/articles";
import FeedIcon from "./FeedIcon";

const FeedListbox = ({ onSelect }) => {
  const $feeds = useStore(feeds);
  const $unreadCounts = useStore(unreadCounts);
  const $starredCounts = useStore(starredCounts);
  const $filter = useStore(filter);

  // 根据当前筛选条件过滤订阅源
  const filteredFeeds = $feeds.filter(feed => {
    switch($filter) {
      case 'starred':
        return $starredCounts[feed.id] > 0;
      case 'unread':
        return $unreadCounts[feed.id] > 0;
      default:
        return true;
    }
  });

  return (
    <Accordion
      className="px-0"
      itemClasses={{ heading: "px-3", title: "font-bold" }}
      isCompact
      defaultExpandedKeys={["1"]}
    >
      <AccordionItem key="1" aria-label="订阅源" title="订阅源">
        <Listbox
          aria-label="订阅源"
          onAction={(key) => onSelect(parseInt(key))}
        >
          {filteredFeeds.map((feed) => (
            <ListboxItem
              key={feed.id}
              className="feed-item"
              textValue={feed.title}
              classNames={{
                base: "w-full",
                content: "flex-1 min-w-0",
              }}
              startContent={<FeedIcon url={feed.site_url} />}
              endContent={
                ($filter === 'starred' ? 
                  $starredCounts[feed.id] : 
                  $unreadCounts[feed.id]) > 0 && (
                  <span className="text-small text-default-400 flex-shrink-0">
                    {$filter === 'starred' ? 
                      $starredCounts[feed.id] : 
                      $unreadCounts[feed.id]}
                  </span>
                )
              }
            >
              <span className="truncate">{feed.title}</span>
            </ListboxItem>
          ))}
        </Listbox>
      </AccordionItem>
    </Accordion>
  );
};

export default FeedListbox; 