import { useStore } from "@nanostores/react";
import { starredCounts, unreadCounts } from "@/stores/feedsStore.js";
import { filter } from "@/stores/articlesStore.js";
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
import { Link } from "react-router-dom";

const ArticlesGroup = () => {
  const $unreadCounts = useStore(unreadCounts);
  const $starredCounts = useStore(starredCounts);
  const $filter = useStore(filter);
  const { isMobile, setOpenMobile } = useSidebar();

  // 根据筛选条件获取显示文本和计数
  const getDisplayInfo = () => {
    switch ($filter) {
      case "unread":
        return {
          icon: <CircleDot />,
          text: "未读",
          count: Object.values($unreadCounts).reduce(
            (sum, count) => sum + count,
            0,
          ),
        };
      case "starred":
        return {
          icon: <Star />,
          text: "收藏",
          count: Object.values($starredCounts).reduce(
            (sum, count) => sum + count,
            0,
          ),
        };
      default:
        return {
          icon: <Infinity />,
          text: "全部文章",
          count: Object.values($unreadCounts).reduce(
            (sum, count) => sum + count,
            0,
          ),
        };
    }
  };

  const { icon, text, count } = getDisplayInfo();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>文章</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
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
