document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menuMobile = document.getElementById("menu-mobile");
    const mobileMenuItems =
      menuMobile?.querySelectorAll("a") ?? [];
    const sections = document.querySelectorAll(".section");
    const navContainer = document.getElementById("section-navigation");
    const scrollUpBtn = document.getElementById("scroll-up");
    const scrollDownBtn = document.getElementById("scroll-down");
    const navIndicator = document.getElementById("nav-indicator");
    const navLinks = document.querySelectorAll(".nav-link");

    let sectionRects = [];
    let navLinkRects = [];

    function cacheLayout() {
      sectionRects = Array.from(sections).map(s => ({
        id: s.getAttribute("id"),
        top: s.offsetTop
      })).sort((a, b) => a.top - b.top);

      navLinkRects = Array.from(navLinks).map(l => ({
        el: l,
        href: l.getAttribute("href"),
        width: l.offsetWidth,
        left: l.offsetLeft
      }));
    }

    function getCurrentSectionId(scrollY) {
      let id = "";
      for (const s of sectionRects) {
        if (scrollY >= s.top - 200) id = s.id;
      }
      return id;
    }

    function updateNavIndicator(scrollY) {
      const currentSectionId = getCurrentSectionId(scrollY);

      if (currentSectionId && navIndicator) {
        const targetHref = "#" + currentSectionId;
        const linkRect = navLinkRects.find(r => r.href === targetHref);
        if (linkRect) {
          navIndicator.style.width = linkRect.width + "px";
          navIndicator.style.left = linkRect.left + "px";
          navIndicator.style.opacity = "1";

          navLinks.forEach(link => {
            link.classList.remove("text-cyan-400", "scale-110");
            link.classList.add("text-gray-400");
          });
          linkRect.el.classList.add("text-cyan-400", "scale-110");
          linkRect.el.classList.remove("text-gray-400");
        }
      } else if (navIndicator) {
        navIndicator.style.opacity = "0";
      }
    }

    function updateNavigation(scrollY) {
      navContainer?.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
      navContainer?.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");

      if (scrollY < 100) {
        scrollUpBtn?.classList.add("opacity-0", "pointer-events-none", "scale-90");
        scrollUpBtn?.classList.remove("opacity-100", "pointer-events-auto", "scale-100");
      } else {
        scrollUpBtn?.classList.remove("opacity-0", "pointer-events-none", "scale-90");
        scrollUpBtn?.classList.add("opacity-100", "pointer-events-auto", "scale-100");
      }

      const lastSection = sectionRects[sectionRects.length - 1];
      const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 100);
      const isInLastSection = lastSection && scrollY >= lastSection.top - 300;

      if (isAtBottom || isInLastSection) {
        scrollDownBtn?.classList.add("opacity-0", "pointer-events-none", "scale-90");
        scrollDownBtn?.classList.remove("opacity-100", "pointer-events-auto", "scale-100");
      } else {
        scrollDownBtn?.classList.remove("opacity-0", "pointer-events-none", "scale-90");
        scrollDownBtn?.classList.add("opacity-100", "pointer-events-auto", "scale-100");
      }

      updateNavIndicator(scrollY);
    }

    menuToggle?.addEventListener("click", function () {
      menuMobile?.classList.toggle("active");
    });

    mobileMenuItems.forEach((item) => {
      item.addEventListener("click", function () {
        menuMobile?.classList.remove("active");
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    var _scrollRaf = null;
    window.addEventListener("scroll", function() {
      if (_scrollRaf) return;
      _scrollRaf = requestAnimationFrame(function() {
        _scrollRaf = null;
        updateNavigation(window.scrollY);
      });
    });

    window.addEventListener("resize", cacheLayout);
    cacheLayout();
    updateNavigation(window.scrollY);

    scrollUpBtn?.addEventListener("click", () => {
      const scrollY = window.scrollY;
      const prevSection = [...sectionRects]
        .reverse()
        .find(s => s.top < scrollY - 50);
      window.scrollTo({ top: prevSection ? prevSection.top : 0, behavior: "smooth" });
    });

    scrollDownBtn?.addEventListener("click", () => {
      const scrollY = window.scrollY;
      const nextSection = sectionRects
        .find(s => s.top > scrollY + 50);
      if (nextSection) {
        window.scrollTo({ top: nextSection.top, behavior: "smooth" });
      }
    });
  });
