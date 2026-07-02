"use strict";

const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navWrap = document.querySelector("[data-nav-wrap]");
const siteHeader = document.querySelector(".site-header");
const scrollTopButton = document.querySelector("[data-scroll-top]");

function preferredTheme() {
  const savedTheme = localStorage.getItem("rupee-theory-theme");
  if (savedTheme) return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("rupee-theory-theme", theme);
  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.title = `Switch to ${nextTheme} mode`;
  }
}

setTheme(preferredTheme());

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  window.dispatchEvent(new Event("themechange"));
});

function closeMenu() {
  navWrap?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navWrap?.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});

function updateScrollUI() {
  const hasScrolled = window.scrollY > 16;
  siteHeader?.classList.toggle("scrolled", hasScrolled);
  scrollTopButton?.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      const suffix = element.dataset.suffix || "";
      const duration = 1200;
      const startTime = performance.now();

      function animate(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased).toLocaleString("en-IN")}${suffix}`;
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      statObserver.unobserve(element);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll("[data-count]").forEach((element) => statObserver.observe(element));

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

function setupFilter(inputSelector, itemSelector, emptySelector, countSelector) {
  const input = document.querySelector(inputSelector);
  const items = [...document.querySelectorAll(itemSelector)];
  const emptyState = document.querySelector(emptySelector);
  const count = document.querySelector(countSelector);
  if (!input || !items.length) return;

  function filterItems() {
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const matches = item.textContent.toLowerCase().includes(query);
      item.hidden = !matches;
      if (matches) visible += 1;
    });

    if (emptyState) emptyState.style.display = visible ? "none" : "block";
    if (count) count.textContent = `${visible} ${visible === 1 ? "result" : "results"}`;
  }

  input.addEventListener("input", filterItems);
  filterItems();
}

setupFilter("[data-term-search]", "[data-term]", "[data-term-empty]", "[data-term-count]");

const articleSearch = document.querySelector("[data-article-search]");
const articleCards = [...document.querySelectorAll("[data-article]")];
const articleCategoryButtons = [...document.querySelectorAll("[data-article-category]")];
const articleEmpty = document.querySelector("[data-article-empty]");
const articleCount = document.querySelector("[data-article-count]");
let activeArticleCategory = "all";

function filterArticles() {
  if (!articleCards.length) return;
  const query = articleSearch?.value.trim().toLowerCase() || "";
  let visible = 0;

  articleCards.forEach((card) => {
    const matchesSearch = card.textContent.toLowerCase().includes(query);
    const matchesCategory = activeArticleCategory === "all" || card.dataset.category === activeArticleCategory;
    const matches = matchesSearch && matchesCategory;
    card.hidden = !matches;
    if (matches) visible += 1;
  });

  if (articleEmpty) articleEmpty.style.display = visible ? "none" : "block";
  if (articleCount) articleCount.textContent = `${visible} ${visible === 1 ? "article" : "articles"}`;
}

articleSearch?.addEventListener("input", filterArticles);
articleCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeArticleCategory = button.dataset.articleCategory;
    articleCategoryButtons.forEach((item) => item.classList.toggle("active", item === button));
    filterArticles();
  });
});
filterArticles();

const termSearch = document.querySelector("[data-term-search]");
const termCards = [...document.querySelectorAll("[data-term]")];
const alphabetButtons = [...document.querySelectorAll("[data-letter-filter]")];
let activeLetter = "all";

function filterTermsByLetter() {
  if (!termCards.length || !alphabetButtons.length) return;
  const query = termSearch?.value.trim().toLowerCase() || "";
  let visible = 0;

  termCards.forEach((card) => {
    const title = card.querySelector("h2")?.textContent.trim() || "";
    const matchesSearch = card.textContent.toLowerCase().includes(query);
    const matchesLetter = activeLetter === "all" || title.toUpperCase().startsWith(activeLetter);
    const matches = matchesSearch && matchesLetter;
    card.hidden = !matches;
    if (matches) visible += 1;
  });

  const emptyState = document.querySelector("[data-term-empty]");
  const count = document.querySelector("[data-term-count]");
  if (emptyState) emptyState.style.display = visible ? "none" : "block";
  if (count) count.textContent = `${visible} ${visible === 1 ? "result" : "results"}`;
}

alphabetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeLetter = button.dataset.letterFilter;
    alphabetButtons.forEach((item) => item.classList.toggle("active", item === button));
    filterTermsByLetter();
  });
});
termSearch?.addEventListener("input", filterTermsByLetter);

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector("[data-form-message]");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (message) {
      message.textContent = form.dataset.success || "Thank you. Your message has been received.";
      message.classList.add("success");
    }
    form.reset();
  });
});

function showToast(message, type = "success") {
  let region = document.querySelector(".toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.appendChild(toast);
  window.setTimeout(() => toast.remove(), 5000);
}

const emailForm = document.querySelector("[data-emailjs-form]");

if (emailForm) {
  const submitButton = emailForm.querySelector('button[type="submit"]');
  const statusMessage = emailForm.querySelector("[data-form-message]");
  let lastSubmission = 0;

  emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!emailForm.checkValidity()) {
      emailForm.reportValidity();
      return;
    }

    const honeypot = emailForm.querySelector('[name="website"]');
    if (honeypot?.value) return;

    const now = Date.now();
    if (now - lastSubmission < 15000) {
      showToast("Please wait a few seconds before sending another message.", "error");
      return;
    }

    const config = window.RUPEE_THEORY_EMAILJS || {};
    const isConfigured = [config.publicKey, config.serviceId, config.templateId]
      .every((value) => value && !value.startsWith("YOUR_"));
    if (!window.emailjs || !isConfigured) {
      const message = "EmailJS is ready for setup. Add your keys in assets/js/emailjs-config.js.";
      if (statusMessage) statusMessage.textContent = message;
      showToast(message, "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add("loading");
    submitButton.setAttribute("aria-busy", "true");
    if (statusMessage) statusMessage.textContent = "Sending your message...";

    try {
      window.emailjs.init({ publicKey: config.publicKey });
      await window.emailjs.sendForm(config.serviceId, config.templateId, emailForm);
      lastSubmission = now;
      emailForm.reset();
      if (statusMessage) {
        statusMessage.textContent = "Message sent successfully. We will reply soon.";
        statusMessage.classList.add("success");
      }
      showToast("Your message was sent successfully.");
    } catch (error) {
      console.error("EmailJS send failed:", error);
      const message = "We could not send the message. Please try again or email us directly.";
      if (statusMessage) statusMessage.textContent = message;
      showToast(message, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
      submitButton.removeAttribute("aria-busy");
    }
  });
}

const sipForm = document.querySelector("[data-sip-form]");

if (sipForm) {
  const monthlyInput = document.querySelector("#monthlyInvestment");
  const returnInput = document.querySelector("#annualReturn");
  const yearsInput = document.querySelector("#durationYears");
  const monthlyRange = document.querySelector("#monthlyRange");
  const returnRange = document.querySelector("#returnRange");
  const yearsRange = document.querySelector("#yearsRange");
  const totalInvestedEl = document.querySelector("[data-total-invested]");
  const wealthGainedEl = document.querySelector("[data-wealth-gained]");
  const futureValueEl = document.querySelector("[data-future-value]");
  const errorEl = document.querySelector("[data-calc-error]");
  const canvas = document.querySelector("#sipChart");

  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  function syncPair(input, range) {
    input.addEventListener("input", () => {
      range.value = input.value;
      calculateSIP();
    });
    range.addEventListener("input", () => {
      input.value = range.value;
      calculateSIP();
    });
  }

  syncPair(monthlyInput, monthlyRange);
  syncPair(returnInput, returnRange);
  syncPair(yearsInput, yearsRange);

  function buildProjection(monthly, annualRate, years) {
    const monthlyRate = annualRate / 12 / 100;
    const points = [{ year: 0, invested: 0, value: 0 }];
    let value = 0;

    for (let month = 1; month <= years * 12; month += 1) {
      value = monthlyRate === 0 ? value + monthly : (value + monthly) * (1 + monthlyRate);
      if (month % 12 === 0) {
        points.push({
          year: month / 12,
          invested: monthly * month,
          value,
        });
      }
    }

    return points;
  }

  function drawChart(points) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * scale));
    canvas.height = Math.max(1, Math.floor(rect.height * scale));
    ctx.scale(scale, scale);

    const width = rect.width;
    const height = rect.height;
    const styles = getComputedStyle(root);
    const textColor = styles.getPropertyValue("--muted").trim();
    const borderColor = styles.getPropertyValue("--border").trim();
    const primaryColor = styles.getPropertyValue("--primary").trim();
    const accentColor = styles.getPropertyValue("--accent").trim();
    const padding = { top: 20, right: 16, bottom: 42, left: 66 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...points.map((point) => point.value)) * 1.1 || 1;
    const maxYear = Math.max(...points.map((point) => point.year)) || 1;

    ctx.clearRect(0, 0, width, height);
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillStyle = textColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (plotHeight / 4) * i;
      const value = maxValue * (1 - i / 4);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.textAlign = "right";
      ctx.fillText(compactCurrency(value), padding.left - 9, y + 4);
    }

    const yearStep = maxYear <= 10 ? 2 : maxYear <= 20 ? 5 : 10;
    points.forEach((point) => {
      if (point.year % yearStep !== 0 && point.year !== maxYear) return;
      const x = padding.left + (point.year / maxYear) * plotWidth;
      ctx.textAlign = "center";
      ctx.fillText(`${point.year}Y`, x, height - 15);
    });

    function drawLine(key, color, fill = false) {
      ctx.beginPath();
      points.forEach((point, index) => {
        const x = padding.left + (point.year / maxYear) * plotWidth;
        const y = padding.top + plotHeight - (point[key] / maxValue) * plotHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      if (fill) {
        const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        gradient.addColorStop(0, `${color}33`);
        gradient.addColorStop(1, `${color}00`);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    drawLine("value", primaryColor, true);
    drawLine("invested", accentColor);
  }

  function compactCurrency(value) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${Math.round(value)}`;
  }

  function calculateSIP(event) {
    event?.preventDefault();
    const monthly = Number(monthlyInput.value);
    const annualRate = Number(returnInput.value);
    const years = Number(yearsInput.value);

    if (monthly < 500 || annualRate < 0 || years < 1 || years > 50) {
      errorEl.textContent = "Enter at least ₹500, a valid return, and a duration from 1 to 50 years.";
      return;
    }

    errorEl.textContent = "";
    const points = buildProjection(monthly, annualRate, years);
    const finalValue = points.at(-1).value;
    const invested = monthly * years * 12;
    const wealthGained = finalValue - invested;

    animateCurrency(totalInvestedEl, invested);
    animateCurrency(wealthGainedEl, wealthGained);
    animateCurrency(futureValueEl, finalValue);
    drawChart(points);
  }

  function animateCurrency(element, value) {
    if (!element) return;
    const duration = 450;
    const startTime = performance.now();
    element.classList.remove("result-flash");

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = currency.format(value * eased);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        element.classList.add("result-flash");
      }
    }

    requestAnimationFrame(frame);
  }

  sipForm.addEventListener("submit", calculateSIP);
  window.addEventListener("resize", () => calculateSIP());
  window.addEventListener("themechange", () => calculateSIP());
  calculateSIP();
}
