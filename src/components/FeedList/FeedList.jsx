import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { loadFeeds, selectedFeedId } from "@/stores/feeds.js";
import { lastSync } from "@/stores/sync.js";
import "./FeedList.css";
import { selectedArticle } from "@/stores/articles.js";
import SyncButton from "./components/SyncButton";
import AllItemsListbox from "./components/AllItemsListbox";
import FeedListbox from "./components/FeedListbox";

const FeedList = () => {
  const $lastSync = useStore(lastSync);

  useEffect(() => {
    loadFeeds();
  }, [$lastSync]);

  const handleFeedSelect = (feedId) => {
    selectedFeedId.set(feedId);
    selectedArticle.set(null);
  };

  return (
    <div className="feed-list px-2 py-2">
      <h2>订阅源</h2>
      <SyncButton />
      <AllItemsListbox onSelect={handleFeedSelect} />
      <FeedListbox onSelect={handleFeedSelect} />
    </div>
  );
};

export default FeedList;
