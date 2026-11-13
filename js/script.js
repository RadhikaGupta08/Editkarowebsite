/* =====================================================
   EDITKARO — MAIN JAVASCRIPT
   Loader, mobile menu, FAQ, animations, typing text,
   scroll progress, video fallbacks, social links.
===================================================== */

(function () {

    "use strict";

    const cfg = window.EDITKARO || {};

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const saveData =
        navigator.connection && navigator.connection.saveData;


    /* ---------- LOADER ---------- */

    function hideLoader() {

        const loader = $("#loader");

        if (!loader || loader.classList.contains("loader-hide")) return;

        loader.classList.add("loader-hide");

        setTimeout(() => loader.remove(), 700);

    }

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader);
    }

    // Agar koi external file load hone me atak jaye to bhi site na ruke
    setTimeout(hideLoader, 3000);


    /* ---------- AOS SCROLL ANIMATIONS ---------- */

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 800,
            once: true,
            offset: 80,
            disable: reducedMotion
        });

    } else {

        // AOS load nahi hua to content hidden na reh jaye
        document.documentElement.classList.add("no-aos");

    }


    /* ---------- TYPING TEXT ---------- */

    const typingTarget = $("#typing-text");

    if (typingTarget) {

        const phrases = [
            "Instagram Reels & Shorts",
            "YouTube Videos",
            "Advertisement Videos",
            "Color Grading",
            "Social Media Marketing"
        ];

        if (typeof Typed !== "undefined" && !reducedMotion) {

            new Typed("#typing-text", {
                strings: phrases,
                typeSpeed: 55,
                backSpeed: 30,
                backDelay: 1600,
                loop: true
            });

        } else {

            typingTarget.textContent = phrases[0];

        }

    }


    /* ---------- MOBILE MENU ---------- */

    const menuButton = $(".menu-icon");
    const navLinks = $(".nav-links");

    if (menuButton && navLinks) {

        const menuIcon = $("i", menuButton);

        function setMenu(open) {

            navLinks.classList.toggle("active", open);

            menuButton.setAttribute("aria-expanded", String(open));

            menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");

            if (menuIcon) {
                menuIcon.classList.toggle("fa-bars", !open);
                menuIcon.classList.toggle("fa-xmark", open);
            }

            document.body.style.overflow = open ? "hidden" : "";

        }

        menuButton.addEventListener("click", () => {
            setMenu(!navLinks.classList.contains("active"));
        });

        $$("a", navLinks).forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") setMenu(false);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) setMenu(false);
        });

    }


    /* ---------- SCROLL PROGRESS BAR ---------- */

    const progressBar = $("#scroll-progress");

    if (progressBar) {

        const updateProgress = () => {

            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;

            const percent =
                scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

            progressBar.style.width = percent + "%";

        };

        window.addEventListener("scroll", updateProgress, { passive: true });

        updateProgress();

    }


    /* ---------- FAQ ACCORDION ---------- */

    const faqItems = $$(".faq-item");

    faqItems.forEach(item => {

        const question = $(".faq-question", item);
        const answer = $(".faq-answer", item);

        if (!question || !answer) return;

        question.setAttribute("aria-expanded", "false");

        question.addEventListener("click", () => {

            const willOpen = !item.classList.contains("active");

            faqItems.forEach(other => {

                other.classList.remove("active");

                const otherQuestion = $(".faq-question", other);
                const otherAnswer = $(".faq-answer", other);

                if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
                if (otherAnswer) otherAnswer.style.maxHeight = "";

            });

            if (willOpen) {

                item.classList.add("active");

                question.setAttribute("aria-expanded", "true");

                answer.style.maxHeight = answer.scrollHeight + "px";

            }

        });

    });


    /* ---------- VIDEO FALLBACKS ---------- */

    // Agar video load nahi hota to gradient fallback dikhao (blank space nahi)

    function watchVideo(video, onFail) {

        const sources = $$("source", video);

        const lastSource = sources[sources.length - 1];

        let failed = false;

        const fail = () => {
            if (failed) return;
            failed = true;
            console.warn(
                "Video load nahi hui: " + (sources[0] ? sources[0].getAttribute("src") : "?") +
                " -> file ka naam, folder aur format (H.264 .mp4) check karo. " +
                "Detail ke liye check-videos.html kholo."
            );
            onFail();
        };

        if (lastSource) lastSource.addEventListener("error", fail);

        video.addEventListener("error", fail);

    }

    const hero = $(".hero");
    const heroVideo = $(".hero-video");

    if (hero && heroVideo) {

        if (reducedMotion || saveData) {

            heroVideo.remove();

            hero.classList.add("video-failed");

        } else {

            watchVideo(heroVideo, () => {
                heroVideo.remove();
                hero.classList.add("video-failed");
            });

        }

    }

    $$(".portfolio-card").forEach(card => {

        const video = $("video", card);

        if (video) watchVideo(video, () => card.classList.add("video-failed"));

    });


    /* ---------- SOCIAL LINKS (from config.js) ---------- */

    $$("[data-social]").forEach(link => {

        const url = (cfg.social || {})[link.dataset.social];

        if (url) {

            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

        } else {

            link.hidden = true;

        }

    });

    $$("[data-social-group]").forEach(group => {

        const visible = $$("[data-social]", group).some(link => !link.hidden);

        if (!visible) group.hidden = true;

    });


    /* ---------- FOOTER YEAR ---------- */

    $$("[data-year]").forEach(el => {
        el.textContent = new Date().getFullYear();
    });

})();


/* =====================================================
   FORM SENDER (contact.js aur newsletter.js use karte hain)
   Content-Type text/plain rakha hai taaki browser CORS
   preflight na bheje, Google Apps Script isi se chalta hai.
===================================================== */

window.EDITKARO = window.EDITKARO || {};

window.EDITKARO.send = async function (payload) {

    const url = window.EDITKARO.scriptURL;

    if (!url) throw new Error("scriptURL config.js me set nahi hai");

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow"
    });

    if (!response.ok) throw new Error("HTTP " + response.status);

    const result = await response.json();

    if (result.status !== "success") {
        throw new Error(result.message || "Request failed");
    }

    return result;

};

/* Link se aane par (services.html#gaming) layout poora load hone ke baad sahi card tak scroll karo */
window.addEventListener("load", function () {

    if (!location.hash) return;

    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));

    if (target) setTimeout(function () { target.scrollIntoView({ block: "start" }); }, 150);

});
