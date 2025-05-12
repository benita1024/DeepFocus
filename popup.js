// Wait for the popup to load before attaching listeners
document.addEventListener("DOMContentLoaded", () => {
    const focusBtn = document.getElementById("focusBtn");
    const exitBtn = document.getElementById("exitBtn");
  
    if (focusBtn) {
      focusBtn.addEventListener("click", async () => {
        try {
          const [originalTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const allTabs = await chrome.tabs.query({ currentWindow: true });
  
          const closedTabUrls = [];
  
          // Close all tabs except the one clicked on
          for (const tab of allTabs) {
            if (tab.id !== originalTab.id) {
              closedTabUrls.push(tab.url);
              await chrome.tabs.remove(tab.id);
            }
          }
  
          // Save closed tabs in session
          await chrome.storage.session.set({ closedTabUrls });
  
          // Re-query active tab (original tab ID may change)
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
          // Redirect to Pomofocus
          await chrome.tabs.update(activeTab.id, { url: "https://pomofocus.io/" });
  
          // Wait until page is fully loaded, then inject overlay script
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === activeTab.id && changeInfo.status === "complete") {
              chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ["content.js"]
              });
              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
  
          console.log("Focus Mode activated.");
        } catch (error) {
          console.error("Error in Focus Mode:", error);
        }
      });
    }
  
    if (exitBtn) {
      exitBtn.addEventListener("click", () => {
        chrome.storage.session.get("closedTabUrls", (data) => {
          const urls = data.closedTabUrls || [];
  
          if (urls.length === 0) {
            alert("No tabs to restore.");
            return;
          }
  
          for (const url of urls) {
            chrome.tabs.create({ url });
          }
  
          // Clear session to prevent duplicates
          chrome.storage.session.remove("closedTabUrls");
  
          console.log("Focus Mode exited and tabs restored.");
        });
      });
    }
  });
  