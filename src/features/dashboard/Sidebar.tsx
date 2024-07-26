import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import TemplateSidebarControls from "features/template/controls/sidebarControls/TemplateSidebarControls";
import Loading from "common/Loading";

function Sidebar() {
  return (
    <div className="h-full w-full bg-zinc-100">
      <ErrorBoundary FallbackComponent={Fallback}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="" element={<></>} />
            <Route path="templates/:templateId/*" element={<TemplateSidebarControls />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Reset the error boundary any time the browser location changes
function Fallback({ resetErrorBoundary }: FallbackProps) {
  const location = useLocation();
  useEffect(() => {
    resetErrorBoundary();
  }, [resetErrorBoundary, location]);
  return <></>;
}

export default Sidebar;
