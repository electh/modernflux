import {
  ArrowLeft,
  Circle,
  CircleDot,
  Forward,
  Reply,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  handleMarkStatus,
  handleToggleStar,
} from "@/handlers/articleHandlers.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { activeArticle, filteredArticles } from "@/stores/articlesStore";

export default function ActionButtons() {
  const navigate = useNavigate();
  const $articles = useStore(filteredArticles);
  const $activeArticle = useStore(activeArticle);
  // 获取当前文章在列表中的索引
  const currentIndex = $articles.findIndex((a) => a.id === $activeArticle?.id);

  // 获取当前路径并去掉 article 部分
  const basePath = window.location.pathname.split("/article/")[0];

  // 处理关闭按钮点击
  const handleClose = () => {
    navigate(basePath || "/");
  };

  // 处理上一篇按钮点击
  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const prevArticle = $articles[currentIndex - 1];
      if (prevArticle.status !== "read") {
        await handleMarkStatus(prevArticle);
      }
      navigate(`${basePath}/article/${prevArticle.id}`);
    }
  };

  // 处理下一篇按钮点击
  const handleNext = async () => {
    if (currentIndex < $articles.length - 1) {
      const nextArticle = $articles[currentIndex + 1];
      if (nextArticle.status !== "read") {
        await handleMarkStatus(nextArticle);
      }
      navigate(`${basePath}/article/${nextArticle.id}`);
    }
  };

  return (
    <div className="border-b absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm w-full p-2">
      <div className="flex items-center space-between">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={false}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">关闭</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>关闭</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                disabled={currentIndex <= 0}
              >
                <Reply className="h-4 w-4" />
                <span className="sr-only">上一篇</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>上一篇</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= $articles.length - 1}
              >
                <Forward className="h-4 w-4" />
                <span className="sr-only">下一篇</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>下一篇</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleMarkStatus($activeArticle, e)}
              >
                {$activeArticle?.status === "read" ? (
                  <Circle className="size-4" />
                ) : (
                  <CircleDot className="size-4" />
                )}
                <span className="sr-only">
                  {$activeArticle?.status === "read"
                    ? "标记为未读"
                    : "标记为已读"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {$activeArticle?.status === "read" ? "标记为未读" : "标记为已读"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleToggleStar($activeArticle, e)}
              >
                <Star
                  className={`size-4 ${$activeArticle?.starred ? "fill-current" : ""}`}
                />
                <span className="sr-only">
                  {$activeArticle?.starred ? "取消收藏" : "收藏"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {$activeArticle?.starred ? "取消收藏" : "收藏"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
