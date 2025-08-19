import ExamInstruction from "@/app/ui/user-dashboard/examInstruction";
import Logo from "@/components/svg/logo";
import { Suspense } from "react";

export default function InstructionPage() {
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="">
          <Logo />
        </div>
        <div
          className="w-full max-w-max bg-gradient-to-r from-[#ff3c57] to-[#ff7861] text-white whitespace-nowrap
                         shadow-lg rounded-2xl p-8"
        >
          <div className="w-full">
            <Suspense>
              <ExamInstruction />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
