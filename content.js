// Wait until DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runFocusOverlay);
} else {
  runFocusOverlay();
}

function runFocusOverlay() {
  // 1. Dim overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  overlay.style.zIndex = '9999';
  overlay.style.pointerEvents = 'none';
  document.body.appendChild(overlay);

  // 2. Motivational messages
  const messages = [
    "You're off to a great start!",
    "Let's do this!",
    "Focus time activated.",
    "Deep work starts now.",
    "You've got this!"
  ];

  function showMotivation() {
    const msg = document.createElement('div');
    msg.innerText = messages[Math.floor(Math.random() * messages.length)];
    msg.style.position = 'fixed';
    msg.style.bottom = '40px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.background = '#222';
    msg.style.color = '#fff';
    msg.style.padding = '14px 24px';
    msg.style.borderRadius = '10px';
    msg.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    msg.style.zIndex = '100000';
    msg.style.fontSize = '16px';
    msg.style.opacity = '0.95';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
  }

  showMotivation();
  setInterval(showMotivation, 5 * 60 * 1000);

  // 3. Quick Notes widget with collapse toggle
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.width = '240px';
  container.style.backgroundColor = '#ffffffee';
  container.style.border = '1px solid #ccc';
  container.style.borderRadius = '10px';
  container.style.zIndex = '100001';
  container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  container.style.fontFamily = 'sans-serif';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.padding = '6px 10px';
  header.style.fontSize = '13px';
  header.style.borderBottom = '1px solid #ddd';

  const title = document.createElement('span');
  title.textContent = 'Quick Note';

  const toggleButton = document.createElement('button');
  toggleButton.textContent = '🞬';
  toggleButton.style.border = 'none';
  toggleButton.style.background = 'transparent';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.fontSize = '14px';

  header.appendChild(title);
  header.appendChild(toggleButton);

  const textarea = document.createElement('textarea');
  textarea.id = 'inSessionNote';
  textarea.placeholder = 'Write something...';
  textarea.style.width = '100%';
  textarea.style.height = '200px';
  textarea.style.fontSize = '13px';
  textarea.style.border = 'none';
  textarea.style.padding = '10px';
  textarea.style.resize = 'none';
  textarea.style.boxSizing = 'border-box';
  textarea.style.outline = 'none';
  textarea.style.borderRadius = '0 0 10px 10px';

  container.appendChild(header);
  container.appendChild(textarea);
  document.body.appendChild(container);

  // Collapse logic
  let isCollapsed = false;
  toggleButton.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      textarea.style.display = 'none';
      toggleButton.textContent = '📝';
    } else {
      textarea.style.display = 'block';
      toggleButton.textContent = '🞬';
    }
  });

  // Load note
  const today = new Date().toDateString();
  chrome.storage.local.get(["note", "noteDate"], (data) => {
    if (data.noteDate === today) {
      textarea.value = data.note || "";
    }

    // Save on blur
    textarea.addEventListener("blur", () => {
      chrome.storage.local.set({ note: textarea.value, noteDate: today });
    });
  });
}
