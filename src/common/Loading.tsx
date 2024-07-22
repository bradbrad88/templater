import { FadeLoader } from "react-spinners";

function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <FadeLoader />
    </div>
  );
}

export default Loading;
