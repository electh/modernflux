import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ArticleList from "@/components/ArticleList/ArticleList";
import ArticleView from "@/components/ArticleView/ArticleView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ArticleList />,
        children: [
          {
            path: "article/:articleId",
            element: <ArticleView />,
          },
        ],
      },
      {
        path: "feed/:feedId",
        element: <ArticleList />,
        children: [
          {
            path: "article/:articleId",
            element: <ArticleView />,
          },
        ],
      },
      {
        path: "category/:categoryName",
        element: <ArticleList />,
        children: [
          {
            path: "article/:articleId",
            element: <ArticleView />,
          },
        ],
      },
    ],
  },
]); 