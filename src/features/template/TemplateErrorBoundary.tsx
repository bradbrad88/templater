import { useRouteError } from "react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import NotFoundComponent from "src/errors/NotFoundComponent";
import NotFoundError from "src/errors/NotFoundError";

function TemplateErrorBoundary() {
  const error = useRouteError();
  const { reset } = useQueryErrorResetBoundary();

  if (error instanceof NotFoundError) {
    return (
      <NotFoundComponent reset={reset}>
        This template doesn't seem to exist any more...
      </NotFoundComponent>
    );
  }
  return <div>Errorrrr</div>;
}

export default TemplateErrorBoundary;
