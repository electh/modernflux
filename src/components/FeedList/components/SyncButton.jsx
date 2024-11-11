import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import { forceSync, isOnline, isSyncing } from "@/stores/sync.js";
import { RefreshCw } from "lucide-react";

const SyncButton = () => {
  const $isOnline = useStore(isOnline);
  const $isSyncing = useStore(isSyncing);

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (err) {
      console.error("强制同步失败:", err);
    }
  };

  return (
    <Button
      onClick={handleForceSync}
      disabled={$isSyncing || !$isOnline}
      variant="light"
      isIconOnly
      isLoading={$isSyncing}
      aria-label="同步"
    >
      <RefreshCw className="h-5 w-5" />
    </Button>
  );
};

export default SyncButton;
