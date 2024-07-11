import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { TemplateProvider } from "../template/templateContext";

function Dashboard() {
  return (
    <TemplateProvider>
      <div className="h-[64px]">
        <Header />
      </div>

      <div
        className="grid grid-rows-1 grid-cols-[330px,_minmax(0,_1fr)] h-[calc(100vh_-_64px)]"
        style={{ height: "screen" }}
      >
        <Sidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </TemplateProvider>
  );
}

export default Dashboard;
