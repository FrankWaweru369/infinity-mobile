// On-screen logger for debugging mobile
let logs = [];
let container = null;

export function initOnScreenLog() {
  if (typeof window === 'undefined') return;
  
  container = document.createElement('div');
  container.id = 'on-screen-log';
  container.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.9);
    color: #0f0;
    font-size: 11px;
    font-family: monospace;
    padding: 8px;
    z-index: 10000;
    max-height: 150px;
    overflow-y: auto;
    border-top: 1px solid #333;
  `;
  document.body.appendChild(container);
}

export function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const logLine = `[${timestamp}] ${message}`;
  logs.unshift(logLine);
  
  if (logs.length > 20) logs.pop();
  
  if (container) {
    container.innerHTML = logs.map(l => `<div style="border-bottom:1px solid #333;padding:2px">${escapeHtml(l)}</div>`).join('');
  }
  
  console.log(logLine);
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}
