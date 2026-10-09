// Keep shared footer content in one place so every page stays consistent.
const footerMarkup = `
    <div class="footer-divider" aria-hidden="true"></div>
    <div class="footer-grid">
        <div class="footer-brand-block">
            <a class="brand" href="index.html">MAX <span>KITCHEN</span></a>
            <p>Contemporary Nigerian dining shaped by generous hospitality, honest fire and thoughtful detail.</p>
            <div class="footer-socials" aria-label="Social media links">
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><span aria-hidden="true">ig</span></a>
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span aria-hidden="true">f</span></a>
                <a href="https://wa.me/2348102088263" target="_blank" rel="noreferrer" aria-label="WhatsApp"><span aria-hidden="true">wa</span></a>
            </div>
        </div>
        <div class="footer-column">
            <p class="footer-heading">Navigate</p>
            <nav class="footer-links" aria-label="Footer navigation"><a href="index.html">Home</a><a href="menu.html">Menu</a><a href="about.html">About</a><a href="gallery.html">Gallery</a><a href="contact.html">Contact</a><a href="tracking.html">Track Order</a><a href="reservation.html">Reservations</a></nav>
        </div>
        <div class="footer-column">
            <p class="footer-heading">Visit</p>
            <p>Monday - Thursday<br><strong>12:00 PM - 10:00 PM</strong></p>
            <p>Friday - Saturday<br><strong>12:00 PM - 11:00 PM</strong></p>
            <p>Sunday<br><strong>1:00 PM - 9:00 PM</strong></p>
        </div>
        <div class="footer-column footer-contact">
            <p class="footer-heading">Contact</p>
            <address>12 Quarry Road · GRA<br>Abeokuta, Ogun State</address>
            <a href="tel:08102088263">08102088263</a>
            <a href="mailto:Abolanlemicky@gmail.com">Abolanlemicky@gmail.com</a>
        </div>
        <div class="footer-newsletter">
            <p class="footer-heading">Stay in the know</p>
            <p>Occasional notes from our kitchen and table.</p>
            <form class="newsletter-form" data-newsletter-form>
                <label class="sr-only" for="newsletter-email">Email address</label>
                <input id="newsletter-email" type="email" placeholder="Your email address" required>
                <button type="submit" aria-label="Join newsletter">→</button>
            </form>
            <p class="newsletter-status" data-newsletter-status aria-live="polite">Frontend-only signup demonstration.</p>
        </div>
    </div>
    <div class="footer-bottom"><p>© 2026 MAX KITCHEN. All rights reserved.</p><p>Abeokuta, Nigeria</p></div>
`;

// Mount the semantic footer after the document has been parsed.
document.querySelectorAll('[data-site-footer]').forEach((footer) => {
    footer.innerHTML = footerMarkup;
});
