import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import {
  BannerPage,
  CategoryPage,
  CreatePostPage,
  CreateUpdateCategoryPage,
  ErrorPage,
  HomePage,
  LoginPage,
  NewsPage,
} from "./components/pages";
import ApplicationForm from "./components/pages/ApplicationForm";
import { Toaster } from "sonner";
import AuthProvider from "./components/context/AuthProvider";
import PartnerPage from "./components/pages/PartnerPage";

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/banner",
          element: <BannerPage />,
        },
        {
          path: "/category",
          element: <CategoryPage />,
        },
        {
          path: "/category/create",
          element: <CreateUpdateCategoryPage />,
        },
        {
          path: "/category/create/:parentId",
          element: <CreateUpdateCategoryPage />,
        },
        {
          path: "/category/update/:id",
          element: <CreateUpdateCategoryPage />,
        },
        {
          path: "/partner",
          element: <PartnerPage />,
        },
        {
          path: "post",
          element: <NewsPage />,
        },
        {
          path: "/post/create",
          element: <CreatePostPage />,
        },
        {
          path: "/post/edit/:id",
          element: <CreatePostPage />,
        },
        {
          path: "/application-form",
          element: <ApplicationForm />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}

export default App;
