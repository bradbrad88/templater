import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import Dashboard from "./features/dashboard/Dashboard";
import RootErrorElement from "./errors/RootErrorElement";

import TemplatesPage from "./features/template/TemplatesPage";
import TemplatesDashboard from "./features/template/TemplatesDashboard";
import ViewTemplate from "features/template/ViewTemplate";
import PreviewTemplate from "features/template/PreviewTemplate";
import TemplateEditor from "features/template/TemplateEditor";
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
            path: ":templateId",
            element: <ViewTemplate />,
            children: [
              { path: "", element: <TemplateEditor /> },
              { path: "preview", element: <PreviewTemplate /> },
            ],
          },
          {},
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
