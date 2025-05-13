// Wait for the popup to load before attaching listeners
document.addEventListener("DOMContentLoaded", () => {
    const focusBtn = document.getElementById("focusBtn");
    const exitBtn = document.getElementById("exitBtn");
    const noteField = document.getElementById("quickNote");
    const saveButton = document.getElementById("saveNote");
    const saveStatus = document.getElementById("saveStatus");
  
    // Focus Mode: Close other tabs and redirect
    if (focusBtn) {
      focusBtn.addEventListener("click", async () => {
        try {
          const [originalTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const allTabs = await chrome.tabs.query({ currentWindow: true });
  
          const closedTabUrls = [];
  
          for (const tab of allTabs) {
            if (tab.id !== originalTab.id) {
              closedTabUrls.push(tab.url);
              await chrome.tabs.remove(tab.id);
            }
          }
  
          await chrome.storage.session.set({ closedTabUrls });
  
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
          await chrome.tabs.update(activeTab.id, { url: "https://pomofocus.io/" });
  
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
  
    // Exit Mode: Restore tabs
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
  
          chrome.storage.session.remove("closedTabUrls");
  
          console.log("Focus Mode exited and tabs restored.");
        });
      });
    }
  
    // ✅ Quick Notes: Save + Load
    const today = new Date().toDateString();
  
    if (noteField && saveButton) {
      chrome.storage.local.get(["note", "noteDate"], (data) => {
        if (data.noteDate === today) {
          noteField.value = data.note || "";
        } else {
          chrome.storage.local.set({ note: "", noteDate: today });
          noteField.value = "";
        }
      });
  
      saveButton.addEventListener("click", () => {
        const note = noteField.value;
        chrome.storage.local.set({ note: note, noteDate: today }, () => {
          saveStatus.textContent = "✅ Note saved!";
          setTimeout(() => (saveStatus.textContent = ""), 1500);
        });
      });
    }
  });
  