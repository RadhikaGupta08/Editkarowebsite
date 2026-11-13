/* =====================================================
   EDITKARO — DARK / LIGHT MODE
   Ye file <head> me load hoti hai taaki page flash na ho.
===================================================== */

(function () {

    var KEY = "editkaro-theme";

    var root = document.documentElement;

    function getSaved() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function save(value) {
        try { localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
    }

    var theme = getSaved();

    // Pehli baar: device ki setting follow karo
    if (!theme && window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches) {
        theme = "light";
    }

    if (theme === "light") root.classList.add("light-mode");

    document.addEventListener("DOMContentLoaded", function () {

        var button = document.getElementById("dark-toggle");

        if (!button) return;

        var icon = button.querySelector("i");

        function sync() {

            var light = root.classList.contains("light-mode");

            if (icon) icon.className = light ? "fa-solid fa-sun" : "fa-solid fa-moon";

            button.setAttribute("aria-pressed", String(light));

            button.setAttribute("aria-label",
                light ? "Switch to dark mode" : "Switch to light mode");

        }

        sync();

        button.addEventListener("click", function () {

            root.classList.toggle("light-mode");

            save(root.classList.contains("light-mode") ? "light" : "dark");

            sync();

        });

    });

})();
