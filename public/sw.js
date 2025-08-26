// function openDB() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("ExamDB", 1);

//     request.onupgradeneeded = (event) => {
//       const db = event.target.result;
//       if (!db.objectStoreNames.contains("answers")) {
//         db.createObjectStore("answers", { keyPath: "id", autoIncrement: true });
//       }
//     };

//     request.onsuccess = (event) => resolve(event.target.result);
//     request.onerror = (event) => reject(event.target.error);
//   });
// }

// async function saveAnswer(answer) {
//   const db = await openDB();
//   const tx = db.transaction("answers", "readwrite");
//   tx.objectStore("answers").add(answer);
//   return tx.complete;
// }

// async function getAllAnswers() {
//   const db = await openDB();
//   return new Promise((resolve, reject) => {
//     const tx = db.transaction("answers", "readonly");
//     const store = tx.objectStore("answers");
//     const request = store.getAll();

//     request.onsuccess = () => resolve(request.result);
//     request.onerror = (e) => reject(e);
//   });
// }

// async function clearAnswers() {
//   const db = await openDB();
//   const tx = db.transaction("answers", "readwrite");
//   tx.objectStore("answers").clear();
//   return tx.complete;
// }
// self.addEventListener("install", (event) => {
//   console.log("✅ Service Worker installed");
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   console.log("✅ Service Worker activated");
//   return self.clients.claim();
// });

// self.addEventListener("message", async (event) => {
//   if (event.data && event.data.type === "SAVE_ANSWER") {
//     const { answers, token, jobRole, paperSet } = event.data.payload || {};
//     const record = { answers, token, jobRole, paperSet };
//     await saveAnswer(record);
//     console.log("📩 Answer stored in IndexedDB:", record);
//   }
// });


// self.addEventListener("sync", (event) => {
//   console.log("sync in addevent lister")
//   if (event.tag === "sync-answers") {
//     event.waitUntil(sendStoredAnswers());
//   }
// });

// async function sendStoredAnswers() {
//   try {
//     const records = await getAllAnswers();
//     if (!records.length) return;

//     console.log("🚚 Syncing stored answers:", records);
//     console.log("in sendStoredAnswer:", records);

//     for (const record of records) {
//       await fetch("https://f9bd43e25313.ngrok-free.app/response/submit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${record.token || ""}`,
//         },
//         body: JSON.stringify({
//           answers: record.answers,
//           jobRole: record.jobRole,
//           paperSet: record.paperSet,
//         }),
//       });
//     }

//     console.log("✅ All answers synced to server!");
//     await clearAnswers();
//   } catch (err) {
//     console.error("❌ Sync failed, will retry later", err);
//     throw err
//   }
// }
const STATIC_CACHE = "static-v1";
const RUNTIME_CACHE = "runtime-v1";

const EXAM_ROUTES = [
  "/user/dashboard/exam/instruction",
  "/user/dashboard/exam/start",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll([
        ...EXAM_ROUTES,
        "/",
        // "/favicon.ico",
        "/manifest.json",
      ]);
    })()
  );
  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
    })()
  );
  self.clients.claim();
});


self.addEventListener("fetch", (event) => {
  const { request } = event;

  
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  
  if (url.origin !== self.location.origin) {
    return;
  }

  
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, res.clone());
          return res;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match(EXAM_ROUTES[0]);
          if (fallback) return fallback;
          return Response.error();
        }
      })()
    );
    return;
  }

  
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.includes("__next") ||
    url.pathname.startsWith("/_next/data/")
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  
  if (["script", "style", "font"].includes(request.destination)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  
  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }

  
  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});


async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req)
    .then((res) => {
      cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    throw new Error("Offline and not cached");
  }
}


self.addEventListener("message", async (event) => {
  if (event.data?.type === "WARM_EXAM_CACHE") {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.addAll(EXAM_ROUTES);
  }

  
  if (event.data && event.data.type === "SAVE_ANSWER") {
    const { answers, token, jobRole, paperSet } = event.data.payload || {};
    const record = { answers, token, jobRole, paperSet };
    await saveAnswer(record);
    console.log("📩 Answer stored in IndexedDB:", record);
  }
});


function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ExamDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("answers")) {
        db.createObjectStore("answers", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function saveAnswer(answer) {
  const db = await openDB();
  const tx = db.transaction("answers", "readwrite");
  tx.objectStore("answers").add(answer);
  return tx.complete;
}

async function getAllAnswers() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("answers", "readonly");
    const store = tx.objectStore("answers");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e);
  });
}

async function clearAnswers() {
  const db = await openDB();
  const tx = db.transaction("answers", "readwrite");
  tx.objectStore("answers").clear();
  return tx.complete;
}

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-answers") {
    event.waitUntil(sendStoredAnswers());
  }
});

async function sendStoredAnswers() {
  try {
    const records = await getAllAnswers();
    if (!records.length) return;
    for (const record of records) {
      await fetch("https://f042b74d7319.ngrok-free.app/responses/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${record.token || ""}`,
        },
        body: JSON.stringify({
          answers: record.answers,
          jobRole: record.jobRole,
          paperSet: record.paperSet,
        }),
      });
    }
    console.log("✅ All answers synced to server!");
    await clearAnswers();
  } catch (err) {
    console.error("❌ Sync failed, will retry later", err);
    throw err;
  }
}

// const SYNC_TAG = "sync-answers";

// // Enhanced message handler with better error reporting
// self.addEventListener("message", async (event) => {
//   console.log("📨 Service Worker received message:", event.data);
  
