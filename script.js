const clarityProjectId = document.documentElement.dataset.clarityProjectId;

if (clarityProjectId) {
  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${clarityProjectId}`;
  document.head.append(script);

  document.querySelectorAll("[data-track-link]").forEach((link) => {
    link.addEventListener("click", () => window.clarity("event", `link_${link.dataset.trackLink}`));
  });

  const observed = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const section = entry.target.dataset.trackSection;
      if (entry.isIntersecting && !observed.has(section)) {
        observed.add(section);
        window.clarity("event", `section_${section}`);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll("[data-track-section]").forEach((section) => observer.observe(section));
}
