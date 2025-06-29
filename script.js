document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".sidebar nav a");
  const sections = document.querySelectorAll("main section");

  function activateLink(hash) {
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      }
    });
  }

  function scrollToSection(hash) {
    const section = document.querySelector(hash);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const hash = this.getAttribute("href");
      activateLink(hash);
      scrollToSection(hash);
    });
  });

  // Activate current section based on URL hash
  if (window.location.hash) {
    activateLink(window.location.hash);
    scrollToSection(window.location.hash);
  }
});
document.querySelectorAll(".skills li").forEach(item => {
  item.addEventListener("click", () => {
    item.classList.add("clicked");
    setTimeout(() => {
      item.classList.remove("clicked");
    }, 400); // Effect lasts 400ms
  });
});
