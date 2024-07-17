import Button from "common/Button";

function PreviewControls() {
  const onClick = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex items-center">
      <Button onClick={onClick} className="px-10 font-bold" variant={"outline"}>
        Print
      </Button>
    </div>
  );
}

export default PreviewControls;
