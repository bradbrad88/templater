import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import Dashboard from "./features/dashboard/Dashboard";
import RootErrorElement from "./errors/RootErrorElement";

import TemplatesPage from "./features/template/TemplatesPage";
import TemplatesDashboard from "./features/template/TemplatesDashboard";
import EditTemplate from "./features/template/EditTemplatePage";

const router = createBrowserRouter([
  {
    path: "",
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
            element: <EditTemplate />,
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
