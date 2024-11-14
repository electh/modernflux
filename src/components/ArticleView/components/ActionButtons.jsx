import { ArrowLeft, CircleDot, Forward, Reply, Star } from "lucide-react";
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
import { filteredArticles } from "@/stores/articlesStore";

export default function ActionButtons({ article }) {
  const navigate = useNavigate();
  const $articles = useStore(filteredArticles);
  
  // 获取当前文章在列表中的索引
  const currentIndex = $articles.findIndex((a) => a.id === article.id);
  
  // 处理关闭按钮点击
  const handleClose = () => {
    // 获取当前路径并去掉 article 部分
    const basePath = window.location.pathname.split("/article/")[0];
    navigate(basePath || "/");
  };

  // 处理上一篇按钮点击 
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevArticle = $articles[currentIndex - 1];
      navigate(`/article/${prevArticle.id}`);
    }
  };

  // 处理下一篇按钮点击
  const handleNext = () => {
    if (currentIndex < $articles.length - 1) {
      const nextArticle = $articles[currentIndex + 1];
      navigate(`/article/${nextArticle.id}`);
    }
  };

  return (
    <div className="border-b absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm w-full z-10 p-2">
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
                onClick={(e) => handleToggleStar(article, e)}
              >
                <Star className={`h-4 w-4 ${article.starred ? "fill-current" : ""}`} />
                <span className="sr-only">收藏</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>收藏</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleMarkStatus(article, e)}
              >
                <CircleDot className={`h-4 w-4 ${article.status === "read" ? "fill-current" : ""}`} />
                <span className="sr-only">已读</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>已读</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
