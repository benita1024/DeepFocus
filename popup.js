document.getElementById("focusBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const allTabs = await chrome.tabs.query({ currentWindow: true });
  
    for (const t of allTabs) {
      if (t.id !== tab.id) {
        await chrome.tabs.remove(t.id);
      }
    }
  
    // 1. Redirect first
    await chrome.tabs.update(tab.id, { url: "https://pomofocus.io/" });
  
    // 2. Wait for the tab to finish loading before injecting the script
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === "complete") {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
        chrome.tabs.onUpdated.removeListener(listener); // Clean up listener
      }
    });
  });
  