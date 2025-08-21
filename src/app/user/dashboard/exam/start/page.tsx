import Exam from "@/app/ui/exam-dashboard/examStart";
import Logo from "@/components/svg/logo";
import { Suspense } from "react";

export default function ExamPage() {
    return(
        <div className="">
            <div className="flex items-center justify-center">
                <Logo/>
            </div>
            <div className="mt-5">
                <Suspense fallback={"loading......."}>
                    <Exam/>
                </Suspense>
            </div>
        </div>
    )
}