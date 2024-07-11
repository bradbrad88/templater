import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./features/dashboard/Dashboard";
import LoadTemplatePage from "./features/template/LoadTemplatePage";
import TemplatesPage from "./features/template/TemplatesPage";
import EditTemplate from "./features/template/EditTemplatePage";

const router = createBrowserRouter([
  {
    path: "",
    element: <Dashboard />,
    children: [
      { path: "" },
      {
        path: "templates",
        element: <TemplatesPage />,
        children: [
          {
            path: "",
            element: <LoadTemplatePage />,
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
