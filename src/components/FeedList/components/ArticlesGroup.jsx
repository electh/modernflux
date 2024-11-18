import { useStore } from "@nanostores/react";
import { filter } from "@/stores/articlesStore.js";
import { totalStarredCount, totalUnreadCount } from "@/stores/feedsStore.js";
import { CircleDot, Infinity, Star } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.jsx";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const ArticlesGroup = () => {
  const $filter = useStore(filter);
  const $totalUnreadCount = useStore(totalUnreadCount);
  const $totalStarredCount = useStore(totalStarredCount);
  const { isMobile, setOpenMobile } = useSidebar();
  const { feedId, categoryId } = useParams();
  // 根据筛选条件获取显示文本和计数
  const getDisplayInfo = () => {
    switch ($filter) {
      case "unread":
        return {
          icon: <CircleDot />,
          text: "未读",
          count: $totalUnreadCount,
        };
      case "starred":
        return {
          icon: <Star />,
          text: "收藏",
          count: $totalStarredCount,
        };
      default:
        return {
          icon: <Infinity />,
          text: "全部文章",
          count: $totalUnreadCount,
        };
    }
  };

  const { icon, text, count } = getDisplayInfo();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>文章</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem
          className={cn(
            !feedId && !categoryId && "bg-sidebar-accent rounded-md",
          )}
        >
          <SidebarMenuButton asChild>
            <Link to="/" onClick={() => isMobile && setOpenMobile(false)}>
              {icon}
              <span>{text}</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuBadge>{count !== 0 && count}</SidebarMenuBadge>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default ArticlesGroup;
