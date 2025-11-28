export const FooterUI = {
  init() {
    const footer = document.getElementById("appFooter");
    if (!footer) return;

    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="footer-inner">
        <p>© ${year} Munyaradzi Chiondegwa TaskFlow App — All Rights Reserved</p>
        <p id="footerDateTime"></p>

        <div class="footer-links">

          <a href="https://github.com/munyaradzichiondegwa/munyaradzi-chiondegwa-profile" 
             target="_blank" rel="noopener" class="icon-link">
            <!-- GitHub SVG -->
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56 
              0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 
              1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.74 1.27 3.41.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.71 
              0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a10.9 10.9 0 0 1 2.9-.39 
              10.9 10.9 0 0 1 2.9.39c2.21-1.5 3.18-1.19 3.18-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.85 
              1.19 3.11 0 4.44-2.69 5.42-5.25 5.7.42.36.8 1.09.8 2.2 0 1.59-.02 2.87-.02 3.26 
              0 .31.21.68.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
            </svg>
          </a>

          <a href="https://www.linkedin.com/in/munyaradzi-chiondegwa/" 
             target="_blank" rel="noopener" class="icon-link">
            <!-- LinkedIn SVG -->
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.49a2.5 2.5 0 0 1-.02-4.99M3 9h4v12H3zm7 0h3.8v1.7h.06a4.16 4.16 0 0 1 3.74-2.06c4 0 4.74 2.64 4.74 6.07V21H18v-5.33c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4z"/>
            </svg>
          </a>

          <a href="https://www.facebook.com/nevanjimunya.chiondegwa" 
             target="_blank" rel="noopener" class="icon-link">
            <!-- Facebook SVG -->
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.3V12h2.3V9.78c0-2.28 1.36-3.54 3.44-3.54.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.42V12h2.5l-.4 2.88h-2.1v6.99A10 10 0 0 0 22 12"/>
            </svg>
          </a>

          <a href="https://x.com/nnehoreka" 
             target="_blank" rel="noopener" class="icon-link">
            <!-- X (Twitter) SVG -->
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 2H21l-6.3 7.2L22 22h-6.8l-4.7-6.2L4 22H1.3l6.8-7.7L2 2h6.8l4.2 5.5L18.3 2Zm-2.4 17h1.1L8 5h-1L15.9 19Z"/>
            </svg>
          </a>

        </div>
      </div>
    `;

    // Update date and time every second
    const dateTimeElem = document.getElementById("footerDateTime");
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      dateTimeElem.textContent = formatted;
    };
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }
};
