(function () {
  const navbar = document.getElementById("navbar") || document.querySelector(".navbar");
  const toggle = document.getElementById("mobileToggle") || document.querySelector(".navbar-toggle");
  const menu = document.getElementById("navMenu") || document.querySelector(".navbar-collapse");
  const year = document.getElementById("year") || document.getElementById("fyear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function setScrolled() {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 32);
    }
  }

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (toggle && menu) {
    toggle.setAttribute("aria-expanded", "false");
    if (!toggle.getAttribute("aria-label")) {
      toggle.setAttribute("aria-label", "Open menu");
    }

    toggle.addEventListener("click", function () {
      const isOpen = menu.classList.toggle("active");
      toggle.setAttribute("aria-expanded", String(isOpen));
      const icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-times", isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a") && window.innerWidth <= 1024) {
        menu.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        const icon = toggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times", "fa-xmark");
        }
      }
    });
  }

  const reveals = document.querySelectorAll(".reveal, .program-card");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active", "show", "is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("active", "show", "is-visible"));
  }
}());
