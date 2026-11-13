/* =====================================================
   EDITKARO — NEWSLETTER FORM
===================================================== */

(function () {

    const form = document.getElementById("newsletter-form");

    if (!form) return;

    const input = document.getElementById("newsletter-email");
    const button = form.querySelector("button");

    // Form ke neeche chhota status message
    let note = form.parentElement.querySelector(".newsletter-note");

    if (!note) {
        note = document.createElement("p");
        note.className = "newsletter-note";
        note.setAttribute("role", "status");
        note.setAttribute("aria-live", "polite");
        form.insertAdjacentElement("afterend", note);
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = input.value.trim();

        const label = button.textContent;

        button.disabled = true;

        button.textContent = "Subscribing...";

        note.textContent = "";

        try {

            await window.EDITKARO.send({ type: "newsletter", email: email });

            note.textContent = "✅ Thanks for subscribing!";

            note.style.color = "#22c55e";

            form.reset();

        } catch (error) {

            console.error(error);

            note.textContent = "❌ Subscription failed. Please try again.";

            note.style.color = "#ef4444";

        } finally {

            button.disabled = false;

            button.textContent = label;

        }

    });

})();
