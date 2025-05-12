chrome.action.onClicked.addListener(async (tab) => {
  const tabs = await chrome.tabs.query({ currentWindow: true });

  for (const t of tabs) {
    if (t.id !== tab.id) {
      chrome.tabs.remove(t.id);
    }
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });

  chrome.tabs.update(tab.id, { url: "https://pomofocus.io/" });
});
