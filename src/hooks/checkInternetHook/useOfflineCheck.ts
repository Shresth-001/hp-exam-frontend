import { useEffect, useState } from "react";

export const useOfflineCheck = () => {
  const [offlineNav, setOfflineNav] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    const checkOfflineStatus = () => {
      setOfflineNav(!navigator.onLine);
    };
    checkOfflineStatus();
    const handleOffline = () => setOfflineNav(true);
    const handleOnline = () => setOfflineNav(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    let controller: AbortController;

    const checkInternetConnection = async () => {
      controller = new AbortController();
      try {
        const response = await fetch(
          "https://www.google.com/favicon.ico?_t=" + new Date().getTime(), 
          {
            cache: "no-store",
            mode: "no-cors",
            signal: controller.signal,
          }
        );
        setIsOffline(false);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setIsOffline(true);
        }
      }
    };
    checkInternetConnection();
    const intervalId = setInterval(checkInternetConnection, 5000);
    return () => {
      controller?.abort();
      clearInterval(intervalId);
    };
  }, []);
  return { offlineNav, isOffline };
};
