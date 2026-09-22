/* RESONANT VESSELS — main.js
   Restrained motion only: hero parallax, entrance fades, accordion nav.
   No marquees, no scroll-jacking. */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- hero parallax (layered, subtle) ---- */
  var heroMedia = document.querySelector(".hero-media");
  if (heroMedia && !prefersReduced) {
    var veil = document.querySelector(".hero-veil");
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        if (y < window.innerHeight * 1.4) {
          heroMedia.style.transform = "translateY(" + y * 0.22 + "px)";
          if (veil) veil.style.transform = "translateY(" + y * 0.1 + "px)";
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- entrance fades ---- */
  var faders = document.querySelectorAll(".fade-in");
  if (faders.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      faders.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      faders.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- accordion outline nav ----
     <details> based; JS adds: open the group containing the current hash,
     only one group open at a time, and scroll-spy highlighting. */
  var outline = document.querySelector(".outline");
  if (outline) {
    var groups = outline.querySelectorAll("details");
    groups.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) {
          groups.forEach(function (other) {
            if (other !== d && other.open && !other.hasAttribute("data-allow-open")) {
              other.open = false;
            }
          });
        }
      });
    });

    // open the group that contains a link to the current hash
    if (window.location.hash) {
      var target = outline.querySelector('a[href="' + window.location.hash + '"]');
      if (target) {
        var parent = target.closest("details");
        if (parent) parent.open = true;
      }
    }

    // scroll-spy: mark the in-view section link
    var links = outline.querySelectorAll("details li a[href^='#']");
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) sections.push({ a: a, sec: sec });
    });
    if (sections.length && "IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (a) { a.style.color = ""; });
            var hit = sections.find(function (s) { return s.sec === entry.target; });
            if (hit) {
              hit.a.style.color = "var(--gold-bright)";
              var pd = hit.a.closest("details");
              if (pd && !pd.open) pd.open = true;
            }
          }
        });
      }, { rootMargin: "-30% 0px -55% 0px" });
      sections.forEach(function (s) { spy.observe(s.sec); });
    }
  }

  /* ---- footnote back-references: smooth return ---- */
  document.querySelectorAll(".footnotes li").forEach(function (li) {
    var back = li.querySelector("a.fn-back");
    if (back) {
      back.addEventListener("click", function (e) {
        e.preventDefault();
        var ref = document.getElementById(back.getAttribute("href").slice(1));
        if (ref) ref.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      });
    }
  });

  /* ---- external links open in place; mark them ---- */
  document.querySelectorAll("a[href^='http']").forEach(function (a) {
    a.setAttribute("rel", "noopener");
  });
})();
