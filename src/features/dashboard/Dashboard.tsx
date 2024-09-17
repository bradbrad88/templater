import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ElementSelectorProvider } from "features/template/ElementSelectorContext";
import ErrorComponent from "src/errors/ErrorBoundary";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Loading from "common/Loading";

const client = new QueryClient();

function Dashboard() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <QueryClientProvider client={client}>
      <ElementSelectorProvider>
        <div className="h-[64px]">
          <Header />
        </div>
        <div
          className="grid grid-rows-1 grid-cols-[330px,_minmax(0,_1fr)] h-[calc(100vh_-_64px)]"
          style={{ height: "screen" }}
        >
          <Sidebar />
          <main>
            <ErrorBoundary onReset={reset} FallbackComponent={ErrorComponent}>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </ElementSelectorProvider>
    </QueryClientProvider>
  );
}

export default Dashboard;
