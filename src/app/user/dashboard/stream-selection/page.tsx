import StreamSelectionList from "@/app/ui/user-dashboard/streamSelection";
import Logo from "@/components/svg/logo";
import { ChangeEvent, ReactEventHandler, Suspense, useState } from "react";

export default function StreamSelection() {  
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="">
                                <Logo />
                            </div>
        <div className="w-full max-w-xl bg-gradient-to-r from-[#ff3c57] to-[#ff7861] text-white whitespace-nowrap
                         shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Select Your Background
          </h1>
          <p className="text-white text-center mb-8">
            Choose the category that best describes your expertise.
          </p>
          <div>
            <Suspense>
                <StreamSelectionList/>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
