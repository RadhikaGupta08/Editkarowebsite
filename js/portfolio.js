/* =====================================================
   EDITKARO — PORTFOLIO (filter + video preview)
===================================================== */

(function () {

    /* ---------- FILTER ---------- */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".portfolio-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            const filter = button.getAttribute("data-filter");

            cards.forEach(card => {

                const show = filter === "all" || filter === card.getAttribute("data-category");

                clearTimeout(card._hideTimer);

                if (show) {

                    card.style.display = "block";

                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 100);

                } else {

                    card.style.opacity = "0";
                    card.style.transform = "scale(.8)";

                    card._hideTimer = setTimeout(() => {
                        card.style.display = "none";
                    }, 300);

                }

            });

        });

    });


    /* ---------- VIDEO PREVIEW ---------- */

    // Overlay poore card ko dhakta hai, isliye hover video par nahi
    // balki card par sun'na padta hai.

    function play(video) {
        const p = video.play();
        if (p) p.catch(() => {});
    }

    function stop(video) {
        video.pause();
        video.currentTime = 0;
    }

    const touchOnly = window.matchMedia("(hover: none)").matches;

    cards.forEach(card => {

        const video = card.querySelector("video");

        if (!video) return;

        if (!touchOnly) {

            // Desktop: mouse le jane par chalti hai
            card.addEventListener("mouseenter", () => play(video));
            card.addEventListener("mouseleave", () => stop(video));

        }

        // Click / tap par fullscreen
        card.addEventListener("click", event => {

            if (event.target.closest("a")) return;

            play(video);

            if (video.requestFullscreen) video.requestFullscreen().catch(() => {});

        });

    });

    // Phone/tablet: hover nahi hota, isliye screen par aane par chalao
    if (touchOnly && "IntersectionObserver" in window) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                const video = entry.target.querySelector("video");

                if (!video) return;

                if (entry.isIntersecting) play(video);
                else video.pause();

            });

        }, { threshold: 0.6 });

        cards.forEach(card => observer.observe(card));

    }

})();
