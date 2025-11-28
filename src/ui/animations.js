export const UIAnimations = {
    init() {
      // Fade-in animation for page sections
      const sections = document.querySelectorAll(".fade-section");
      sections.forEach((el, i) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(10px)";
        setTimeout(() => {
          el.style.transition = "all 0.6s ease";
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }, 120 * i);
      });
  
      // Button ripple effect
      document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", function (e) {
          const circle = document.createElement("span");
          circle.classList.add("ripple");
          const diameter = Math.max(btn.clientWidth, btn.clientHeight);
          circle.style.width = circle.style.height = `${diameter}px`;
          circle.style.left = `${e.clientX - btn.offsetLeft - diameter / 2}px`;
          circle.style.top = `${e.clientY - btn.offsetTop - diameter / 2}px`;
          btn.appendChild(circle);
          setTimeout(() => circle.remove(), 600);
        });
      });
    }
  };
  