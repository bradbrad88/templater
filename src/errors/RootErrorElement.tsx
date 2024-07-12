import { useRouteError } from "react-router-dom";
import ErrorComponent from "./ErrorBoundary";

const RootErrorElement = () => {
  const error = useRouteError();
  return (
    <ErrorComponent
      resetErrorBoundary={() => (window.location.href = window.location.href.toString())}
      error={error}
    />
  );
};

export default RootErrorElement;
