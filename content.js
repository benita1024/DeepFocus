// Wait until DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runFocusOverlay);
} else {
  runFocusOverlay();
}

function runFocusOverlay() {
  // Dim overlay
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

  // Messages
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
    msg.style.zIndex = '100000'; // HIGHER than pomofocus
    msg.style.fontSize = '16px';
    msg.style.opacity = '0.95';
    document.body.appendChild(msg);

    setTimeout(() => msg.remove(), 5000);
  }

  // Show immediately
  showMotivation();

  // Then every 5 mins
  setInterval(showMotivation, 5 * 60 * 1000);
}

