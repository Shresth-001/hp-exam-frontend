import Exam from "@/app/ui/exam-dashboard/examStart";
import Logo from "@/components/svg/logo";
import { Suspense } from "react";

export default function ExamPage() {
    return(
        <div className="">
            <div>
                <Logo/>
            </div>
            <div>
                <Suspense fallback={"loading......."}>
                    <Exam/>
                </Suspense>
            </div>
        </div>
    )
}