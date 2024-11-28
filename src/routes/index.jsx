import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import ArticleList from "@/components/ArticleList/ArticleList";
import ArticleView from "@/components/ArticleView/ArticleView";
import LoginPage from "@/pages/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
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
        path: "category/:categoryId",
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
], routerConfig); 