import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import Dashboard from "./features/dashboard/Dashboard";
import RootErrorElement from "./errors/RootErrorElement";

import TemplatesPage from "./features/template/TemplatesPage";
import TemplatesDashboard from "./features/template/TemplatesDashboard";
import ViewTemplate from "features/template/ViewTemplate";
import TemplateErrorBoundary from "features/template/TemplateErrorBoundary";
import TemplateEditor from "features/template/TemplateEditor";
import PreviewTemplate from "features/template/PreviewTemplate";
import LoadWorkbook from "features/templateData/LoadWorkbook";

import Fonts from "webfontloader";
import { googleFonts } from "./config/fonts";

Fonts.load({ google: { families: googleFonts } });

const router = createBrowserRouter([
  {
    path: "*",
    element: <Dashboard />,
    errorElement: <RootErrorElement />,
    children: [
      { path: "", element: <Navigate to={"/templates"} /> },
      {
        path: "templates",
        element: <TemplatesPage />,
        children: [
          {
            path: "",
            element: <TemplatesDashboard />,
          },
          {
            path: ":templateId/*",
            errorElement: <TemplateErrorBoundary />,
            element: <ViewTemplate />,
            children: [
              {
                path: "edit",
                element: <TemplateEditor />,
              },
              {
                path: "data",
                element: <LoadWorkbook />,
              },
              {
                path: "preview",
                element: <PreviewTemplate />,
              },
              {
                path: "*",
                element: <Navigate to={"edit"} />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
