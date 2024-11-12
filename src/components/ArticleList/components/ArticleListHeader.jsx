import { SidebarTrigger } from "@/components/ui/sidebar.jsx";

export default function ArticleListHeader() {
  return (
    <div className="border-b absolute top-0 bg-background/80 backdrop-blur-sm w-full z-10 py-3 px-2">
      <SidebarTrigger />
    </div>
  );
}
