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
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activated");
  return self.clients.claim();
});

self.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "SAVE_ANSWER") {
    const { answers, token, jobRole, paperSet } = event.data.payload || {};
    const record = { answers, token, jobRole, paperSet };
    await saveAnswer(record);
    console.log("📩 Answer stored in IndexedDB:", record);
  }
});


self.addEventListener("sync", (event) => {
  console.log("sync in addevent lister")
  if (event.tag === "sync-answers") {
    event.waitUntil(sendStoredAnswers());
  }
});

async function sendStoredAnswers() {
  try {
    const records = await getAllAnswers();
    if (!records.length) return;

    console.log("🚚 Syncing stored answers:", records);
    console.log("in sendStoredAnswer:", records);

    for (const record of records) {
      await fetch("https://f9bd43e25313.ngrok-free.app/response/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${record.token || ""}`,
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
    throw err
  }
}
