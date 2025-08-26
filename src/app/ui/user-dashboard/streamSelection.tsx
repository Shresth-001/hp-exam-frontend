"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import QuestionSet from "./questionSetSelection";
import SubmitButton from "@/components/button/submitButton";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useStream } from "@/hooks/streamHooks/useStream";
import { useRouter } from "next/navigation";
type OptionId = 'Frontend' | 'Backend' | 'Sales' | 'Others';
interface Option{
    id:OptionId;
    label:string;
    icon:string;

}
export default function StreamSelectionList({}) {
  const [selected, setSelected] = useState<OptionId| null>();
  const [set, setSet] = useState<string | null>();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [error, setError] = useState<string>();
  const {sendStream,redirectToInstruction}=useStream();
  const router=useRouter();
  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(!token){
      router.push('/login')
    }
    if(redirectToInstruction){
      router.push('exam/instruction')
    }
  })

  const handleContinue = () => {
    if (!selected) {
      setError("Please select appropiate Option");
      return;
    }
    console.log("Selected background:", selected);
    if (!set) {
      setError("please choose Question set");
      return;
    }
    console.log("selected backgroung", set);
    if(selected&&set){
        sendStream.mutate({stream:selected,set:set},{
          onError(error, variables, context) {
              setError(error.message);
          },
        });
        console.log("Sucess")
    }
  };
  const handleSet = (data: string) => {
    setSet(data);
  };
  const closeModal = () => {
    setIsOpen(false);
    // setSelected(null);
  };
  const options:Option[] = [
    { id: "Frontend", label: "Frontend", icon: "💻" },
    { id: "Backend", label: "Backend", icon: "🖥️" },
    { id: "Sales", label: "Sales", icon: "📊" },
    { id: "Others", label: "Others", icon: "✨" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => {
              setSelected(option.id);
              setError("");
              setIsOpen(!isOpen);
            }}
            className={twMerge(
              "flex flex-col items-center justify-center border-2 rounded-xl p-6 cursor-pointer transition-all",
              selected === option.id
                ? "border-blue-500 bg-white/30 backdrop-blur-sm   shadow-md transition-all transform-3d  "
                : "border-gray-200 hover:border-blue-300 hover:bg-red-300/45"
            )}
          >
            <span className="text-4xl mb-2">{option.icon}</span>
            <span className="text-lg font-medium">{option.label}</span>
          </div>
        ))}
        {isOpen && (
          <QuestionSet handleSet={handleSet} closeModal={closeModal} />
        )}
      </div>
      {error && <div className="text-white">{error}</div>}
      <div className="flex items-center justify-center mt-6">
        <SubmitButton
          handleSubmit={handleContinue}
          isPending={sendStream.isPending}
          text={"Continue"}
          className={
            "group w-85 rounded-3xl px-10 py-2 font-semibold flex items-center justify-center bg-gradient-to-r from-pink-700 to-red-700 text-white whitespace-nowrap hover:from-pink-600 hover:to-red-600 hover:shadow-lg hover:shadow-pink-400/50 transition-all duration-300"
          }
          children={
            <FaArrowAltCircleRight className="h-6 w-6 text-gray-50 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          }
        />
      </div>
    </div>
  );
}
