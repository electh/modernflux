import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import { forceSync, isOnline, isSyncing } from "@/stores/syncStore.js";
import { Loader2, RefreshCw } from "lucide-react";

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
      variant="ghost"
      size="icon"
      aria-label="同步"
    >
      {$isSyncing ? (
        <Loader2 className="animate-spin" />
      ) : (
        <RefreshCw className="h-5 w-5" />
      )}
    </Button>
  );
};

export default SyncButton;
