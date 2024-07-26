import { Link } from "react-router-dom";
import Button from "common/Button";

function NotFoundComponent({
  children,
  reset,
}: {
  reset: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-10">
      <div className="mb-4">{children}</div>
      <Link to={"../"} relative="route">
        <Button onClick={reset} variant={"default"}>
          Go back
        </Button>
      </Link>
    </div>
  );
}

export default NotFoundComponent;
