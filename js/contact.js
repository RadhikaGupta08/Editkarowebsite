/* =====================================================
   EDITKARO — CONTACT FORM
===================================================== */

(function () {

    const form = document.getElementById("contact-form");

    if (!form) return;

    const status = document.getElementById("form-message");
    const submitButton = form.querySelector("button[type='submit']");

    function showStatus(text, ok) {

        if (!status) return;

        status.textContent = text;

        status.style.color = ok ? "#22c55e" : "#ef4444";

    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Honeypot: bots ye hidden field bhar dete hain
        const trap = form.querySelector("[name='website']");

        if (trap && trap.value) {
            form.reset();
            return;
        }

        const data = {
            type: "contact",
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            phone: form.elements.phone.value.trim(),
            message: form.elements.message.value.trim()
        };

        if (!data.name || !data.message) {
            showStatus("Please fill in your name and message.", false);
            return;
        }

        if (!/^[+()\d\s-]{8,18}$/.test(data.phone)) {
            showStatus("Please enter a valid phone number.", false);
            return;
        }

        const originalLabel = submitButton ? submitButton.textContent : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        showStatus("", true);

        try {

            await window.EDITKARO.send(data);

            showStatus("✅ Message sent! We'll get back to you soon.", true);

            form.reset();

        } catch (error) {

            console.error(error);

            showStatus("❌ Message could not be sent. Please try again or email us directly.", false);

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }

        }

    });

})();
