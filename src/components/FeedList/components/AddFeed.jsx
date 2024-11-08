import { useStore } from "@nanostores/react";
import { addFeed, isAdding, newFeedUrl } from "../../../stores/feeds.js";
import { isOnline } from "../../../stores/sync.js";

const AddFeed = () => {
  const $newFeedUrl = useStore(newFeedUrl);
  const $isAdding = useStore(isAdding);
  const $isOnline = useStore(isOnline);

  const handleAddFeed = async (e) => {
    e.preventDefault();
    await addFeed($newFeedUrl);
  };

  return (
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
  );
};

export default AddFeed;
