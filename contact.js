// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // In a real application, this would send data to a server
    console.log('Form submitted:', { name, email, subject, message });

    // Show success message
    alert(`Thank you, ${name}! Your message has been sent successfully. We'll get back to you at ${email} soon.`);

    // Reset form
    this.reset();
});
