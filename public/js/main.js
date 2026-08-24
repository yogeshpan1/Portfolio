// Page behaviour: nav toggle, scroll reveals, GitHub telemetry, glitch timer,
// and the contact form. Everything fails quietly — the site works even if
// GitHub or the backend are unreachable.

(function () {
  "use strict";

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- scroll reveals ---------- */
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("revealed"); });
  }

  /* ---------- occasional glitch on the hero name ---------- */
  var glitch = document.querySelector(".glitch");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (glitch && !reducedMotion) {
    setInterval(function () {
      glitch.classList.add("glitching");
      setTimeout(function () { glitch.classList.remove("glitching"); }, 500);
    }, 7000);
  }

  /* ---------- GitHub telemetry ---------- */
  var CACHE_KEY = "gh-telemetry";
  var CACHE_TTL = 60 * 60 * 1000; // one hour

  function fillTelemetry(data) {
    var repos = document.getElementById("gh-repos");
    var stars = document.getElementById("gh-stars");
    var followers = document.getElementById("gh-followers");
    var langs = document.getElementById("gh-langs");
    if (!repos) return;

    repos.textContent = String(data.repos);
    followers.textContent = String(data.followers);
    stars.textContent = data.stars === null ? "—" : String(data.stars);

    if (langs && data.topLangs) {
      langs.innerHTML = data.topLangs
        .map(function (l) { return "<span>" + l + "</span>"; })
        .join("");
    }
  }

  function loadTelemetry() {
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) { /* ignore */ }
    if (cached && Date.now() - cached.t < CACHE_TTL) {
      fillTelemetry(cached.data);
      return;
    }

    fetch("https://api.github.com/users/yogeshpan1")
      .then(function (r) {
        if (!r.ok) throw new Error("user request failed");
        return r.json();
      })
      .then(function (user) {
        return fetch("https://api.github.com/users/yogeshpan1/repos?per_page=100")
          .then(function (r) {
            if (!r.ok) throw new Error("repos request failed");
            return r.json();
          })
          .then(function (repos) {
            var starCount = 0;
            var langCounts = {};
            repos.forEach(function (repo) {
              starCount += repo.stargazers_count || 0;
              if (repo.language) {
                langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
              }
            });
            var topLangs = Object.keys(langCounts)
              .sort(function (a, b) { return langCounts[b] - langCounts[a]; })
              .slice(0, 6);

            var data = {
              repos: user.public_repos,
              followers: user.followers,
              stars: starCount,
              topLangs: topLangs
            };
            fillTelemetry(data);
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: data }));
            } catch (e) { /* storage may be unavailable */ }
          });
      })
      .catch(function () {
        // leave the dashes in place rather than showing stale numbers
      });
  }

  loadTelemetry();

  /* ---------- contact form ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var submitBtn = document.getElementById("cf-submit");

  function setStatus(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form-status " + (ok ? "ok" : "err");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = form.elements;
      var name = fields.name.value.trim();
      var email = fields.email.value.trim();
      var message = fields.message.value.trim();

      if (name.length < 2) return setStatus("Please tell me your name.", false);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus("That email doesn't look right.", false);
      if (message.length < 10) return setStatus("Give me a bit more to work with — at least 10 characters.", false);

      var payload = { name: name, email: email, message: message };

      // honeypot: bots fill hidden fields, humans can't
      if (fields.company && fields.company.value) {
        setStatus("Message queued. Thanks!", true);
        form.reset();
        return;
      }

      submitBtn.disabled = true;
      setStatus("Transmitting…", true);

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) {
          if (!r.ok) throw new Error("bad status " + r.status);
          return r.json();
        })
        .then(function () {
          setStatus("Message received. I'll get back to you soon.", true);
          form.reset();
        })
        .catch(function () {
          setStatus(
            'Backend not reachable here. Email me directly at ' +
            '<a href="mailto:yogeshpant911@gmail.com">yogeshpant911@gmail.com</a>.',
            false
          );
          status.innerHTML = status.textContent; // allow the mailto link
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
