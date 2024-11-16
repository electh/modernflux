export default function EmptyPlaceholder() {
  return (
    <div className="hidden sm:flex sm:flex-1 bg-sidebar p-2 h-screen">
      <div className="flex items-center w-full justify-center h-full text-muted-foreground">
        请选择要阅读的文章
      </div>
    </div>
  );
} 