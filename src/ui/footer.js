export const FooterUI = {
    init() {
      const footer = document.getElementById("appFooter");
      if (!footer) return;
  
      const year = new Date().getFullYear();
  
      footer.innerHTML = `
        <div class="footer-inner">
          <p>© ${year} Munyaradzi Chiondegwa TaskFlow App — All Rights Reserved</p>
  
          <div class="footer-links">
            <a href="https://github.com/" target="_blank">GitHub</a>
            <a href="https://linkedin.com/" target="_blank">LinkedIn</a>
            <a href="https://facebook.com/" target="_blank">Facebook</a>
            <a href="https://x.com/" target="_blank">X</a>
          </div>
        </div>
      `;
    }
  };
  