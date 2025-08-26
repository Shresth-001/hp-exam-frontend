import { sendAnswerApi } from "@/app/api/answerApi/answerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
  readonly sync: SyncManager;
}
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

    // if (navigator.serviceWorker.controller) {
    //   navigator.serviceWorker.controller.postMessage({
    //     type: "SAVE_ANSWER",
    //     payload: { answers, token, jobRole, paperSet },
    //   });

    //   const reg = await navigator.serviceWorker.ready;
    //   await (reg as any).sync.register("sync-answers");
    //   console.log(reg,"✅ Sync registered");

    //   console.log("📩 Saved answers offline:", { answers, jobRole, paperSet });
    //   alert(
    //     "⚠️ You are offline. Your answers are saved and will sync when online."
    //   );
    // } else {
    //   console.warn("⚠️ Service Worker not active; cannot save offline.");
    // }
//     if (navigator.serviceWorker && navigator.serviceWorker.controller) {
//   navigator.serviceWorker.controller.postMessage({
//     type: "SAVE_ANSWER",
//     payload: {
//       answers,
//       token,
//       jobRole,
//       paperSet,
//     },
//   });

//   // ✅ Register background sync here
//   if ("serviceWorker" in navigator && "SyncManager" in window) {
//     navigator.serviceWorker.ready.then((reg :any) => {
//       reg.sync.register("sync-answers")
//         .then(() => console.log("✅ Sync registered: sync-answers"))
//         .catch((err:any) => console.error("❌ Sync registration failed:", err));
//     });
//   } else {
//     console.warn("⚠️ Background Sync not supported, fallback to direct send");
//     // optional: call sendStoredAnswers() API directly here if needed
//     // sendStoredAnswers();
//   }
// }
if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;

        if (navigator.serviceWorker.controller) {
          // Send complete data to service worker
          navigator.serviceWorker.controller.postMessage({
            type: "SAVE_ANSWER",
            payload: { 
              answers, 
              token, 
              jobRole, 
              paperSet 
            },
          });

          // Check if background sync is supported (using type assertion for experimental API)
          if ('sync' in reg) {
            try {
              await (reg as any).sync.register("sync-answers");
              alert("📩 You are offline. Answers saved & will sync when online!");
            } catch (syncError) {
              console.error("Background sync registration failed:", syncError);
              alert("⚠️ Background sync not available. Answers saved locally and will sync when possible.");
            }
          } else {
            alert("⚠️ Background sync not supported. Answers saved locally.");
          }

        } else {
          alert("⚠️ Service Worker still not controlling page. Try refreshing once.");
        }
      } catch (error) {
        console.error("Service Worker error:", error);
        alert("❌ Error communicating with Service Worker. Answers may not be saved.");
      }
    } else {
      alert("❌ Service Worker not supported in this browser");
    }
  };

  return { saveAnswer, sendAnswer };
};
