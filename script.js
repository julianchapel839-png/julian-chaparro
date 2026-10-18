/* =========================================================
   Julián Chaparro — interacciones del sitio
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Año del footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav y barra de progreso al hacer scroll ---------- */
  const nav = document.getElementById("nav");
  const bar = document.getElementById("progressBar");
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };
  onScroll();
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- Nav móvil ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (links.classList.contains("is-open") && !links.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  /* ---------- Reveal al entrar en viewport ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => {
      // Escalona los hijos de un mismo grupo
      const parent = el.closest(".grid, .projects, .cases, .timeline, .hero__grid, .about__bridge");
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll(".reveal"));
        el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 80 + "ms";
      }
      io.observe(el);
    });

    // Revela de inmediato lo que ya está en pantalla (el hero no espera al observer)
    requestAnimationFrame(() => {
      revealEls.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    });
  }

  /* ---------- Luz que sigue al cursor sobre las tarjetas ---------- */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".spot").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Hero: constelación (atalaya + red) ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes, raf;
    const GOLD = "201, 162, 75";
    const COOL = "120, 150, 185";

    const config = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(64, Math.floor((w * h) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6,
        gold: Math.random() < 0.28,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Líneas entre nodos cercanos
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 138) {
            const alpha = (1 - dist / 138) * 0.16;
            ctx.strokeStyle = `rgba(${COOL}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // Nodos
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const color = n.gold ? GOLD : COOL;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${n.gold ? 0.85 : 0.5})`;
        ctx.fill();
        if (n.gold) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GOLD}, 0.12)`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(config, 200);
    };

    config();
    draw();
    window.addEventListener("resize", onResize);

    // Pausa cuando el hero no es visible (ahorra batería)
    if ("IntersectionObserver" in window) {
      const heroIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { if (!raf) draw(); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 });
      heroIO.observe(canvas);
    }
  }

  /* ---------- Resaltar enlace activo del nav ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');
  if ("IntersectionObserver" in window && navAnchors.length) {
    const map = {};
    navAnchors.forEach((a) => { map[a.getAttribute("href").slice(1)] = a; });
    const spyIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // De vuelta en la portada: ningún enlace queda activo
          if (entry.target.id === "inicio" && entry.isIntersecting) {
            navAnchors.forEach((x) => x.classList.remove("is-active"));
            return;
          }
          const a = map[entry.target.id];
          if (!a) return;
          if (entry.isIntersecting) {
            navAnchors.forEach((x) => x.classList.remove("is-active"));
            a.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spyIO.observe(s));
  }
})();
