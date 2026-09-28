/* Stuxio — arayüz davranışları. Harici bağımlılık yok.

   Hepsi ilerlemeli: script çalışmazsa menü bağlantıları görünür, içerik açıktır,
   sekmelerin ilk paneli gösterilir. `reveal` gizlemesi CSS'te `.js` sınıfına
   bağlı ve o sınıf burada eklenir.

   Hareket kuralı: hareket bir DURUM değişikliğini anlatır (seans başladı, mod
   değişti, kayıt eşitlendi). Süs için hareket yok; sürekli dönen/yüzen öğe yok.
   prefers-reduced-motion açıksa otomatik geçişler hiç çalışmaz. */
(function () {
    "use strict";

    document.documentElement.classList.add("js");

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    /* ── Üst çubuk: kaydırma durumu + okuma ilerlemesi ───────────────────── */
    var nav = document.querySelector(".site-nav");
    var bar = document.querySelector("[data-progress]");
    if (nav) {
        var ticking = false;
        var onScroll = function () {
            ticking = false;
            nav.classList.toggle("is-scrolled", window.scrollY > 8);
            if (bar) {
                var max = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
            }
        };
        onScroll();
        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
        }, { passive: true });
    }

    /* ── Sekme davranışı (ortak) ─────────────────────────────────────────────
       WAI-ARIA sekme deseni: ok tuşları arasında gezinir, Home/End uçlara gider.
       `onSelect(index, tab)` seçim değişince çağrılır. */
    function tablist(list, onSelect) {
        var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
        function select(i, focus) {
            tabs.forEach(function (t, j) {
                var on = i === j;
                t.setAttribute("aria-selected", String(on));
                t.tabIndex = on ? 0 : -1;
                var panel = t.getAttribute("aria-controls");
                if (panel) {
                    var p = document.getElementById(panel);
                    if (p) p.hidden = !on;
                }
            });
            if (focus) tabs[i].focus();
            onSelect && onSelect(i, tabs[i]);
        }
        tabs.forEach(function (t, i) {
            t.addEventListener("click", function () { select(i, false); });
            t.addEventListener("keydown", function (e) {
                var k = e.key, n = tabs.length, to = null;
                if (k === "ArrowRight" || k === "ArrowDown") to = (i + 1) % n;
                else if (k === "ArrowLeft" || k === "ArrowUp") to = (i - 1 + n) % n;
                else if (k === "Home") to = 0;
                else if (k === "End") to = n - 1;
                if (to !== null) { e.preventDefault(); select(to, true); }
            });
        });
        return { select: select, tabs: tabs };
    }

    /* ── Hero: çalışma odası ↔ odak modu ─────────────────────────────────────
       Görünür olduktan bir süre sonra BİR KEZ odak moduna geçer — "Başlat'a
       basıldı" anı. Beklerken sekmenin alt çizgisi kehribar renkte dolar.
       Kullanıcı sekmeye dokunduğu an otomatik geçiş iptal olur. */
    var states = document.querySelector("[data-states]");
    if (states) {
        var legends = document.querySelectorAll("[data-legend]");
        var auto = null;
        var hero = tablist(states, function (i, tab) {
            var id = tab.getAttribute("aria-controls");
            legends.forEach(function (l) { l.hidden = l.getAttribute("data-legend") !== id; });
        });
        var cancel = function () {
            if (auto) { clearTimeout(auto); auto = null; }
            hero.tabs[1].classList.remove("is-counting");
        };
        states.addEventListener("pointerdown", cancel);
        states.addEventListener("keydown", cancel);

        if (!reduce && "IntersectionObserver" in window) {
            var WAIT = 3200;
            var seen = new IntersectionObserver(function (entries) {
                if (!entries[0].isIntersecting) return;
                seen.disconnect();
                hero.tabs[1].style.setProperty("--wait", WAIT + "ms");
                // Bir kare bekle: geçiş başlangıç durumundan başlasın.
                requestAnimationFrame(function () { hero.tabs[1].classList.add("is-counting"); });
                auto = setTimeout(function () {
                    hero.tabs[1].classList.remove("is-counting");
                    hero.select(1, false);
                    auto = null;
                }, WAIT);
            }, { threshold: 0.5 });
            seen.observe(document.getElementById("st-oda"));
        }
    }

    /* ── Odak: mod kadranı ───────────────────────────────────────────────────
       Kadran bir saati (60 dk) temsil eder; yay uzunlukları oranla: Klasik 25+5
       kadranın yarısı, Derin 50+10 tamamı. pathLength=100 olduğundan değerler
       yüzde. Yaylar arasında küçük bir boşluk bırakılır ki ayrı okunsun. */
    var modes = document.querySelector("[data-modes]");
    var dial = document.querySelector("[data-dial]");
    if (modes && dial) {
        var work = dial.querySelector("[data-work]");
        var rest = dial.querySelector("[data-rest]");
        var time = document.querySelector("[data-dial-time]");
        var note = document.querySelector("[data-dial-note]");
        var GAP = 0.8;
        var paint = function (tab) {
            var w = parseFloat(tab.getAttribute("data-work")) / 60 * 100;
            var r = parseFloat(tab.getAttribute("data-rest")) / 60 * 100;
            work.setAttribute("stroke-dasharray", (w ? w - GAP / 2 : 0) + " 100");
            rest.setAttribute("stroke-dasharray", (r ? r - GAP : 0) + " 100");
            rest.setAttribute("stroke-dashoffset", String(-(w + GAP / 2)));
            work.style.opacity = w ? 1 : 0;
            rest.style.opacity = r ? 1 : 0;
            time.textContent = tab.getAttribute("data-time");
            note.textContent = tab.getAttribute("data-note");
        };
        var m = tablist(modes, function (i, tab) { paint(tab); });
        m.tabs.forEach(function (t) { if (t.getAttribute("aria-selected") === "true") paint(t); });
    }

    /* ── Masaüstü ekran sekmeleri ────────────────────────────────────────── */
    var dtabs = document.querySelector("[data-tabs]");
    if (dtabs) tablist(dtabs);

    /* ── Etkin bölüm (üst menü) ──────────────────────────────────────────────
       Menüdeki bağlantılardan hangisinin bölümü ekranın ortasındaysa işaretlenir. */
    if (menu && "IntersectionObserver" in window) {
        var links = {};
        menu.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
        var ids = Object.keys(links);
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                var a = links[en.target.id];
                if (!a) return;
                if (en.isIntersecting) {
                    ids.forEach(function (id) { links[id].removeAttribute("aria-current"); });
                    a.setAttribute("aria-current", "true");
                } else if (a.getAttribute("aria-current")) {
                    a.removeAttribute("aria-current");
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        ids.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
    }

    /* ── Beliren bölümler ────────────────────────────────────────────────── */
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

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
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.04 });

    targets.forEach(function (el) { io.observe(el); });
})();
