/* Belge sayfalarında TR/EN geçişi.
   Mağaza incelemecileri çoğunlukla İngilizce okur; ayrı URL yerine tek sayfada iki dil
   tutmak, mağaza konsollarına verilen bağlantının her durumda geçerli kalmasını sağlar.
   Seçim yerelde hatırlanır. #en / ?lang=en ile doğrudan İngilizce açılabilir. */
(function () {
    "use strict";

    var KEY = "stuxio-doc-lang";
    var buttons = document.querySelectorAll("[data-set-lang]");
    var panes = document.querySelectorAll("[data-lang]");
    if (!buttons.length || !panes.length) return;

    function apply(lang) {
        var found = false;
        panes.forEach(function (pane) {
            var match = pane.getAttribute("data-lang") === lang;
            pane.classList.toggle("is-active", match);
            if (match) found = true;
        });
        if (!found) return apply("tr");

        buttons.forEach(function (btn) {
            btn.setAttribute("aria-selected", String(btn.getAttribute("data-set-lang") === lang));
        });

        // Ekran okuyucular ve tarayıcı çevirisi doğru dili görsün.
        document.documentElement.setAttribute("lang", lang);

        try { localStorage.setItem(KEY, lang); } catch (e) { /* özel mod */ }
    }

    function initial() {
        var hash = (location.hash || "").replace("#", "").toLowerCase();
        if (hash === "en" || hash === "tr") return hash;

        var q = new URLSearchParams(location.search).get("lang");
        if (q === "en" || q === "tr") return q;

        try {
            var saved = localStorage.getItem(KEY);
            if (saved === "en" || saved === "tr") return saved;
        } catch (e) { /* özel mod */ }

        // Tarayıcı Türkçe değilse İngilizce göster.
        return (navigator.language || "tr").toLowerCase().indexOf("tr") === 0 ? "tr" : "en";
    }

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            apply(btn.getAttribute("data-set-lang"));
        });
    });

    apply(initial());
})();
