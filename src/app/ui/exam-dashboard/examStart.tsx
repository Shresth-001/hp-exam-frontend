"use client";
import Button from "@/components/button/button";
import CodeEditor from "@/components/codeEditor/codeEditor";
import { useAnswer } from "@/hooks/answerHook/useAnswer";
import { useOfflineCheck } from "@/hooks/checkInternetHook/useOfflineCheck";
import { useQuestion } from "@/hooks/questionHooks/useQuestion";
import { useCountdownTimer } from "@/hooks/timerHooks/useCountDownTimer";
import { useQuestionTimer } from "@/hooks/timerHooks/useQuestionTimer";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowAltCircleRight } from "react-icons/fa";
interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
  readonly sync: SyncManager;
}
export default function Exam() {
  const { questions, isLoading, isError, error } = useQuestion();
  const queryClient=useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isOffline, offlineNav } = useOfflineCheck();
  const [codeText, setCodeText] = useState<string>("");
  const [examState, setExamState] = useState('in-progress');
  const {sendAnswer,saveAnswer} = useAnswer();
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    if (typeof window !== "undefined") {
      const savedAnswer = localStorage.getItem("examAnswer");
      return savedAnswer ? JSON.parse(savedAnswer) : {};
    }
    return {};
  });
  const prevOffline = useRef(isOffline);
  const firstRun = useRef(true);
  const router = useRouter();
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      prevOffline.current = isOffline;
      return;
    }
    if (prevOffline.current && !isOffline) {
      console.log(isOffline);
      console.log("Answer Submitted");
      sendAnswer.mutate(answers, {
        onSuccess: () => {
          toast.success("Your Answer is Submitted ")
          router.push("/login");
        },
      });
    }
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSubmit();
      }
    };
    const handleBeforeUnload = (event:BeforeUnloadEvent) => {
      
      if (examState !== 'submitted') {
        handleSubmit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    prevOffline.current = isOffline;
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isOffline,examState]);

//   const handleSubmit =async () => {
//      try {
//     await saveAnswer(answers);    
//     toast.success("Your Answer is Submitted ")
//     router.push("/login");
//   } catch (e) {
//     console.error("Submit failed:", e);
//     toast.error("not submitted")
//     router.push("/login");
//   }
//  };
const handleSubmit = () => {
   if (examState === 'submitted') {
      return; 
    }
    
    setExamState('submitted');
  const token = localStorage.getItem("token");
  // const currentExam = JSON.parse(localStorage.getItem("currentExam") || "{}");
  // const jobRole = currentExam?.jobRole;
  // const paperSet = currentExam?.paperSet;
  const cachedStream: any =
      queryClient.getQueryData(["streamData"]) ??
      JSON.parse(localStorage.getItem("streamData") || "{}");

    const jobRole = cachedStream?.streamData.jobRole;
    const paperSet = cachedStream?.streamData.paperSet;

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SAVE_ANSWER",
      payload: { answers, token, jobRole, paperSet },
    });

    navigator.serviceWorker.ready.then((reg) => {
      if ("sync" in reg) (reg.sync as SyncManager).register("sync-answers").catch(() => {});
    });

    alert("📩 You are offline. Answers saved & will sync when online!");
    router.push("/login");
  } else {
    alert("⚠️ Service Worker not active");
  }
};

  const { formatTime, timeLeft } = useCountdownTimer({
    duration: 60 * 60,
    storageKey: "exam_123_time",
    onExpire: handleSubmit,
  });
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
  if (!currentQuestion) return <div>No Question</div>;
  const {
    formatTime: formatQuestion,
    timeLeft: questionTime,
    expired,
  } = useQuestionTimer({
    questionId: currentQuestion.id.toString(),
    duration: 60,
    onExpire: () => {},
  });
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
    <>
      <div className="flex items-center justify-end ">
        <div className=" text-2xl font-mono w-auto text-black px-6 py-3 rounded-3xl shadow-lg mb-6">
          <h1 className="text-red-500 font-semibold">Time Left</h1>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center justify-center mx-auto">
        <div>
          <div className=" max-w-full flex-col items-center justify-center">
            <h2 className="text-lg font-bold mb-4">
              Question {currentIndex + 1} of {questions.questionSet.length}
            </h2>
            <div className="text-xl font-mono text-blue-600">
              Question Timer: {formatQuestion(questionTime)}
            </div>
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
                      <div
                        key={idx}
                        className="flex items-center justify-center"
                      >
                        <Button
                          isPending={false}
                          disable={expired}
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
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 w-xl">
                    <CodeEditor
                      questionId={currentQuestion.id}
                      initialValue={answers[currentQuestion.id]||''}
                      language={"javascript"}
                      onChange={(val)=>{
                        setCodeText(val);
                        setAnswers((prev)=>{
                            const updated={
                                ...prev,
                                [currentQuestion.id]:val
                            };
                            if(typeof window!=='undefined'){
                                localStorage.setItem('examAnswer',JSON.stringify(updated));
                            }
                            return updated;
                        })
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center justify-center mt-5">
                  <Button
                    hidden={currentIndex === 0}
                    isPending={currentIndex === 0}
                    text={"Prev"}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    className={"px-4 py-2 rounded-md bg-gray-300"}
                    
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
                    
                  />
                  {currentIndex + 1 === questions.questionSet.length && (
                    <Button
                      isPending={false}
                      onClick={handleSubmit}
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
    </>
  );
}
