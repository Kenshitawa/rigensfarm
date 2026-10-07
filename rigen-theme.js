/**
 * RigenFarms Modern Theme Script (rigen-theme.js)
 * Clean, performant, accessible vanilla JavaScript
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ── 1. Dynamic Year ───────────────────────────────────── */
  const yrEl = document.getElementById("yr");
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  /* ── 2. Sticky Glass Header ────────────────────────────── */
  const hdr = document.getElementById("header");
  if (hdr) {
    const isAlwaysLight = hdr.classList.contains("header-light");
    const syncHdr = () => {
      if (!isAlwaysLight) {
        hdr.classList.toggle("solid", window.scrollY > 25);
      }
    };
    syncHdr();
    window.addEventListener("scroll", syncHdr, { passive: true });
  }

  /* ── 3. Active Nav Link Auto-Highlight ─────────────────── */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mob-menu a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ── 4. Mobile Drawer ─────────────────────────────────── */
  const ham = document.getElementById("ham");
  const mobMenu = document.getElementById("mobMenu");
  if (ham && mobMenu) {
    const toggleMob = (forceOpen) => {
      const isOpen = typeof forceOpen === "boolean" ? forceOpen : !mobMenu.classList.contains("open");
      mobMenu.classList.toggle("open", isOpen);
      ham.setAttribute("aria-expanded", String(isOpen));
      if (hdr && !hdr.classList.contains("header-light")) {
        hdr.classList.toggle("solid", isOpen || window.scrollY > 25);
      }
      ham.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    ham.addEventListener("click", () => toggleMob());
    mobMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMob(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobMenu.classList.contains("open")) toggleMob(false);
    });
  }

  /* ── 5. Dropdown Navigation ────────────────────────────── */
  const dropBtns = Array.from(document.querySelectorAll(".drop-btn"));
  const closeAllDrops = (exceptBtn) => {
    dropBtns.forEach((btn) => {
      if (btn === exceptBtn) return;
      btn.setAttribute("aria-expanded", "false");
      const menu = btn.nextElementSibling;
      if (menu && menu.classList.contains("drop-menu")) {
        menu.classList.remove("open");
      }
    });
  };

  dropBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = btn.getAttribute("aria-expanded") !== "true";
      closeAllDrops(btn);
      btn.setAttribute("aria-expanded", String(willOpen));
      const menu = btn.nextElementSibling;
      if (menu && menu.classList.contains("drop-menu")) {
        menu.classList.toggle("open", willOpen);
      }
    });
  });

  document.addEventListener("click", () => closeAllDrops());
  document.querySelectorAll(".drop-menu").forEach((m) => m.addEventListener("click", (e) => e.stopPropagation()));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDrops();
  });

  /* ── 6. Accordion Component ───────────────────────────── */
  document.querySelectorAll(".accordion").forEach((acc) => {
    const btn = acc.querySelector(".acc-btn");
    const content = acc.querySelector(".acc-content");
    if (!btn || !content) return;

    btn.addEventListener("click", () => {
      const isActive = acc.classList.contains("active");
      // Optional single-open: close siblings if desired
      acc.classList.toggle("active", !isActive);
      btn.setAttribute("aria-expanded", String(!isActive));
      content.style.maxHeight = !isActive ? `${content.scrollHeight + 32}px` : null;
    });
  });

  /* ── 7. Tab Component ─────────────────────────────────── */
  document.querySelectorAll("[data-tabs]").forEach((tabContainer) => {
    const tabBtns = tabContainer.querySelectorAll(".tab-btn");
    const targetGroupId = tabContainer.getAttribute("data-tabs");
    const tabPanes = document.querySelectorAll(`[data-tab-group="${targetGroupId}"] .tab-pane`);

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        tabBtns.forEach((b) => b.classList.toggle("active", b === btn));
        tabPanes.forEach((p) => {
          const match = targetTab === "all" || p.getAttribute("data-tab-id") === targetTab;
          p.classList.toggle("active", match);
          if (match && p.classList.contains("rv")) p.classList.add("in");
        });
      });
    });
  });

  /* ── 8. Scroll Reveal (IntersectionObserver) ───────────── */
  if ("IntersectionObserver" in window) {
    const rvObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            rvObs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv:not(.in)").forEach((el) => rvObs.observe(el));
  } else {
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
  }

  /* ── 9. Animated Counter ───────────────────────────────── */
  if ("IntersectionObserver" in window) {
    const cntObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const target = Number(en.target.dataset.count || 0);
          if (!target) return;
          const dur = 1400;
          const start = performance.now();
          const suffix = en.target.dataset.suffix || (target >= 100 ? "+" : "");
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            en.target.textContent = Math.floor(ease * target).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cntObs.unobserve(en.target);
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => cntObs.observe(el));
  }

  /* ── 10. Universal Lightbox ────────────────────────────── */
  const lb = document.getElementById("lb");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const triggers = Array.from(document.querySelectorAll(".lightbox-trigger, .gi"));
  let curIndex = 0;

  if (lb && lbImg && triggers.length > 0) {
    const openLightbox = (idx) => {
      curIndex = idx;
      const item = triggers[idx];
      const src = item.dataset.img || item.getAttribute("src") || item.querySelector("img")?.getAttribute("src");
      const alt = item.dataset.cap || item.getAttribute("alt") || item.querySelector("img")?.getAttribute("alt") || "RigenFarms Field Gallery";
      if (!src) return;
      lbImg.src = src;
      lbImg.alt = alt;
      lb.classList.add("open");
      if (lbClose) lbClose.focus();
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lb.classList.remove("open");
      lbImg.src = "";
      document.body.style.overflow = "";
      if (triggers[curIndex]) triggers[curIndex].focus();
    };

    const navigateLightbox = (dir) => {
      openLightbox((curIndex + dir + triggers.length) % triggers.length);
    };

    triggers.forEach((item, i) => {
      item.style.cursor = "pointer";
      item.setAttribute("tabindex", "0");
      item.addEventListener("click", () => openLightbox(i));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lbPrev) lbPrev.addEventListener("click", () => navigateLightbox(-1));
    if (lbNext) lbNext.addEventListener("click", () => navigateLightbox(1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    });
  }

  /* ── 11. Newsletter Form Handler ───────────────────────── */
  document.querySelectorAll(".newsf").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value) {
        const btn = form.querySelector("button");
        const originalContent = btn ? btn.innerHTML : "";
        if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        input.value = "";
        input.placeholder = "Thank you for subscribing!";
        setTimeout(() => {
          if (btn) btn.innerHTML = originalContent;
          input.placeholder = "Enter your email";
        }, 4000);
      }
    });
  });
});
