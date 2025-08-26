import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";
interface props{
  size?:number
  divClassName:string;
  spinnerClassName:string;
}
export default function ReactSpinner({size=40,divClassName="fixed inset-0 mb-10 flex flex-col items-center justify-center bg-white/30 z-50 rounded-lg",spinnerClassName="animate-spin text-red-700"}:props) {
  return (
    <div className={divClassName}>
      <CgSpinner
        size={size}
        aria-label="Loading..."
        className={spinnerClassName}
      />
      <span className="mt-2 text-sm font-semibold text-red-500">
        Loading...
      </span>
    </div>
  );
}