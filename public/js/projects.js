// Project data and rendering for the garage section.
// Screenshot files live in assets/img/projects/<image> — if one is missing
// the card falls back to a big initials block instead of a broken image.

var PROJECTS = [
  {
    rd: "RD 01",
    name: "Pocket Doctor",
    image: "assets/img/projects/pocket-doctor.png",
    status: "shipped",
    desc: "Full-stack healthcare platform with separate patient, doctor and admin portals — appointment booking, messaging and digital prescriptions.",
    tech: ["Django", "Python", "scikit-learn", "SQLite"],
    features: [
      "Symptom-classification model covering 24 conditions at 94% accuracy",
      "Confidence-based fallback so unsure predictions get escalated, not guessed",
      "LLM-generated explanations written in plain language for patients"
    ],
    repo: "https://github.com/yogeshpan1/PocketDoctor",
    demo: null
  },
  {
    rd: "RD 02",
    name: "DealLens",
    image: "assets/img/projects/deallens.png",
    status: "live",
    desc: "AI due-diligence tool that reads startup pitch decks and returns investor-style scoring, risk flags and an investment thesis.",
    tech: ["Python", "Streamlit", "LangChain", "Groq API"],
    features: [
      "Multi-model comparison to cross-check AI scores across different LLMs",
      "PDF parsing with PyMuPDF4LLM plus a manual-text mode for scanned decks",
      "Deployed on Streamlit Cloud with API keys kept out of the repo"
    ],
    repo: "https://github.com/yogeshpan1/AI-Pitch-Deck-Analyzer",
    demo: "https://getdeallens.streamlit.app"
  },
  {
    rd: "RD 03",
    name: "Jaffinator",
    image: "assets/img/projects/jaffinator.png",
    status: "wip",
    desc: "Hand-built ESP32 wireless toolkit — my take on the CapibaraZero idea, running WiFi Marauder firmware for network scanning and wireless analysis.",
    tech: ["C++", "ESP32", "SPI/I2C", "WiFi Marauder"],
    features: [
      "Network scanning, de-authentication attacks and WPA/WPA2 handshake capture",
      "TFT LCD, SD card and LiPo battery wired over SPI and I2C for standalone field use",
      "Roadmap for NFC, IR, SubGHz and BadUSB expansion modules"
    ],
    repo: "https://github.com/yogeshpan1/Jaffinator",
    demo: null
  },
  {
    rd: "RD 04",
    name: "Neighborly",
    image: "assets/img/projects/neighborly.png",
    status: "shipped",
    desc: "Full-stack citizen portal for community management — report issues, apply for services, pay fines, follow polls and notices.",
    tech: ["Java", "Servlets", "JSP", "MySQL", "JSTL"],
    features: [
      "Role-based access with authentication filters separating admin and citizen views",
      "Built in a team of four using MVC architecture and the DAO pattern",
      "Session management for logins, fines and document vault flows"
    ],
    repo: "https://github.com/yogeshpan1/Neighborly",
    demo: null
  },
  {
    rd: "RD 05",
    name: "Homeo",
    image: "assets/img/projects/homeo.png",
    status: "shipped",
    desc: "An Airbnb-style home booking site built for the Nepali context — search, listings and detail pages with a fully responsive layout.",
    tech: ["HTML", "CSS", "JavaScript"],
    features: [
      "Team of six — I worked on core layout and interactive components",
      "Responsive design tested across phones, tablets and desktop",
      "Built for the Code Management with VCS module"
    ],
    repo: "https://github.com/yogeshpan1/Homeo",
    demo: null
  },
  {
    rd: "RD 06",
    name: "Network Traffic Analysis",
    image: "assets/img/projects/network-traffic.png",
    status: "shipped",
    desc: "Exploratory analysis of a real network intrusion-detection dataset — statistics, correlations and a hypothesis test on attack traffic.",
    tech: ["Python", "pandas", "Matplotlib", "Seaborn"],
    features: [
      "Descriptive statistics and pairwise correlation of flow features",
      "Welch's t-test comparing mean flow duration of normal vs attack traffic",
      "Visual reporting with Matplotlib and Seaborn"
    ],
    repo: "https://github.com/yogeshpan1/NoiseFloor",
    demo: null
  }
];

