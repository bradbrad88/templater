import { ZodError } from "zod";
import Button from "../common/Button";

type Props = {
  error: unknown;
  resetErrorBoundary: (...args: unknown[]) => void;
};

const ErrorBoundary = ({ error, resetErrorBoundary }: Props) => {
  const renderError = () => {
    if (error instanceof ZodError) {
      return (
        <div>
          <p>{error.stack}</p>
          <p>{error.message}</p>
          {error.issues.map(issue => (
            <div className="flex flex-row gap-4">
              <div>{issue.path}</div>
              <div>{issue.code}</div>
              <div>{issue.message}</div>
            </div>
          ))}
        </div>
      );
    }
    if (error instanceof Error) {
      console.log("Hi");
      return (
        <div>
          <p>{error.message}</p>
          <p>{error.stack}</p>
        </div>
      );
    }
  };

  console.error(error);

  return (
    <div className="px-12 py-8 flex flex-col w-fit gap-2">
      <p className="text-orange-700">Something went wrong...</p>
      <div>{renderError()}</div>
      <Button onClick={() => resetErrorBoundary()}>Try Again</Button>
    </div>
  );
};

export default ErrorBoundary;
