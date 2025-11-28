// date.js
(function () {
  const el = document.getElementById('currentDateTime');

  function pad(n) { return n < 10 ? '0' + n : n; }

  function update() {
    if (!el) return;
    const now = new Date();
    // Example format: Monday, Nov 17, 2025 — 21:35:14
    const opts = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    const datePart = now.toLocaleDateString(undefined, opts);
    const timePart = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(':');
    el.textContent = `${datePart} — ${timePart}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    update();
    setInterval(update, 1000);
  });
})();