//   if (event.data?.type === "WARM_EXAM_CACHE") {
//     console.log("🔥 Warming exam cache…");
//     const cache = await caches.open(RUNTIME_CACHE);
//     await cache.addAll(EXAM_ROUTES);
//     console.log("✅ Exam routes cached");
//   }

//   // Enhanced SAVE_ANSWER with proper background sync registration
//   if (event.data?.type === "SAVE_ANSWER") {
//     try {
//       const { answers, token, jobRole, paperSet } = event.data.payload || {};
//       const record = { answers, token, jobRole, paperSet, timestamp: Date.now() };
      
//       console.log("💾 Saving answer to IndexedDB:", record);
//       await saveAnswer(record);
      
//       // Register background sync
//       if ('sync' in self.registration) {
//         try {
//           await self.registration.sync.register(SYNC_TAG);
//           console.log("✅ Background sync registered successfully");
          
//           // Send confirmation back to client
//           if (event.ports && event.ports[0]) {
//             event.ports[0].postMessage({ 
//               type: "SYNC_REGISTERED", 
//               success: true 
//             });
//           }
//         } catch (syncError) {
//           console.error("❌ Background sync registration failed:", syncError);
          
//           // Try immediate sync as fallback
//           console.log("🔄 Attempting immediate sync as fallback...");
//           try {
//             await sendStoredAnswers();
//             console.log("✅ Immediate sync completed successfully");
//           } catch (immediateError) {
//             console.error("❌ Immediate sync also failed:", immediateError);
//           }
//         }
//       } else {
//         console.warn("⚠️ Background Sync API not supported");
//         // Fallback: try to sync immediately
//         try {
//           await sendStoredAnswers();
//         } catch (error) {
//           console.error("❌ Fallback sync failed:", error);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error processing SAVE_ANSWER:", error);
//     }
//   }

//   // Manual sync trigger from client
//   if (event.data?.type === "TRY_SYNC") {
//     console.log("🔄 Manual sync triggered from client");
//     try {
//       await sendStoredAnswers();
//       console.log("✅ Manual sync completed");
      
//       // Send success response back to client
//       if (event.ports && event.ports[0]) {
//         event.ports[0].postMessage({ 
//           type: "SYNC_COMPLETED", 
//           success: true 
//         });
//       }
//     } catch (error) {
//       console.error("❌ Manual sync failed:", error);
      
//       // Send error response back to client
//       if (event.ports && event.ports[0]) {
//         event.ports[0].postMessage({ 
//           type: "SYNC_FAILED", 
//           error: error.message 
//         });
//       }
//     }
//   }
// });

// // Enhanced sync event handler with retry logic
// self.addEventListener("sync", (event) => {
//   console.log("📡 Sync event fired for tag:", event.tag);
  
//   if (event.tag === SYNC_TAG) {
//     event.waitUntil(
//       (async () => {
//         try {
//           await sendStoredAnswers();
//           console.log("✅ Background sync completed successfully");
//         } catch (error) {
//           console.error("❌ Background sync failed:", error);
//           // The sync will automatically retry later
//           throw error; // Important: re-throw to trigger retry
//         }
//       })()
//     );
//   }
// });

// // Periodic sync check (if supported)
// if ('periodicSync' in self.registration) {
//   self.addEventListener('periodicSync', (event) => {
//     if (event.tag === SYNC_TAG) {
//       console.log("🔄 Periodic sync triggered");
//       event.waitUntil(sendStoredAnswers());
//     }
//   });
// }

// // Enhanced sendStoredAnswers with better error handling
// async function sendStoredAnswers() {
//   try {
//     const records = await getAllAnswers();
//     console.log(`📊 Found ${records.length} records to sync`);
    
//     if (!records.length) {
//       console.log("ℹ️ No answers to sync");
//       return;
//     }

//     let successCount = 0;
//     let errorCount = 0;

//     for (const record of records) {
//       try {
//         console.log("➡️ Syncing record:", record.id);
        
//         const response = await fetch("https://e98c5d219792.ngrok-free.app/response/submit", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${record.token || ""}`,
//           },
//           body: JSON.stringify({
//             answers: record.answers,
//             jobRole: record.jobRole,
//             paperSet: record.paperSet,
//           }),
//         });

//         if (response.ok) {
//           console.log("✅ Record synced successfully:", record.id);
//           successCount++;
//         } else {
//           console.error("❌ Server rejected record:", record.id, response.status);
//           errorCount++;
//           throw new Error(`Server error: ${response.status}`);
//         }
//       } catch (recordError) {
//         console.error("❌ Failed to sync record:", record.id, recordError);
//         errorCount++;
//         // Don't throw here - continue with other records
//       }
//     }

//     console.log(`📈 Sync results: ${successCount} successful, ${errorCount} failed`);
    
//     // Only clear answers if all were successful
//     if (errorCount === 0) {
//       await clearAnswers();
//       console.log("🧹 Cleared all answers from IndexedDB");
//     } else {
//       console.log("⚠️ Keeping failed records for retry");
//       throw new Error(`${errorCount} records failed to sync`);
//     }

//   } catch (error) {
//     console.error("❌ Sync operation failed completely:", error);
//     throw error; // Re-throw to trigger retry mechanism
//   }
// }

// // Add connectivity change listener for immediate sync when online
// self.addEventListener('online', () => {
//   console.log("🌐 Online - checking for pending syncs");
//   // Check if we have any records and trigger sync
//   getAllAnswers().then(records => {
//     if (records.length > 0) {
//       console.log("🔄 Online with pending records, triggering sync");
//       sendStoredAnswers().catch(error => {
//         console.error("❌ Online sync failed:", error);
//       });
//     }
//   });
// });

// console.log("✅ Enhanced Service Worker loaded with background sync support");

