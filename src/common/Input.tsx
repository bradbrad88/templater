import { ForwardedRef, forwardRef } from "react";
import { cn } from "../utils/cn";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

function Component(props: Props, ref: ForwardedRef<HTMLInputElement>) {
  const className = "border-[1px] border-zinc-400 px-4 h-10 rounded-lg text-lg font-medium";
  return <input ref={ref} {...props} className={cn(className, props.className)} />;
}

const Input = forwardRef(Component);

export default Input;