var JUNIOR_SERIES = [
  { name: "PitGenius", lang: "Python", repo: "https://github.com/yogeshpan1/PitGenius" },
  { name: "BoxBox", lang: "Jupyter", repo: "https://github.com/yogeshpan1/BoxBox" },
  { name: "ChatDocs", lang: "Python", repo: "https://github.com/yogeshpan1/ChatDocs" },
  { name: "GOKART", lang: "JavaScript", repo: "https://github.com/yogeshpan1/GOKART" },
  { name: "Apex-Gaze", lang: "Python", repo: "https://github.com/yogeshpan1/Apex-Gaze" },
  { name: "Morphic", lang: "Python", repo: "https://github.com/yogeshpan1/Morphic" },
  { name: "Gokyo Bistro RMS", lang: "OOAD", repo: null },
  { name: "ETERNIA Gym", lang: "Java", repo: "https://github.com/yogeshpan1/ETERNIA-GYM-AND-FITNESS" },
  { name: "Store Management", lang: "Java", repo: "https://github.com/yogeshpan1/Store-Management-System" },
  { name: "Watch Ecommerce", lang: "Web", repo: "https://github.com/yogeshpan1/Watch-Ecommerce" }
];

function initialsOf(name) {
  return name
    .split(/\s+/)
    .map(function (w) { return w[0]; })
    .join("")
    .toUpperCase();
}

function statusLabel(status) {
  if (status === "live") return "Live";
  if (status === "wip") return "In build";
  return "Shipped";
}

function renderProjects() {
  var grid = document.getElementById("projects-grid");
  if (!grid) return;

  PROJECTS.forEach(function (p) {
    var card = document.createElement("article");
    card.className = "project-card reveal";

    var media =
      '<div class="card-media">' +
      '<div class="media-fallback" aria-hidden="true">' + initialsOf(p.name) + "</div>" +
      "</div>";

    var demoLink = p.demo
      ? '<a href="' + p.demo + '" target="_blank" rel="noopener">Live demo &#8599;</a>'
      : "";

    card.innerHTML =
      media +
      '<div class="card-body">' +
        '<div class="card-top">' +
          '<span class="card-rd">' + p.rd + " / 2026 SEASON</span>" +
          '<span class="card-status status-' + p.status + '">' + statusLabel(p.status) + "</span>" +
        "</div>" +
        '<h3 class="card-title"><a href="' + p.repo + '" target="_blank" rel="noopener">' + p.name + "</a></h3>" +
        '<p class="card-desc">' + p.desc + "</p>" +
        '<div class="tech-row">' + p.tech.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</div>" +
        '<details class="card-details">' +
          "<summary>Key features</summary>" +
          "<ul>" + p.features.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>" +
        "</details>" +
        '<div class="card-links">' +
          '<a href="' + p.repo + '" target="_blank" rel="noopener">Source &#8599;</a>' +
          demoLink +
        "</div>" +
      "</div>";

    grid.appendChild(card);

    // swap in the real screenshot if it exists, keep the initials block if not
    var img = new Image();
    img.alt = p.name + " screenshot";
    img.addEventListener("load", function () {
      card.querySelector(".card-media").innerHTML = "";
      card.querySelector(".card-media").appendChild(img);
    });
    img.src = p.image;
  });

  var list = document.getElementById("junior-list");
  if (!list) return;
  JUNIOR_SERIES.forEach(function (j) {
    var li = document.createElement("li");
    if (j.repo) {
      li.innerHTML =
        '<a href="' + j.repo + '" target="_blank" rel="noopener">' +
        j.name + '<span class="lang">' + j.lang + "</span></a>";
    } else {
      li.innerHTML = j.name + '<span class="lang">' + j.lang + "</span>";
    }
    list.appendChild(li);
  });
}

renderProjects();
