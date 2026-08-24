// Contact form backend.
// Validates and sanitizes input, drops bot submissions, stores messages
// locally and emails them if SMTP is configured. No secrets in this file.

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACT_TO = process.env.CONTACT_TO || "yogeshpant911@gmail.com";

const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.jsonl");

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://avatars.githubusercontent.com", "https://github.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.github.com"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

// generous for browsing, tight for the form
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }));

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

function saveMessage(record) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.appendFileSync(MESSAGES_FILE, JSON.stringify(record) + "\n");
}

function mailer() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  // lazy require so the app runs fine without SMTP configured
  const nodemailer = require("nodemailer");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

app.post("/api/contact", function (req, res) {
  const body = req.body || {};

  // honeypot field: real users never fill it. Pretend success, store nothing.
  if (body.company) {
    return res.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ ok: false, error: "Name must be between 2 and 100 characters." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "A valid email is required." });
  }
  if (message.length < 10 || message.length > 4000) {
    return res.status(400).json({ ok: false, error: "Message must be between 10 and 4000 characters." });
  }

  const record = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeHtml(message)
  };

  try {
    saveMessage(record);
  } catch (err) {
    console.error("failed to persist message:", err.message);
    return res.status(500).json({ ok: false, error: "Could not store the message. Try again later." });
  }

  const transport = mailer();
  if (transport) {
    transport.sendMail({
      from: '"Portfolio" <' + process.env.SMTP_USER + ">",
      to: CONTACT_TO,
      replyTo: email,
      subject: "Portfolio contact: " + name,
      text: message
    }).catch(function (err) {
      console.error("smtp send failed:", err.message);
    });
  }

  res.json({ ok: true });
});

app.use("/api", function (req, res) {
  res.status(404).json({ ok: false, error: "Unknown endpoint." });
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // malformed JSON bodies and the like land here
  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    return res.status(400).json({ ok: false, error: "Bad request body." });
  }
  console.error("unhandled error:", err.message);
  res.status(500).json({ ok: false, error: "Something went wrong." });
});

app.listen(PORT, function () {
  console.log("Portfolio running on http://localhost:" + PORT);
});
