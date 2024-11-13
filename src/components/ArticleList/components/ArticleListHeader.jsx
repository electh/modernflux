import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Separator } from "@/components/ui/separator.jsx";

export default function ArticleListHeader() {
  return (
    <div className="absolute top-0 bg-sidebar/80 backdrop-blur-sm w-full px-2">
      <SidebarTrigger className="my-3" />
      <Separator className="w-auto" />
    </div>
  );
}
