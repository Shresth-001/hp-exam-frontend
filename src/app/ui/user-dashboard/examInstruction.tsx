"use client";
import withAuth from "@/components/auth/withAuth";
import Button from "@/components/button/button";
import { useOfflineCheck } from "@/hooks/checkInternetHook/useOfflineCheck";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";

 function ExamInstruction() {
  const { isOffline, offlineNav } = useOfflineCheck();
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/user/dashboard/exam/start");
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "WARM_EXAM_CACHE" });
    }
  }, [router]);
  const handleStart = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "WARM_EXAM_CACHE" });
    }
    // router.push("/user/dashboard/exam/start");
    if (isOffline && offlineNav) {
      console.log("start exam");
      router.push('/user/dashboard/exam/start');
    }
  };
  const buttonCss = clsx(
    "group w-85 rounded-3xl px-10 py-2 font-semibold flex items-center justify-center  whitespace-nowrap",
    {
      " bg-gradient-to-r from-pink-700 to-red-700 text-white hover:from-pink-600 hover:to-red-600 hover:shadow-lg hover:shadow-pink-400/50 transition-all duration-300":
        isOffline,
      "bg-white text-black hover:bg-white/30 hover:shadow-black transition-all duration-300":
        !isOffline,
    }
  );
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-4">Exam Instructions</h1>
        <ul className="list-disc pl-5 mb-6 space-y-2 overflow-auto">
          <li>Read each question carefully.</li>
          <li>You have 60 minutes to complete the exam.</li>
          <li>
            For writing code you can open code editor provide on that question
            and write there.
          </li>
          <li>Do not refresh the page during the exam.</li>
          <li>
            Internet connection must disable throughout the exam otherwise your
            empty answer will be submitted and you will be logout.
          </li>
          <li>
            No switching tabs or opening new windows otherwise your empty answer
            will be submitted and you will be logout.
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-center">
        <Button
          isPending={!isOffline}
          onClick={handleStart}
          text={"Start exam"}
          pendingtext="Go Offline to start"
          className={buttonCss}
          children={
            <FaArrowAltCircleRight className="h-6 w-6 text-gray-50 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          }
        />
      </div>
    </>
  );
}
export default withAuth(ExamInstruction)