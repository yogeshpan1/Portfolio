// Live Kathmandu clock for the top bar.
(function () {
  var timeEl = document.getElementById("clock-time");
  var dateEl = document.getElementById("clock-date");
  if (!timeEl || !dateEl) return;

  var fmtTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  var fmtDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    weekday: "short",
    day: "2-digit",
    month: "short"
  });

  function tick() {
    var now = new Date();
    timeEl.textContent = fmtTime.format(now);
    timeEl.setAttribute("datetime", now.toISOString());
    dateEl.textContent = fmtDate.format(now);
  }

  tick();
  setInterval(tick, 1000);
})();
