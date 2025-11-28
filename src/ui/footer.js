export const FooterUI = {
  init() {
    const footer = document.getElementById("appFooter");
    if (!footer) return;

    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="footer-inner">
        <p>© ${year} Munyaradzi Chiondegwa TaskFlow App — All Rights Reserved</p>

        <div class="footer-links">
          <a href="https://github.com/munyaradzichiondegwa/munyaradzi-chiondegwa-profile" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/in/munyaradzi-chiondegwa/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://www.facebook.com/nevanjimunya.chiondegwa" target="_blank" rel="noopener">Facebook</a>
          <a href="https://x.com/nnehoreka" target="_blank" rel="noopener">X</a>
        </div>
      </div>
    `;
  }
};

  