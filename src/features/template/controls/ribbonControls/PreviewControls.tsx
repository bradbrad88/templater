import Button from "common/Button";

function PreviewControls() {
  const onClick = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex items-center px-4 pb-3.5">
      <div className="h-full flex items-end">
        <Button onClick={onClick} className="px-10 font-bold" variant={"outline"}>
          Print
        </Button>
      </div>
    </div>
  );
}

export default PreviewControls;
