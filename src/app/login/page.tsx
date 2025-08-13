import { Suspense } from "react";
import LoginForm from "../ui/login-form";

export default function LoginPage() {
    return(
        <div>
            <main className="flex items-center justify-center  md:h-screen">
            <div className="relative mx-auto flex w-1/2 pt-20 flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-red-500/55 p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <p>Exam Portal</p>
                    </div>
                </div>
                <Suspense>
                    <LoginForm/>
                </Suspense>
            </div>

        </main>
        </div>
    )
}