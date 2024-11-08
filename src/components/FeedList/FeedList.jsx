import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  addFeed,
  error,
  feeds,
  isAdding,
  loadFeeds,
  newFeedUrl,
  unreadCounts,
} from "../../stores/feeds.js";
import { forceSync, isOnline, isSyncing, lastSync } from "../../stores/sync.js";
import "./FeedList.css";
import { Button } from "@nextui-org/react";

const FeedList = ({ onFeedSelect, selectedFeedId }) => {
  const $feeds = useStore(feeds);
  const $newFeedUrl = useStore(newFeedUrl);
  const $isAdding = useStore(isAdding);
  const $error = useStore(error);
  const $unreadCounts = useStore(unreadCounts);
  const $isOnline = useStore(isOnline);
  const $lastSync = useStore(lastSync);
  const $isSyncing = useStore(isSyncing);

  useEffect(() => {
    loadFeeds();
  }, [$lastSync]);

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (err) {
      console.error("强制同步失败:", err);
    }
  };

  const handleAddFeed = async (e) => {
    e.preventDefault();
    await addFeed($newFeedUrl);
  };

  return (
    <div className="feed-list">
      <h2>订阅源</h2>
      <Button onClick={handleForceSync} disabled={$isSyncing || !$isOnline}>
        {$isSyncing ? "同步中..." : "同步"}
      </Button>
      <form onSubmit={handleAddFeed} className="add-feed-form">
        <input
          type="url"
          value={$newFeedUrl}
          onChange={(e) => newFeedUrl.set(e.target.value)}
          placeholder="输入RSS订阅源URL"
          disabled={!$isOnline || $isAdding}
        />
        <button
          type="submit"
          disabled={!$isOnline || $isAdding || !$newFeedUrl.trim()}
        >
          {$isAdding ? "添加中..." : "添加"}
        </button>
      </form>

      {$error && <div className="error-message">{$error}</div>}

      <ul className="feeds">
        {$feeds.map((feed) => (
          <li
            key={feed.id}
            className={`feed-item ${selectedFeedId === feed.id ? "selected" : ""}`}
            onClick={() => onFeedSelect(feed.id)}
          >
            <div className="feed-info">
              <h3>{feed.title}</h3>
              {feed.site_url && (
                <span className="feed-url">
                  {new URL(feed.site_url).hostname}
                </span>
              )}
            </div>
            {$unreadCounts[feed.id] > 0 && (
              <span className="unread-count">{$unreadCounts[feed.id]}</span>
            )}
          </li>
        ))}
      </ul>

      {!$isOnline && <div className="offline-notice">当前处于离线模式</div>}
    </div>
  );
};

export default FeedList;
