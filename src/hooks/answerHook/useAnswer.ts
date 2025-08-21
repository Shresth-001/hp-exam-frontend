import { sendAnswerApi } from "@/app/api/answerApi/answerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAnswer = () => {
  const queryClient = useQueryClient();
  const sendAnswer = useMutation({
    mutationFn: async (answer: Record<number, string>) => {
      const token = localStorage.getItem("token");
      const cachedStream: any =
        queryClient.getQueryData(["streamData"]) ??
        JSON.parse(localStorage.getItem("streamData") || "{}");

      const jobRole = cachedStream?.streamData.jobRole;
      const paperSet = cachedStream?.streamData.paperSet;
      console.log(token, cachedStream, jobRole, paperSet);
      return await sendAnswerApi({ answer, jobRole, paperSet, token });
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  //     const saveAnswer = async(answers: Record<number, string>) => {
  //     const token = localStorage.getItem("token");
  //     const cachedStream: any =
  //       queryClient.getQueryData(["streamData"]) ??
  //       JSON.parse(localStorage.getItem("streamData") || "{}");

  //     const jobRole = cachedStream?.streamData.jobRole;
  //     const paperSet = cachedStream?.streamData.paperSet;

  //    if (navigator.onLine) {
  //       await sendAnswer.mutateAsync(answers);
  //       return;
  //     }
  //      if (navigator.serviceWorker.controller) {
  //       navigator.serviceWorker.controller.postMessage({
  //         type: "SAVE_ANSWER",
  //         payload: { answers, token, jobRole, paperSet },
  //       });

  //       const reg = await navigator.serviceWorker.ready;
  //       await (reg as any).sync.register("sync-answers");

  //       console.log("📩 Saved answers offline:", { answers, jobRole, paperSet });
  //     } else {
  //       console.warn("⚠️ Service Worker not active; cannot save offline.");
  //     }
  //   };
  const saveAnswer = async (answers: Record<number, string>) => {
    const token = localStorage.getItem("token");
    const cachedStream: any =
      queryClient.getQueryData(["streamData"]) ??
      JSON.parse(localStorage.getItem("streamData") || "{}");

    const jobRole = cachedStream?.streamData.jobRole;
    const paperSet = cachedStream?.streamData.paperSet;

    if (navigator.onLine) {
      console.log("🌐 Online: sending answer directly");
      await sendAnswer.mutateAsync(answers);
      return;
    }

    console.log("📴 Offline: saving to service worker");

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SAVE_ANSWER",
        payload: { answers, token, jobRole, paperSet },
      });

      const reg = await navigator.serviceWorker.ready;
      await (reg as any).sync.register("sync-answers");
      console.log(reg,"✅ Sync registered");

      console.log("📩 Saved answers offline:", { answers, jobRole, paperSet });
      alert(
        "⚠️ You are offline. Your answers are saved and will sync when online."
      );
    } else {
      console.warn("⚠️ Service Worker not active; cannot save offline.");
    }
  };

  return { saveAnswer, sendAnswer };
};
