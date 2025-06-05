document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual submission

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let errors = [];

            if (!name) {
                errors.push("Name is required.");
            }
            if (!email) {
                errors.push("Email is required.");
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push("Please enter a valid email address.");
            }
            if (!message) {
                errors.push("Message is required.");
            }

            formFeedback.className = 'form-feedback'; // Reset classes
            formFeedback.innerHTML = ''; // Clear previous feedback
            formFeedback.style.display = 'none'; // Ensure it's hidden before animation

            if (errors.length > 0) {
                formFeedback.classList.add('error');
                formFeedback.innerHTML = errors.join('<br>');
                formFeedback.style.display = 'block'; // Make it visible before animating
                // Check if gsap is available before using it
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(formFeedback, {opacity:0, y:-10}, {opacity:1, y:0, duration:0.3});
                }
            } else {
                formFeedback.classList.add('success');
                formFeedback.textContent = "Message sent successfully! (This is a demo)";
                formFeedback.style.display = 'block'; // Make it visible before animating
                // Check if gsap is available
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(formFeedback, {opacity:0, y:-10}, {opacity:1, y:0, duration:0.3});
                }

                // Optionally clear the form
                // contactForm.reset();

                // Simulate sending and then fade out success message
                setTimeout(() => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(formFeedback, {opacity:0, y:-10, duration:0.3, onComplete: () => {
                           formFeedback.style.display = 'none'; // Hide after animation
                           formFeedback.className = 'form-feedback'; // Reset class
                        }});
                    } else {
                        formFeedback.style.display = 'none'; // Hide if GSAP not available
                        formFeedback.className = 'form-feedback';
                    }
                }, 3000);
            }
        });
    }
});
