// "use client";
// import { useEffect } from "react";

// export default function ServiceWorkerRegister() {
//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/sw.js")
//         .then((reg) => console.log("✅ Service Worker registered:", reg))
//         .catch((err) => console.error("❌ SW registration failed:", err));
//     }
//   }, []);

//   return null;
// }
"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("✅ Service Worker registered:", registration);

          // Check if background sync is supported
          if ('sync' in registration) {
            console.log("✅ Background Sync API is supported");
            
            // Request background sync permission if needed
            if ('permissions' in navigator) {
              try {
                const permissionStatus = await navigator.permissions.query({
                  name: 'background-sync' as PermissionName,
                });
                
                if (permissionStatus.state === 'prompt') {
                  console.log("ℹ️ Background sync permission will be requested when needed");
                } else if (permissionStatus.state === 'granted') {
                  console.log("✅ Background sync permission already granted");
                } else {
                  console.log("⚠️ Background sync permission denied");
                }
              } catch (permissionError) {
                console.warn("⚠️ Could not check background sync permissions:", permissionError);
              }
            }
          } else {
            console.warn("⚠️ Background Sync API not supported in this browser");
          }

          // Listen for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  console.log("🔄 New service worker version available");
                }
              });
            }
          });

        } catch (error) {
          console.error("❌ Service Worker registration failed:", error);
        }
      } else {
        console.warn("❌ Service Worker not supported in this browser");
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
