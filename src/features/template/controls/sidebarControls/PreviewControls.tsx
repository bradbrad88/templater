import { Link } from "react-router-dom";
import Button from "common/Button";

function PreviewControls() {
  return (
    <div className="w-full p-4 mt-2">
      <Link to={"../"} relative="route">
        <Button className="w-full font-bold">Editor</Button>
      </Link>
    </div>
  );
}

export default PreviewControls;
