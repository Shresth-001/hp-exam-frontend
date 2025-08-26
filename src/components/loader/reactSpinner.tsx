import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";
import { twMerge } from "tailwind-merge";
interface props{
  size?:number
  divClassName?:string;
  spinnerClassName?:string;
  spanClassName?:string;
  showText?:boolean;
}
export default function ReactSpinner({size=40,showText,divClassName="fixed inset-0 mb-10 flex flex-col items-center justify-center bg-white/30 z-50 rounded-lg",spinnerClassName="animate-spin text-red-700",spanClassName}:props) {
  return (
    <div className={divClassName}>
      <CgSpinner
        size={size}
        aria-label="Loading..."
        className={spinnerClassName}
      />
      {showText&&(
        <span className={twMerge("mt-2 text-sm font-semibold ",spanClassName?spanClassName:"text-red-500")}>
        Loading...
      </span>
      )}
    </div>
  );
}