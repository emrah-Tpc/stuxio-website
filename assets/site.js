/* Stuxio — arayüz davranışları. Harici bağımlılık yok.

   Üç iş yapar: mobil menü, kaydırma durumunda üst çubuk, beliren bölümler.
   Hepsi ilerlemeli: script çalışmazsa menü bağlantıları zaten görünür, içerik açıktır.
   Bu yüzden `reveal` gizlemesi CSS'te `.js` sınıfına bağlı ve o sınıf burada eklenir. */
(function () {
    "use strict";

    document.documentElement.classList.add("js");

    /* ── Mobil menü ──────────────────────────────────────────────────────── */
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.getElementById("nav-menu");

    if (toggle && menu) {
        var setOpen = function (open) {
            menu.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
        };

        toggle.addEventListener("click", function () {
            setOpen(!menu.classList.contains("is-open"));
        });

        // Bir bağlantıya dokunulduğunda menü kapanmalı: aynı sayfa içi çapa
        // bağlantılarında sayfa değişmediği için menü açık kalıp içeriği örterdi.
        menu.addEventListener("click", function (e) {
            if (e.target.closest("a")) setOpen(false);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && menu.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });

        // Masaüstü genişliğine dönülürse açık kalan menü CSS'te gizlenir ama
        // aria durumu yanlış kalırdı; ekran okuyucu için sıfırlanır.
        window.addEventListener("resize", function () {
            if (window.innerWidth > 860 && menu.classList.contains("is-open")) setOpen(false);
        });
    }

    /* ── Üst çubuk kaydırma durumu ───────────────────────────────────────── */
    var nav = document.querySelector(".site-nav");
    if (nav) {
        var onScroll = function () {
            nav.classList.toggle("is-scrolled", window.scrollY > 8);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ── Beliren bölümler ────────────────────────────────────────────────── */
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
        targets.forEach(function (el) { el.classList.add("is-visible"); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target); // bir kez belirir; ileri geri kaydırmada titremez
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    targets.forEach(function (el) { io.observe(el); });
})();
