"use client";
import Button from "@/components/button/button";
import { useAnswer } from "@/hooks/answerHook/useAnswer";
import { useOfflineCheck } from "@/hooks/checkInternetHook/useOfflineCheck";
import { useQuestion } from "@/hooks/questionHooks/useQuestion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";

export default function Exam() {
  const { questions, isLoading, isError, error } = useQuestion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const{isOffline,offlineNav}=useOfflineCheck();
  const sendAnswer=useAnswer();
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    if (typeof window !== "undefined") {
      const savedAnswer = localStorage.getItem("examAnswer");
      return savedAnswer ? JSON.parse(savedAnswer) : {};
    }
    return {};
  });
  const prevOffline=useRef(isOffline);
  const firstRun=useRef(true);
  const router=useRouter();
  useEffect(()=>{
    if(firstRun.current){
        firstRun.current=false;
        prevOffline.current=isOffline;
        return;
    }
    if(prevOffline.current&&!isOffline){
        console.log(isOffline);
        console.log("Answer Submitted");
        sendAnswer.mutate(answers,{
            onSuccess:()=>{
                router.push('/login')
            }
        })
    }
    prevOffline.current=isOffline;
  },[isOffline]);
  if (isLoading)
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  if (isError || !questions || !questions.questionSet) {
    return (
      <div>
        Could not retrieve questions. Please ensure you follow the step to reach
        here.
      </div>
    );
  }
  const currentQuestion = questions.questionSet[currentIndex];
  const selectOption = (select: string) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [currentQuestion.id]: select,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("examAnswer", JSON.stringify(updated));
      }
      return updated;
    });
  };
  // {console.log(questions)}
  return (
    <div className="flex items-center justify-center mx-auto">
      <div>
        <div className=" max-w-full flex-col items-center justify-center">
            <h2 className="text-lg font-bold mb-4">
            Question {currentIndex + 1} of {questions.questionSet.length}
          </h2>
          <div className="max-w-xl">
            <h1 className="text-2xl font-semibold mb-4">
              {currentQuestion?.question_text}
            </h1>
          </div>
        </div>
        <div className="  flex-col items-center justify-center">
          {currentQuestion && (
            <>
              {currentQuestion.question_type === "objective" ? (
                <div className="space-y-2 flex-col items-center justify-center sm:w-auto md:w-150 ">
                  {Object.values(currentQuestion?.options).map((opt, idx) => (
                    <div key={idx} className="flex items-center justify-center">
                      <Button
                        isPending={false}
                        key={idx}
                        text={opt}
                        className={`block w-full p-3 overflow-auto rounded-md border ${
                          answers[currentQuestion.id] === opt
                            ? "bg-green-500"
                            : "bg-white"
                        }`}
                        onClick={() => {
                          selectOption(opt);
                        }}
                        children={undefined}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h1>Code editior</h1>
                </div>
              )}
              <div className="flex items-center justify-center mt-5">
                <Button
                  hidden={currentIndex === 0}
                  isPending={currentIndex === 0}
                  text={"Prev"}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className={"px-4 py-2 rounded-md bg-gray-300"}
                  children={undefined}
                />
                <Button
                  hidden={currentIndex + 1 === questions.questionSet.length}
                  isPending={
                    questions && questions.questionSet
                      ? currentIndex === questions.questionSet.length - 1
                      : true
                  }
                  text={"Next"}
                  className={"px-4 py-2 ml-10 bg-blue-600 text-white rounded"}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  children={undefined}
                />
                {currentIndex + 1 === questions.questionSet.length && (
                  <Button
                    isPending={false}
                    text={"Submit"}
                    type="submit"
                    className={
                      "group w-85 rounded-3xl px-10 py-2 font-semibold flex items-center justify-center bg-gradient-to-r from-[#ff3c57] to-[#ff7861] text-white whitespace-nowrap hover:from-[#ff5e7b] hover:to-[#ff9b7c] hover:shadow-lg hover:shadow-pink-400/50 transition-all duration-300"
                    }
                    children={
                      <FaArrowAltCircleRight className="h-6 w-6 text-gray-50 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    }
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
